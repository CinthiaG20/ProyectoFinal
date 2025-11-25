import { afterAll, beforeAll } from 'vitest';
import { runServer, Server } from '../src/Server';
import { TEST_DB_FOLDER, TEST_DB_KEY } from './specs/testUtils';

let server: Server;
  
beforeAll(async () => {
  server = await runServer({
    dbFolder: TEST_DB_FOLDER,
    dbKeys: [TEST_DB_KEY],
    deleteFilesOnClose: true,
    // logger: (...args) => console.log(...args), 
    port: 3333,
  });
});

afterAll(async() => {
  await server.close();
});
