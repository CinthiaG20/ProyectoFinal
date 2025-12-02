import { matchSchema, tournamentSchema } from "../domain/schemas";
import { MatchWithTeams, Tournament } from "../domain/types";
import { BaseService } from "./base.service";

export class TournamentService extends BaseService<Tournament> {
  get tableName(): string {
    return "tournaments";
  }

  get schema() {
    return tournamentSchema;
  }

  public async tournamentMatches(
    dbKey: string,
    tournamentId: string
  ): Promise<MatchWithTeams[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT 
        m.*,
        ht.id as homeTeam_id,
        ht.title as homeTeam_title,
        ht.description as homeTeam_description,
        COALESCE(ht.logo, NULL) as homeTeam_logo,
        at.id as awayTeam_id,
        at.title as awayTeam_title,
        at.description as awayTeam_description,
        COALESCE(at.logo, NULL) as awayTeam_logo
      FROM matches m
      LEFT JOIN teams ht ON m.homeTeam = ht.id
      LEFT JOIN teams at ON m.awayTeam = at.id
      WHERE m.tournament = ?`,
      [tournamentId]
    );

    return rows.map((row) => {
      const match = matchSchema.parse({
        id: row.id,
        dateCreated: row.dateCreated,
        dateModified: row.dateModified,
        title: row.title,
        date: row.date,
        tournament: row.tournament,
        homeTeam: row.homeTeam,
        awayTeam: row.awayTeam,
        homeScore: row.homeScore,
        awayScore: row.awayScore,
      });

      return {
        ...match,
        homeTeam: {
          id: row.homeTeam_id,
          title: row.homeTeam_title,
          description: row.homeTeam_description,
          logo: row.homeTeam_logo,
        },
        awayTeam: {
          id: row.awayTeam_id,
          title: row.awayTeam_title,
          description: row.awayTeam_description,
          logo: row.awayTeam_logo,
        },
      } as MatchWithTeams;
    });
  }

  public async myTournament(
    dbKey: string,
    gamblerId: string,
    tournamentId?: string
  ): Promise<Tournament[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT t.* FROM tournaments t
        INNER JOIN invitations i ON i.tournament = t.id
      WHERE i.acceptedAt IS NOT NULL AND i.revokedAt IS NULL
      AND i.invitedGambler = ? ${tournamentId ? "AND t.id = ?" : ""}`,
      tournamentId ? [gamblerId, tournamentId] : [gamblerId]
    );
    return rows.map((row) => this.fromRow(row));
  }

  public async myMatches(
    dbKey: string,
    gamblerId: string,
    tournamentId?: string
  ): Promise<MatchWithTeams[]> {
    const db = this.getDB(dbKey);
    const rows = await db.all<Record<string, any>>(
      `SELECT 
        m.*,
        ht.id as homeTeam_id,
        ht.title as homeTeam_title,
        ht.description as homeTeam_description,
        COALESCE(ht.logo, NULL) as homeTeam_logo,
        at.id as awayTeam_id,
        at.title as awayTeam_title,
        at.description as awayTeam_description,
        COALESCE(at.logo, NULL) as awayTeam_logo
      FROM matches m 
      INNER JOIN invitations i ON m.tournament = i.tournament
      LEFT JOIN teams ht ON m.homeTeam = ht.id
      LEFT JOIN teams at ON m.awayTeam = at.id
      WHERE i.acceptedAt IS NOT NULL AND i.revokedAt IS NULL
      AND i.invitedGambler = ? ${tournamentId ? "AND m.tournament = ?" : ""}`,
      tournamentId ? [gamblerId, tournamentId] : [gamblerId]
    );

    return rows.map((row) => {
      const match = matchSchema.parse({
        id: row.id,
        dateCreated: row.dateCreated,
        dateModified: row.dateModified,
        title: row.title,
        date: row.date,
        tournament: row.tournament,
        homeTeam: row.homeTeam,
        awayTeam: row.awayTeam,
        homeScore: row.homeScore,
        awayScore: row.awayScore,
      });

      return {
        ...match,
        homeTeam: {
          id: row.homeTeam_id,
          title: row.homeTeam_title,
          description: row.homeTeam_description,
          logo: row.homeTeam_logo,
        },
        awayTeam: {
          id: row.awayTeam_id,
          title: row.awayTeam_title,
          description: row.awayTeam_description,
          logo: row.awayTeam_logo,
        },
      } as MatchWithTeams;
    });
  }
}
