<<<<<<< HEAD
import Database from "better-sqlite3";
=======
import sqlite3 from "sqlite3";
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
import { v4 as uuid4 } from "uuid";
import { UserRole } from "../domain/types";
import { passwordHash } from "../utils/auth";

export interface DatabaseSQLite3Config {
  filename?: string;
  logger?: (message: string) => void;
  verbose?: boolean;
}

export class DatabaseSQLite3 {
  public readonly filename: string;
  public readonly logger?: (message: string) => void;
  public readonly verbose: boolean;
  private _db: Database.Database | null = null;

  constructor(config: DatabaseSQLite3Config) {
    const { filename = ":memory:", logger, verbose = false } = config ?? {};
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
<<<<<<< HEAD
    if (this._db) this._db.close();
  }

  // Equivalent to sqlite3 run()
  public async run(query: string, params: any[] = []): Promise<{ changes: number }> {
    const stmt = this.db.prepare(query);
    const result = stmt.run(params);

    this.logger?.(
      [
        `SQL: ${query.replace(/\s+/g, " ")}`,
        params.length ? `- params: ${JSON.stringify(params)}` : "",
        `- changed: ${result.changes} rows.`
      ].join("\n")
    );

    return { changes: result.changes };
  }

  // Equivalent to sqlite3 all()
  public async all<T>(query: string, params: any[] = []): Promise<T[]> {
    const stmt = this.db.prepare(query);
    const rows = stmt.all(params);

    this.logger?.(
      [
        `SQL: ${query.replace(/\s+/g, " ")}`,
        params.length ? `- params: ${JSON.stringify(params)}` : "",
        `- returned: ${rows.length} rows.`
      ].join("\n")
    );

    return rows;
=======
    const { filename, logger } = this;
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          logger?.(
            `Closing database <${filename}> failed with ${JSON.stringify(err.message)}!`
          );
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
      const log = [`SQL: ${query.replace(/\s+/g, " ")}`];
      if (params) {
        log.push(`- params ${JSON.stringify(params)}`);
      }
      this.db.run(query, params, function (err) {
        if (err) {
          logger?.(
            [...log, `- failed with ${JSON.stringify(err.message)}!`].join("\n")
          );
          reject(err);
        } else {
          logger?.([...log, `- changed ${this.changes} rows.`].join("\n"));
          resolve(this);
        }
      });
    });
  }

  public async all<T>(query: string, params: any[]): Promise<T[]> {
    const { logger } = this;
    return new Promise((resolve, reject) => {
      const log = [`SQL: ${query.replace(/\s+/g, " ")}`];
      if (params) {
        log.push(`- params ${JSON.stringify(params)}`);
      }
      this.db.all<T>(query, params, (err, rows) => {
        if (err) {
          logger?.(
            [...log, `- failed with ${JSON.stringify(err.message)}!`].join("\n")
          );
          reject(err);
        } else {
          logger?.([...log, `- returned ${rows.length} rows.`].join("\n"));
          resolve(rows);
        }
      });
    });
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
  }

  checkTableName(table: string) {
    if (!/[a-zA-Z_]\w*/.test(table)) {
      throw new Error(`Invalid table name: ${JSON.stringify(table)}`);
    }
  }

<<<<<<< HEAD
  public async find(table: string, keys: Record<string, any> = {}) {
    this.checkTableName(table);
    const conditions = Object.keys(keys).map((key) => `${key} = ?`).join(" AND ");
    const params = Object.values(keys);
    const query = `SELECT * FROM ${table}${conditions ? " WHERE " + conditions : ""}`;
    return this.all(query, params);
  }

  public async get(table: string, keys: Record<string, any> = {}) {
    const found = await this.find(table, keys);
    if (found.length !== 1) {
      throw new Error(`Expected 1 row but found ${found.length}.`);
=======
  public async find(
    table: string,
    keys: Record<string, any> = {}
  ): Promise<Record<string, any>[]> {
    this.checkTableName(table);
    const conditions = Object.keys(keys)
      .map((key) => `${key} = ?`)
      .join(" AND ");
    const params = Object.values(keys);
    const query = `SELECT * FROM ${table}${conditions ? " WHERE " + conditions : ""}`;
    return await this.all(query, params);
  }

  public async get(
    table: string,
    keys: Record<string, any> = {}
  ): Promise<Record<string, any>> {
    const found = await this.find(table, keys);
    if (found.length !== 1) {
      throw new Error(
        `Expected to find exactly one row but found ${found.length || "no"} rows.`
      );
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
    }
    return found[0];
  }

  public uuid(): string {
    return uuid4();
  }

  public async save(table: string, record: Record<string, any>) {
    this.checkTableName(table);
    const columns = Object.keys(record).join(", ");
<<<<<<< HEAD
    const placeholders = Object.keys(record).map(() => "?").join(", ");
=======
    const placeholders = Object.keys(record)
      .map(() => "?")
      .join(", ");
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
    const params = Object.values(record);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    await this.run(query, params);
  }

<<<<<<< HEAD
  public async delete(table: string, record: Record<string, any>) {
    this.checkTableName(table);
    const conditions = Object.keys(record).map((key) => `${key} = ?`).join(" AND ");
=======
  public async delete(
    table: string,
    record: Record<string, any>
  ): Promise<number> {
    this.checkTableName(table);
    const conditions = Object.keys(record)
      .map((key) => `${key} = ?`)
      .join(" AND ");
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
    const params = Object.values(record);
    const query = `DELETE FROM ${table} WHERE ${conditions}`;
    const { changes } = await this.run(query, params);
    return changes;
  }

<<<<<<< HEAD
  public async update(table: string, keys: Record<string, any>, values: Record<string, any>) {
    this.checkTableName(table);
    const setClause = Object.keys(values).map((key) => `${key} = ?`).join(", ");
    const conditions = Object.entries(keys)
      .map(([key, val]) => (val === null ? `${key} IS NULL` : `${key} = ?`))
      .join(" AND ");
    const params = [...Object.values(values), ...Object.values(keys).filter(v => v !== null)];
    const query = `UPDATE ${table} SET ${setClause}${conditions ? " WHERE " + conditions : ""}`;
=======
  public async update(
    table: string,
    keys: Record<string, any>,
    values: Record<string, any>
  ): Promise<number> {
    this.checkTableName(table);
    const setClause = Object.keys(values)
      .map((key) => `${key} = ?`)
      .join(", ");
    const conditions = Object.entries(keys)
      .map(([key, keyValue]) =>
        keyValue === null ? `${key} IS NULL` : `${key} = ?`
      )
      .join(" AND ");
    const params = Object.values(values).concat(
      Object.values(keys).filter((v) => v !== null)
    );
    const query = `UPDATE ${table} SET ${setClause} ${conditions ? " WHERE " + conditions : ""}`;
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
    const { changes } = await this.run(query, params);
    return changes;
  }

  public async createTables() {
    const createTableSQL = (tableName: string, columns: string) => {
      this.checkTableName(tableName);
      return `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id TEXT PRIMARY KEY,
          dateCreated DATETIME NOT NULL,
          dateModified DATETIME,
          ${columns}
        )
      `;
    };
<<<<<<< HEAD

    await this.run("PRAGMA foreign_keys = ON;");

    await this.run(createTableSQL("users", `
=======
    await this.run("PRAGMA foreign_keys = ON;");
    await this.run(
      createTableSQL(
        "users",
        `
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      tokenVersion INTEGER NOT NULL DEFAULT 0
<<<<<<< HEAD
    `));

    await this.run(createTableSQL("tournaments", `
=======
    `
      )
    );
    await this.run(
      createTableSQL(
        "tournaments",
        `
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      beginning DATETIME,
      ending DATETIME
<<<<<<< HEAD
    `));

    await this.run(createTableSQL("teams", `
      title TEXT NOT NULL,
      description TEXT NOT NULL
    `));

    await this.run(createTableSQL("matches", `
=======
    `
      )
    );
    await this.run(
      createTableSQL(
        "teams",
        `
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      logo TEXT
    `
      )
    );
    await this.run(
      createTableSQL(
        "matches",
        `
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
      title TEXT NOT NULL,
      date DATETIME NOT NULL,
      tournament TEXT NOT NULL REFERENCES tournaments(id),
      homeTeam TEXT REFERENCES teams(id),
      awayTeam TEXT REFERENCES teams(id),
      homeScore INTEGER,
<<<<<<< HEAD
      awayScore INTEGER
    `));

    await this.run(createTableSQL("invitations", `
      invitedGambler TEXT NOT NULL REFERENCES users(id),
      invitingManager TEXT NOT NULL REFERENCES users(id),
      tournament TEXT NOT NULL REFERENCES tournaments(id),
      acceptedAt DATETIME,
      revokedAt DATETIME,
      UNIQUE(invitedGambler, tournament)
    `));

    await this.run(createTableSQL("gambles", `
      user TEXT NOT NULL REFERENCES users(id),
      match TEXT NOT NULL REFERENCES matches(id),
      homeScore INTEGER NOT NULL,
      awayScore INTEGER NOT NULL,
      UNIQUE(user, match)
    `));
  }

  public async seedDatabase() {
=======
      awayScore INTEGER,
      CHECK (homeTeam != awayTeam),
      CHECK (homeScore IS NULL AND awayScore IS NULL OR homeScore >= 0 AND awayScore >= 0)
    `
      )
    );
    await this.run(
      createTableSQL(
        "invitations",
        `
      invitedGambler TEXT NOT NULL REFERENCES users (id),
      invitingManager TEXT NOT NULL REFERENCES users (id),
      tournament TEXT NOT NULL REFERENCES tournaments (id),
      acceptedAt DATETIME,
      revokedAt DATETIME,
      UNIQUE (invitedGambler, tournament)
    `
      )
    );
    await this.run(
      createTableSQL(
        "gambles",
        `
      user TEXT NOT NULL REFERENCES users (id),
      match TEXT NOT NULL REFERENCES matches (id),
      homeScore INTEGER NOT NULL,
      awayScore INTEGER NOT NULL,
      UNIQUE (user, match)
    `
      )
    );
  } // createTables

  public async migrateDatabase(): Promise<void> {
    this.logger?.(`Running migrations on database <${this.filename}>.`);

    // Check if logo column exists in teams table
    try {
      await this.run(`ALTER TABLE teams ADD COLUMN logo TEXT`);
      this.logger?.(`Added logo column to teams table.`);
    } catch (err: any) {
      // Column already exists or other error
      if (!err.message?.includes("duplicate column name")) {
        this.logger?.(`Migration note: ${err.message}`);
      }
    }
  } // migrateDatabase

  public async seedDatabase(): Promise<void> {
    this.logger?.(`Seeding database <${this.filename}>.`);
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
    const dateCreated = new Date().toISOString();

    await this.run(
<<<<<<< HEAD
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [this.uuid(), dateCreated, "admin@example.com", passwordHash("admin"), UserRole.Admin]
    );

    const managerId = this.uuid();
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [managerId, dateCreated, "manager@example.com", passwordHash("manager"), UserRole.Manager]
    );
=======
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [
        this.uuid(),
        dateCreated,
        "admin@example.com",
        passwordHash("admin"),
        UserRole.Admin,
      ]
    );
    const proctorId = this.uuid();
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [
        proctorId,
        dateCreated,
        "manager@example.com",
        passwordHash("manager"),
        UserRole.Manager,
      ]
    );
    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?);`,
      [
        this.uuid(),
        dateCreated,
        "gambler@example.com",
        passwordHash("gambler"),
        UserRole.Gambler,
      ]
    );
    const tournamentId = this.uuid();
    await this.run(
      `INSERT INTO tournaments (id, dateCreated, name, description, beginning, ending) VALUES (?, ?, ?, ?, ?, ?);`,
      [
        tournamentId,
        dateCreated,
        "Test tournament 01",
        "A test tournament description",
        dateCreated,
        null,
      ]
    );

    const teams = [
      { title: "Test team 01", id: this.uuid() },
      { title: "Test team 02", id: this.uuid() },
    ];
    for (const team of teams) {
      await this.run(
        `INSERT INTO teams (id, dateCreated, title, description) VALUES (?, ?, ?, ?);`,
        [team.id, dateCreated, team.title, "Description for " + team.title]
      );
    }
    await this.run(
      `INSERT INTO matches (id, dateCreated, title, date, tournament, homeTeam, awayTeam, homeScore, awayScore)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL);`,
      [
        this.uuid(),
        dateCreated,
        "Test match 01",
        dateCreated,
        tournamentId,
        teams[0].id,
        teams[1].id,
      ]
    );
    await this.run(
      `INSERT INTO matches (id, dateCreated, title, date, tournament, homeTeam, awayTeam, homeScore, awayScore)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL);`,
      [
        this.uuid(),
        dateCreated,
        "Test match 02",
        dateCreated,
        tournamentId,
        teams[1].id,
        teams[0].id,
      ]
    );
  } // seedDatabase
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05

    await this.run(
      `INSERT INTO users (id, dateCreated, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [this.uuid(), dateCreated, "gambler@example.com", passwordHash("gambler"), UserRole.Gambler]
    );
  }

  // 🔥 FIX FINAL: better-sqlite3 verbose option removed
  public async load(initialize: boolean = false) {
    this.logger?.(`Initializing database <${this.filename}>.`);

    // CORRECTO: no verbose boolean, no function
    this._db = new Database(this.filename);

    if (initialize) {
      await this.createTables();
      await this.seedDatabase();
    } else {
      // Run migrations on existing databases
      await this.migrateDatabase();
    }
<<<<<<< HEAD
  }
}
=======
  } // initialize
} // class DatabaseSQLite3
>>>>>>> 5dc0b7f1f0bc25761d2b39b67f6b6e9f206abd05
