import { Request, Response, Router } from "express";
import { matchSchema } from "../domain/schemas";
import { MatchService } from "../services/matches.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  ensureApiKey,
  ensureParamId,
  validateBody,
  validateQuery,
} from "./routerUtils";

export default function matchRoutes(
  router: Router,
  matchService: MatchService,
  userService: UserService
) {
  const { ensureGamblerUser, ensureManagerUser } =
    createAuthMiddleware(userService);

  router.put(
    "/matches",
    validateBody(
      matchSchema
        .pick({
          tournament: true,
          homeTeam: true,
          awayTeam: true,
          title: true,
          date: true,
          homeScore: true,
          awayScore: true,
        })
        .partial({ title: true, homeScore: true, awayScore: true })
    ),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody } = res.locals;
      try {
        const match = await matchService.create(apiKey, parsedBody);
        res.status(201).json(match);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/matches",
    validateQuery(matchSchema.partial()),
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      try {
        const matches = await matchService.find(apiKey, parsedQuery || {});
        res.status(200).json(matches);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/matches/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const match = await matchService.get(apiKey, id);
        res.status(200).json(match);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    }
  );

  router.patch(
    "/matches/:id",
    ensureParamId,
    validateBody(
      matchSchema
        .pick({
          tournament: true,
          homeTeam: true,
          awayTeam: true,
          title: true,
          date: true,
          homeScore: true,
          awayScore: true,
        })
        .partial()
    ),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, parsedBody } = res.locals;
      try {
        const updated = await matchService.update(apiKey, id, parsedBody);
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
    "/matches/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await matchService.delete(apiKey, id);
        if (!deleted) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ deleted });
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );
}
