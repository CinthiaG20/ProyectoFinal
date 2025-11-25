import 'dotenv/config';
import nodePath from 'node:path';
import { runServer } from './Server';

function loggerFunction(...args: any[]) {
  console.log(...args);
}

async function main() {
  const {
    SERVER_DB_PATH = './data',
    SERVER_DB_KEYS = 'default',
    SERVER_LOG = 'on',
    SERVER_PORT = '3000',
  } = process.env;
  
  const dbFolder = nodePath.isAbsolute(SERVER_DB_PATH) ? SERVER_DB_PATH
    : nodePath.join(process.cwd(), SERVER_DB_PATH);
  const dbKeys = SERVER_DB_KEYS?.split(/\s*,\s*/) ?? [];
  const logger = SERVER_LOG ? loggerFunction : undefined;
  const port = SERVER_PORT ? parseInt(SERVER_PORT, 10) : undefined;

  try {
    return runServer({ dbFolder, dbKeys, logger, port });
  } catch (err) {
    console.error((err as Error).stack ?? (err as Error).message);
    process.exit(1);
  }
}

main();
