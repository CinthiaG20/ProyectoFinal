import nodePath from 'node:path';
import { runServer } from '../../api/src/Server';

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = options.status ?? 500;
    this.payload = options.payload ?? null;
  }
}

export const TEST_DB_FOLDER = nodePath.join(__dirname, './data/');
export const TEST_DB_KEY = `test-db`;

export default function testApi(config) {
  const {
    dbFolder = nodePath.join(__dirname, './data/'),
    dbKey = 'test-db',
    deleteFilesOnClose = true,
  } = config ?? {};
  let appServer;
  runServer({
    dbFolder,
    dbKeys: [dbKey],
    deleteFilesOnClose,
    // logger: (...args) => console.log(...args), 
    port: null, // Do not make the Express app to listen.
  }).then((server) => { appServer = server; });
  return {
    name: 'test-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        if (/^\/api/.test(url.pathname)) {
          if (appServer) {
            appServer.app(req, res);
          } else {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Server has not yet initialized.' }));
          }
        } else {
          next();
        }
      });
    },
  };
}
