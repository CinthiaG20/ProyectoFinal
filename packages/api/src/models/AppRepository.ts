import nodeFileSystem from 'node:fs/promises';
import nodePath from 'node:path';
import { DatabaseSQLite3, DatabaseSQLite3Config } from "./DatabaseSQLite3";

export interface AppRepositoryConfig extends Omit<DatabaseSQLite3Config, 'filename'> {
  dbFolder?: string, // Undefined dbFolder means using DBs in-memory.
}

export class AppRepository {
  public readonly dbFolder?: string;
  public readonly dbConfig: Omit<DatabaseSQLite3Config, 'filename'>;
  public readonly dbs: Map<string, DatabaseSQLite3>;

  constructor(config: AppRepositoryConfig) {
    const { dbFolder, ...dbConfig } = config;
    this.dbFolder = dbFolder && (nodePath.isAbsolute(dbFolder) ? dbFolder
      : nodePath.join(process.cwd(), dbFolder));
    this.dbConfig = dbConfig;
    this.dbs = new Map();
  }

  async initDatabases(dbKeys: string[]) {
    for (const dbKey of dbKeys) {
      const filename = !this.dbFolder ? undefined
        : nodePath.join(this.dbFolder, `./${dbKey}.db`);
      const fileExists: boolean = !!filename
        && await nodeFileSystem.access(filename).then(() => true, () => false);
      const db = new DatabaseSQLite3({ filename, ...this.dbConfig });
      await db.load(!fileExists);
      this.dbs.set(dbKey, db);
    }
  }

  public getDB(dbKey: string): DatabaseSQLite3 {
    const db = this.dbs.get(dbKey);
    if (!db) {
      throw new Error(`Could not find db with key ${JSON.stringify(dbKey)}!`);
    }
    return db;
  }

  public async close(options: {
    deleteFiles?: boolean;
  }): Promise<any[]> {
    const results = await Promise.all([...this.dbs.values()].map(async (db) => {
      return {
        filename: db.filename,
        error: await db.close().then(() => null, (err) => err),
      }; 
    }));
    if (options.deleteFiles) {
      for (const { filename, error } of results) {
        if (!error) {
          await nodeFileSystem.rm(filename);
        }
      }
    }
    return results;
  }

} // class AppRepository