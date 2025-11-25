import sqlite3 from 'sqlite3';
import { v4 as uuid4 } from 'uuid';
import { UserRole } from '../domain/types';
import { passwordHash } from '../utils/auth';

export interface DatabaseSQLite3Config {
  filename?: string,
  logger?: (message: string) => void,
  verbose?: boolean,
}

export class DatabaseSQLite3 {
  public readonly filename: string;
  public readonly logger?: (message: string) => void;
  public readonly verbose: boolean;
  private _db: sqlite3.Database | null = null;

  constructor(config: DatabaseSQLite3Config) {
    const {
      filename = ':memory:',
      logger,
      verbose = false,
    } = config ?? {};
    this.filename = filename;
    this.logger = logger;
    this.verbose = verbose;
  }

  public get db() {
    if (this._db === null) {
      throw Error(`Database <${this.filename}> is not initialized!`);
    }
    return this._db;
  }

  public async close(): Promise<void> {
    const { filename, logger } = this;
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger?.(`Closing database <${filename}> failed with ${JSON.stringify(err.message)}!`);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async run(query: string, params?: any[]): Promise<sqlite3.RunResult> {
    const { logger } = this;
    return new Promise((resolve, reject) => {
      const log = [`SQL: ${query.replace(/\s+/g, ' ')}`]
      if (params) {
        log.push(`- params ${JSON.stringify(params)}`);
      }
      this.db.run(query, params, function (err) {
        if (err) {
          logger?.([...log, `- failed with ${JSON.stringify(err.message)}!`].join('\n'));
          reject(err);
        } else {
          logger?.([...log, `- changed ${this.changes} rows.`].join('\n'));
          resolve(this);
        }
      });
    });
  }

  public async all<T>(query: string, params: any[]): Promise<T[]> {
    const { logger } = this;
    return new Promise((resolve, reject) => {
      const log = [`SQL: ${query.replace(/\s+/g, ' ')}`];
      if (params) {
        log.push(`- params ${JSON.stringify(params)}`);
      }
      this.db.all<T>(query, params, (err, rows) => {
        if (err) {
          logger?.([...log, `- failed with ${JSON.stringify(err.message)}!`].join('\n'));
          reject(err);
        } else {
          logger?.([...log, `- returned ${rows.length} rows.`].join('\n'));
          resolve(rows);
        }
      });
    });
  }

  checkTableName(table: string): void {
    if (!/[a-zA-Z_]\w*/.test(table)) {
      throw new Error(`Table name ${JSON.stringify(table)} is not valid!`);
    }
  }

  public async find(table: string, keys: Record<string, any> = {}): Promise<Record<string, any>[]> {
    this.checkTableName(table);
    const conditions = Object.keys(keys).map(key => `${key} = ?`).join(' AND ');
    const params = Object.values(keys);
    const query = `SELECT * FROM ${table}${conditions ? ' WHERE ' + conditions : ''}`;
    return await this.all(query, params);
  }

  public async get(table: string, keys: Record<string, any> = {}): Promise<Record<string, any>> {
    const found = await this.find(table, keys);
    if (found.length !== 1) {
      throw new Error(`Expected to find exactly one row but found ${found.length || 'no'} rows.`);
    }
    return found[0];
  }

  public uuid(): string {
    return uuid4();
  }

  public async save(table: string, record: Record<string, any>): Promise<void> {
    this.checkTableName(table);
    const columns = Object.keys(record).join(', ');
    const placeholders = Object.keys(record).map(() => '?').join(', ');
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const params = Object.values(record);
    await this.run(query, params);
  }

  public async delete(table: string, record: Record<string, any>): Promise<number> {
    this.checkTableName(table);
    const conditions = Object.keys(record).map(key => `${key} = ?`).join(' AND ');
    const params = Object.values(record);
    const query = `DELETE FROM ${table} WHERE ${conditions}`;
    const { changes } = await this.run(query, params);
    return changes;
  }

  public async update(table: string, keys: Record<string, any>, values: Record<string, any>): Promise<number> {
    this.checkTableName(table);
    const setClause = Object.keys(values).map(key => `${key} = ?`).join(', ');
    const conditions = Object.entries(keys).map(([key, keyValue]) => (
      keyValue === null ? `${key} IS NULL` : `${key} = ?`)
    ).join(' AND ');
    const params = Object.values(values).concat(Object.values(keys).filter(v => v !== null));
    const query = `UPDATE ${table} SET ${setClause} ${conditions ? ' WHERE ' + conditions : ''}`;
    const { changes } = await this.run(query, params);
    return changes;
  }

  public async createTables(): Promise<void> {
    const createTableSQL = (tableName: string, columns: string) => {
      this.checkTableName(tableName);
      return `\
        CREATE TABLE IF NOT EXISTS ${tableName} (  
          id TEXT PRIMARY KEY,
          dateCreated DATETIME NOT NULL,
          dateModified DATETIME,
          ${columns}
        ) WITHOUT ROWID
      `;
    };
    await this.run('PRAGMA foreign_keys = ON;');
    await this.run(createTableSQL('users', `
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      tokenVersion INTEGER NOT NULL DEFAULT 0
    `));
    await this.run(createTableSQL('tournaments', `
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      beginning DATETIME,
      ending DATETIME
    `));
    await this.run(createTableSQL('teams', `
      title TEXT NOT NULL,
      description TEXT NOT NULL
    `));
    await this.run(createTableSQL('matches', `
      title TEXT NOT NULL,
      date DATETIME NOT NULL,
      tournament TEXT NOT NULL REFERENCES tournaments (id),
      homeTeam TEXT REFERENCES teams (id),
      awayTeam TEXT REFERENCES teams (id),
      homeScore INTEGER,
      awayScore INTEGER,
      CHECK (homeTeam != awayTeam),
      CHECK (homeScore IS NULL AND awayScore IS NULL OR homeScore >= 0 AND awayScore >= 0)
    `));
    await this.run(createTableSQL('invitations', `
      invitedGambler TEXT NOT NULL REFERENCES users (id),
      invitingManager TEXT NOT NULL REFERENCES users (id),
      tournament TEXT NOT NULL REFERENCES tournaments (id),
      acceptedAt DATETIME,
      revokedAt DATETIME,
      UNIQUE (invitedGambler, tournament)
    `));
    await this.run(createTableSQL('gambles', `
      user TEXT NOT NULL REFERENCES users (id),
      match TEXT NOT NULL REFERENCES matches (id),
      homeScore INTEGER NOT NULL,
      awayScore INTEGER NOT NULL,
      UNIQUE (user, match)
    `));
  } // createTables

  public async seedDatabase(): Promise<void> {
    this.logger?.(`Seeding database <${this.filename}>.`);
    const dateCreated = new Date().toISOString();
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [this.uuid(), dateCreated, 'admin@example.com', passwordHash('admin'), UserRole.Admin],
    );
    const proctorId = this.uuid();
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [proctorId, dateCreated, 'manager@example.com', passwordHash('manager'), UserRole.Manager],
    );
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [this.uuid(), dateCreated, 'gambler@example.com', passwordHash('gambler'), UserRole.Gambler],
    );
    const tournamentId = this.uuid();
    await this.run(
      `INSERT INTO tournaments (id, dateCreated, name, description, beginning, ending) VALUES (?, ?, ?, ?, ?, ?);`,
      [tournamentId, dateCreated, 'Test tournament 01', 'A test tournament description', dateCreated, null],
    );

    const teams = [
      { title: 'Test team 01', id: this.uuid() },
      { title: 'Test team 02', id: this.uuid() },
    ];
    for (const team of teams) {
      await this.run(
        `INSERT INTO teams (id, dateCreated, title, description) VALUES (?, ?, ?, ?);`,
        [team.id, dateCreated, team.title, 'Description for ' + team.title],
      );
    }
    await this.run(
      `INSERT INTO matches (id, dateCreated, title, date, tournament, homeTeam, awayTeam, homeScore, awayScore)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL);`, 
      [this.uuid(), dateCreated, 'Test match 01', dateCreated, tournamentId, teams[0].id, teams[1].id],
    );
    await this.run(
      `INSERT INTO matches (id, dateCreated, title, date, tournament, homeTeam, awayTeam, homeScore, awayScore)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL);`, 
      [this.uuid(), dateCreated, 'Test match 02', dateCreated, tournamentId, teams[1].id, teams[0].id],
    );
  } // seedDatabase

  public async load(initialize: boolean = false) {
    this.logger?.(`Initializing database <${this.filename}>.`);
    const sqliteModule = this.verbose ? sqlite3.verbose() : sqlite3;
    this._db = await new Promise((resolve, reject) => {
      const db = new sqliteModule.Database(this.filename, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
    if (initialize) {
      await this.createTables();
      await this.seedDatabase();
    }
  } // initialize

} // class DatabaseSQLite3
