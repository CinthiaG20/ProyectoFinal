import { matchSchema, tournamentSchema } from "../domain/schemas";
import { Match, Tournament } from "../domain/types";
import { BaseService } from "./base.service";

export class TournamentService extends BaseService<Tournament> {
  get tableName(): string {
    return 'tournaments';
  }

  get schema() {
    return tournamentSchema;
  }

  public async tournamentMatches(dbKey: string, tournamentId: string): Promise<Match[]> {
    const db = this.getDB(dbKey);
    const rows = await db.find('matches', { tournament: tournamentId });
    return rows.map((row) => matchSchema.parse(row));
  }

  public async myTournament(dbKey: string, gamblerId: string, tournamentId?: string): Promise<Tournament[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT t.* FROM tournaments t
        INNER JOIN invitations i ON i.tournament = t.id
      WHERE i.acceptedAt IS NOT NULL AND i.revokedAt IS NULL
      AND i.invitedGambler = ? ${tournamentId ? 'AND t.id = ?' : ''}`,
      tournamentId ? [gamblerId, tournamentId] : [gamblerId],
    );
    return rows.map((row) => this.fromRow(row));
  }

  public async myMatches(dbKey: string, gamblerId: string, tournamentId?: string): Promise<Match[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT m.* FROM matches m 
        INNER JOIN invitations i ON m.tournament = i.tournament
      WHERE i.acceptedAt IS NOT NULL AND i.revokedAt IS NULL
      AND i.invitedGambler = ? ${tournamentId ? 'AND m.tournament = ?' : ''}`,
      tournamentId ? [gamblerId, tournamentId] : [gamblerId],
    );
    return rows.map((row) => matchSchema.parse(row));
  }
}