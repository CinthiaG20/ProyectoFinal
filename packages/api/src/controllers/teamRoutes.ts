import { Request, Response, Router } from "express";
import { teamSchema } from "../domain/schemas";
import { TeamService } from "../services/teams.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  ensureApiKey,
  ensureParamId,
  validateBody,
  validateQuery,
} from "./routerUtils";

export default function teamRoutes(
  router: Router,
  teamService: TeamService,
  userService: UserService
) {
  const { ensureGamblerUser, ensureManagerUser } =
    createAuthMiddleware(userService);

  router.put(
    "/teams",
    validateBody(
      teamSchema
        .pick({
          title: true,
          description: true,
          logo: true,
        })
        .partial({ logo: true })
    ),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody } = res.locals;
      try {
        const team = await teamService.create(apiKey, parsedBody);
        res.status(201).json(team);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/teams",
    validateQuery(teamSchema.partial()),
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      try {
        const teams = await teamService.find(apiKey, parsedQuery || {});
        res.status(200).json(teams);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    }
  );

  router.get(
    "/teams/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const team = await teamService.get(apiKey, id);
        res.status(200).json(team);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    }
  );

  router.patch(
    "/teams/:id",
    ensureParamId,
    validateBody(
      teamSchema.pick({ title: true, description: true, logo: true }).partial()
    ),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, parsedBody } = res.locals;
      try {
        const updated = await teamService.update(apiKey, id, parsedBody);
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
    "/teams/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await teamService.delete(apiKey, id);
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
