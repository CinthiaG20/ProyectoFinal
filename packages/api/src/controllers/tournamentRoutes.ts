import { Request, Response, Router } from "express";
import { tournamentSchema } from "../domain/schemas";
import { TournamentService } from "../services/tournament.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  ensureApiKey,
  ensureParamId,
  validateBody, validateQuery,
} from "./routerUtils";

export default function tournamentRoutes(router: Router, tournamentService: TournamentService, userService: UserService) {
  const { ensureGamblerUser, ensureManagerUser } = createAuthMiddleware(userService);
  router.put("/tournaments",
    validateBody(tournamentSchema.pick({ name: true, description: true, beginning: true, ending: true })),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody } = res.locals;
      try {
        const tournament = await tournamentService.create(apiKey, parsedBody);
        res.status(201).json(tournament);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/tournaments",
    validateQuery(tournamentSchema.partial()),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      try {
        const tournaments = await tournamentService.find(apiKey, parsedQuery || {});
        res.status(200).json(tournaments);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/tournaments/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const tournament = await tournamentService.get(apiKey, id);
        res.status(200).json(tournament);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    },
  );

  router.get("/tournaments/:id/matches",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const matches = await tournamentService.tournamentMatches(apiKey, id);
        res.status(200).json(matches);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    },
  );

  router.patch("/tournaments/:id",
    ensureParamId,
    validateBody(tournamentSchema.pick({ name: true, description: true, beginning: true, ending: true }).partial()),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, parsedBody } = res.locals;
      try {
        const updated = await tournamentService.update(apiKey, id, parsedBody);
        if (updated < 1) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ updated });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  router.delete("/tournaments/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await tournamentService.delete(apiKey, id);
        if (!deleted) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ deleted });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  // Gambler routes ____________________________________________________________

  router.get("/me/tournaments",
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, userId } = res.locals;
      try {
        const tournaments = await tournamentService.myTournament(apiKey, userId);
        res.status(200).json(tournaments);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/me/tournaments/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const tournaments = await tournamentService.myTournament(apiKey, userId, id);
        res.status(200).json(tournaments);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/me/tournaments/:id/matches",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const tournaments = await tournamentService.myMatches(apiKey, userId, id);
        res.status(200).json(tournaments);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );
}