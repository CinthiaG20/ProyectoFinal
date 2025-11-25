import { gambleSchema, rankingSchema } from "../domain/schemas";
import { EntityId, Gamble, OwnFields, Ranking } from "../domain/types";
import { BaseService } from "./base.service";

export class GambleService extends BaseService<Gamble> {
  get tableName(): string {
    return 'gambles';
  }

  get schema() {
    return gambleSchema;
  }

  public async canUserGamble(dbKey: string, user: EntityId, match: EntityId): Promise<boolean> {
    const db = this.getDB(dbKey);
    const rows = await db.all(
      `SELECT m.tournament
      FROM matches m INNER JOIN invitations i ON i.tournament = m.tournament
      WHERE m.id = ? AND i.invitedGambler = ?
      AND i.acceptedAt IS NOT NULL AND i.revokedAt IS NULL`,
      [match, user],
    );
    return rows.length > 0;
  }

  public async canUserUpdateGamble(dbKey: string, gambleId: EntityId): Promise<boolean> {
    const db = this.getDB(dbKey);
    const rows = await db.all(
      `SELECT g.id
      FROM gambles g INNER JOIN matches m ON g.match = m.id
      WHERE m.homeScore IS NULL AND m.awayScore IS NULL AND g.id = ?`,
      [gambleId],
    );
    return rows.length > 0;
  }

  public async create(dbKey: string, data: OwnFields<Gamble>): Promise<Gamble> {
    const db = this.getDB(dbKey);
    if (!(await this.canUserGamble(dbKey, data.user, data.match))) {
      throw new Error(`User ${data.user} cannot gamble on match ${data.match}!`);
    }
    const entity = {
      ...data,
      id: db.uuid(),
      dateCreated: new Date(),
      dateModified: null,
    } as Gamble;
    await db.save(this.tableName, this.toRow(entity));
    return entity;
  }

  public async deleteForUser(dbKey: string, id: EntityId, user: EntityId): Promise<boolean> {
    const db = this.getDB(dbKey);
    if (!(await this.canUserUpdateGamble(dbKey, id))) {
      throw new Error(`Gamble ${id} cannot be deleted!`);
    }
    const result = await db.delete(this.tableName, { id, user });
    return result > 0;
  }

  public async update(dbKey: string, id: EntityId, values: Partial<OwnFields<Gamble>>): Promise<number> {
    const db = this.getDB(dbKey);
    if (!(await this.canUserUpdateGamble(dbKey, id))) {
      throw new Error(`Gamble ${id} cannot be updated!`);
    }
    const { user, ...newValues } = values;
    if (Object.keys(newValues).length === 0) {
      return 0; // Cannot update with no values
    }
    const row = this.toRow({ ...newValues, dateModified: new Date() } as Partial<Gamble>);
    return await db.update(this.tableName, { id, user }, row);
  }

  public async tournamentGambles(dbKey: string, tournamentId: string): Promise<Gamble[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT g.*
      FROM gambles g INNER JOIN matches m ON g.match = m.id
      WHERE m.tournament = ?`,
      [tournamentId],
    );
    return rows.map((row) => this.fromRow(row));
  }

  public async tournamentRanking(dbKey: string, tournamentId: string): Promise<Ranking[]> {
    const db = this.getDB(dbKey);

    /* Points are calculated like so:
    - if the gamble matches the score perfectly: 5 points,
    - if the gamble matches the goal difference: 3 points,
    - if the gamble matches the outcome (win/loss/draw): 1 point,
    - else 0 points.
    */
    const rows = await db.all<Record<string, any>>(
      `SELECT i.invitedGambler AS user,
        SUM(CASE
          WHEN g.homeScore = m.homeScore AND g.awayScore = m.awayScore THEN 5
          WHEN g.homeScore - g.awayScore = m.homeScore - m.awayScore THEN 3
          WHEN sign(g.homeScore - g.awayScore) = sign(m.homeScore - m.awayScore) THEN 1
          ELSE 0
        END) AS points
      FROM invitations i
        LEFT OUTER JOIN gambles g ON i.invitedGambler = g.user
        LEFT OUTER JOIN matches m ON g.match = m.id AND m.tournament = i.tournament
      WHERE i.tournament = ?
      GROUP BY i.invitedGambler`,
      [tournamentId],
    );
    const points = new Set<number>(rows.map((row) => row.points));
    const pointsArray = Array.from(points).sort((a, b) => b - a);
    const pointsRankMap = new Map<number, number>(
      pointsArray.map((points, index) => [points, index + 1]),
    );
    return rows.map((row) => rankingSchema.parse({ ...row, rank: pointsRankMap.get(row.points) ?? null }));
  }
}
