import { z } from "zod";
import { Entity, EntityId, OwnFields } from "../domain/types";
import { AppRepository } from "../models/AppRepository";

export abstract class BaseService<T extends Entity> {
  constructor(protected repo: AppRepository) {}

  abstract get schema(): z.ZodObject<z.ZodRawShape, 'strip', z.ZodTypeAny, T, T>;

  abstract get tableName(): string;

  public getDB(dbKey: string) {
    return this.repo.getDB(dbKey);
  }

  public fromRow(row: Record<string, any>): T {
    return this.schema.parse(row);
  }

  public toRow(entity: Partial<T>): Record<string, any> {
    return entity;
  }

  public async find(dbKey: string, data: Partial<T>): Promise<T[]> {
    const db = this.getDB(dbKey);
    const rows = await db.find(this.tableName, data);
    return rows.map((row) => this.fromRow(row));
  }

  public async get(dbKey: string, id: EntityId): Promise<T> {
    const db = this.getDB(dbKey);
    const row = await db.get(this.tableName, { id });
    return this.fromRow(row);
  }

  public async create(dbKey: string, data: OwnFields<T>): Promise<T> {
    const db = this.getDB(dbKey);
    const entity = {
      ...data,
      id: db.uuid(),
      dateCreated: new Date(),
      dateModified: null,
    } as T;
    await db.save(this.tableName, this.toRow(entity));
    return entity;
  }

  public async delete(dbKey: string, id: EntityId): Promise<boolean> {
    const db = this.getDB(dbKey);
    const result = await db.delete(this.tableName, { id });
    return result > 0;
  }

  public async update(dbKey: string, id: EntityId, newValues: Partial<OwnFields<T>>): Promise<number> {
    const db = this.getDB(dbKey);
    if (Object.keys(newValues).length === 0) {
      return 0; // Cannot update with no values
    }
    const row = this.toRow({ ...newValues, dateModified: new Date() } as Partial<T>);
    return await db.update(this.tableName, { id }, row);
  }
} // class BaseService
