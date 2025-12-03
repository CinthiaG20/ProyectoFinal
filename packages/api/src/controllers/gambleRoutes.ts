import { Request, Response, Router } from "express";
import { gambleSchema } from "../domain/schemas";
import { GambleService } from "../services/gambles.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  ensureApiKey,
  ensureParamId,
  validateBody,
  validateQuery,
} from "./routerUtils";

export default function gambleRoutes(
  router: Router,
  gambleService: GambleService,
  userService: UserService
) {
  const { ensureAdminUser, ensureGamblerUser, ensureManagerUser } =
    createAuthMiddleware(userService);
  router.get(
    "/gambles",
    validateQuery(gambleSchema.partial()),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      try {
        const gambles = await gambleService.find(apiKey, parsedQuery || {});
        res.status(200).json(gambles);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/gambles/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const gamble = await gambleService.get(apiKey, id);
        res.status(200).json(gamble);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    }
  );

  router.delete(
    "/gambles/:id",
    ensureParamId,
    ensureApiKey,
    ensureAdminUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await gambleService.delete(apiKey, id);
        if (!deleted) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ deleted });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  // Gambler routes ____________________________________________________________

  router.put(
    "/me/gambles",
    validateBody(
      gambleSchema.pick({ match: true, homeScore: true, awayScore: true })
    ),
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody, userId } = res.locals;
      try {
        const gamble = await gambleService.create(apiKey, {
          ...parsedBody,
          user: userId,
        });
        res.status(201).json(gamble);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/gambles",
    validateQuery(gambleSchema.partial()),
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery, userId } = res.locals;
      try {
        const gambles = await gambleService.find(apiKey, {
          ...parsedQuery,
          user: userId,
        });
        res.status(200).json(gambles);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/gambles/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const gambles = await gambleService.find(apiKey, { id, user: userId });
        if (gambles.length === 0) {
          res.status(404).json({ error: `Id ${id} not found` });
        } else {
          res.status(200).json(gambles[0]);
        }
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    }
  );

  router.patch(
    "/me/gambles/:id",
    ensureParamId,
    validateBody(
      gambleSchema.pick({ homeScore: true, awayScore: true }).partial()
    ),
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, parsedBody, userId } = res.locals;
      try {
        const updated = await gambleService.update(apiKey, id, {
          ...parsedBody,
          user: userId,
        });
        if (updated < 1) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ updated });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.delete(
    "/me/gambles/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const deleted = await gambleService.deleteForUser(apiKey, id, userId);
        if (!deleted) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ deleted });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/tournaments/:id/gambles",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const gambles = await gambleService.tournamentGambles(apiKey, id);
        res.status(200).json(gambles);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/tournaments/:id/ranking",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const scores = await gambleService.tournamentRanking(apiKey, id);
        res.status(200).json(scores);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/tournaments/:id/my-ranking",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const ranking = await gambleService.myRankingInTournament(
          apiKey,
          id,
          userId
        );
        if (!ranking) {
          return res
            .status(404)
            .json({ error: "User not found in tournament ranking" });
        }
        res.status(200).json(ranking);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/me/matches/:matchId/gamble",
    ensureApiKey,
    ensureGamblerUser,
    async (req: Request, res: Response) => {
      const { apiKey, userId } = res.locals;
      const { matchId } = req.params;

      if (!matchId) {
        return res.status(400).json({ error: "matchId parameter is required" });
      }

      try {
        const gamble = await gambleService.gambleByMatch(
          apiKey,
          userId,
          matchId
        );
        if (!gamble) {
          return res
            .status(404)
            .json({ error: "Gamble not found for this match" });
        }
        res.status(200).json(gamble);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );
}
