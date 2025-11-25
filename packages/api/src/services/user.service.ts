import { userSchema } from "../domain/schemas";
import { EntityId, type Login, type OwnFields, type User } from "../domain/types";
import { comparePassword, passwordHash, userToken } from "../utils/auth";
import { BaseService } from "./base.service";

export class UserService extends BaseService<User> {
  get tableName(): string {
    return 'users';
  }

  get schema() {
    return userSchema;
  }

  public async login(
    dbKey: string, credentials: Pick<User, 'email' | 'password'>,
  ): Promise<Login | null> {
    const { email, password } = credentials;
    const db = this.getDB(dbKey);
    const result = await db.get(this.tableName, { email });
    const user = this.fromRow(result);
    const passwordMatch = comparePassword(password, user.password);
    if (!passwordMatch) {
      return null;
    }
    const token = userToken(user);
    return { token, email, role: user.role, userId: user.id };
  }

  public async create(dbKey: string, data: Omit<OwnFields<User>, 'tokenVersion'>): Promise<User> {
    return super.create(dbKey, {
      ...data,
      password: await passwordHash(data.password),
      tokenVersion: 0,
    });
  }

  public async update(dbKey: string, id: EntityId, newValues: Partial<OwnFields<User>>): Promise<number> {
    if (newValues.password) {
      newValues.password = await passwordHash(newValues.password);
    }
    return super.update(dbKey, id, newValues);
  }

  public async logout(dbKey: string, userId: EntityId): Promise<boolean> {
    const db = this.getDB(dbKey);
    const result = await db.run(
      `UPDATE ${this.tableName} SET tokenVersion = tokenVersion + 1 WHERE id = ?`,
      [userId],
    );
    return result.changes > 0;
  }

} // class UserService