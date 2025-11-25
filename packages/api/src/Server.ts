import bodyParser from 'body-parser';
import cors from 'cors';
import "dotenv/config";
import express, { Express, Router } from 'express';
import {
  IncomingMessage, ServerResponse, type Server as NodeHTTPServer
} from 'node:http';
import { inspect } from 'node:util';
import gambleRoutes from './controllers/gambleRoutes';
import invitationRoutes from './controllers/invitationRoutes';
import matchRoutes from './controllers/matchRoutes';
import teamRoutes from './controllers/teamRoutes';
import tournamentRoutes from './controllers/tournamentRoutes';
import userRoutes from './controllers/userRoutes';
import { AppRepository } from "./models/AppRepository";
import { GambleService } from './services/gambles.service';
import { InvitationService } from './services/invitations.service';
import { MatchService } from './services/matches.service';
import { TeamService } from './services/teams.service';
import { TournamentService } from './services/tournament.service';
import { UserService } from "./services/user.service";

export interface ServerConfig {
  dbFolder?: string;
  dbKeys: string[];
  deleteFilesOnClose?: boolean;
  logger?: (message: string) => void;
  port?: number;
}

export class Server {
  public readonly config: ServerConfig;
  public readonly appRepo: AppRepository;
  public app: Express | null = null;
  public server: NodeHTTPServer<typeof IncomingMessage, typeof ServerResponse> | null = null;

  // Services
  public readonly userService: UserService;
  public readonly tournamentService: TournamentService;
  public readonly teamService: TeamService;
  public readonly invitationService: InvitationService;
  public readonly matchService: MatchService;
  public readonly gambleService: GambleService;

  constructor(config: ServerConfig) {
    config.logger?.(`Creating server with ${inspect(config)}.`);
    if (config.dbKeys.length < 1) {
      throw new Error('No DB keys found!');
    }
    this.config = { port: 3000, ...config };
    this.appRepo = new AppRepository({
      dbFolder: this.config.dbFolder,
      logger: this.config.logger,
      verbose: true
    });
    this.userService = new UserService(this.appRepo);
    this.tournamentService = new TournamentService(this.appRepo);
    this.teamService = new TeamService(this.appRepo);
    this.invitationService = new InvitationService(this.appRepo);
    this.matchService = new MatchService(this.appRepo);
    this.gambleService = new GambleService(this.appRepo);
  }

  public router(): Router {
    const router = express.Router();
    userRoutes(router, this.userService);
    tournamentRoutes(router, this.tournamentService, this.userService);
    teamRoutes(router, this.teamService, this.userService);
    invitationRoutes(router, this.invitationService, this.userService);
    matchRoutes(router, this.matchService, this.userService);
    gambleRoutes(router, this.gambleService, this.userService);
    return router;
  }

  public expressServer(): Express {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api', this.router());
    return app;
  }

  public async run() {
    const {
      dbFolder, dbKeys, deleteFilesOnClose, logger, port,
    } = this.config;
    logger?.(`Initializing databases at <${dbFolder}>...`);
    await this.appRepo.initDatabases(dbKeys);
    logger?.(`Creating Express server...`);
    this.app = this.expressServer();
    logger?.(`Starting server...`);
    if (port) {
      this.server = this.app.listen(port, () => {
        logger?.(`Server is running on http://localhost:${port}`);
      });
    }
    return this;
  }

  async close() {
    const { deleteFilesOnClose, logger } = this.config;
    const { server } = this;
    if (server) {
      await new Promise((resolve, reject) => server.close((err) => {
        logger?.(`${deleteFilesOnClose ? 'Deleting' : 'Closing'} databases...`);
        this.appRepo.close({ deleteFiles: deleteFilesOnClose }).then(() => {
          if (err) {
            reject(err);
          } else {
            resolve(undefined);
          }
        });
      }));
      return true;
    }
    return false;
  }
}

export async function runServer(config: ServerConfig) {
  const server = new Server(config);
  return await server.run();
}
