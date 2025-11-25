import { Request, Response, Router } from "express";
import { invitationSchema } from "../domain/schemas";
import { InvitationService } from "../services/invitations.service";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware,
  ensureApiKey,
  ensureParamId,
  validateBody, validateQuery,
} from "./routerUtils";

export default function invitationRoutes(router: Router, invitationService: InvitationService, userService: UserService) {
  const { ensureGamblerUser, ensureManagerUser } = createAuthMiddleware(userService);
  router.put("/invitations",
    validateBody(invitationSchema.pick({ invitedGambler: true, tournament: true })),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody, userId } = res.locals;
      try {
        const invitation = await invitationService.create(apiKey, {
          ...parsedBody,
          invitingManager: userId,
          acceptedAt: null,
          revokedAt: null,
        });
        res.status(201).json(invitation);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/invitations",
    validateQuery(invitationSchema.partial()),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      try {
        const invitations = await invitationService.find(apiKey, parsedQuery || {});
        res.status(200).json(invitations);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/invitations/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const invitation = await invitationService.get(apiKey, id);
        res.status(200).json(invitation);
      } catch (err) {
        res.status(404).json({ error: `Id ${id} not found` });
      }
    },
  );

  router.delete("/invitations/:id",
    ensureParamId,
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await invitationService.delete(apiKey, id);
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

  router.get("/me/invitations",
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, userId } = res.locals;
      try {
        const invitations = await invitationService.find(apiKey, { invitedGambler: userId });
        res.status(200).json(invitations);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/me/invitations/:id",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const invitations = await invitationService.find(apiKey, { invitedGambler: userId, id });
        res.status(200).json(invitations);
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.post("/me/invitations/:id/accept",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const acceptedInvitation = await invitationService.answerInvitation(apiKey, id, userId, true);
        if (acceptedInvitation) {
          return res.status(200).json(acceptedInvitation);
        } else {
          return res.status(404).json({ error: `Invitation not found` });
        }
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.post("/me/invitations/:id/reject",
    ensureParamId,
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, userId } = res.locals;
      try {
        const rejectedInvitation = await invitationService.answerInvitation(apiKey, id, userId, false);
        if (rejectedInvitation) {
          return res.status(200).json(rejectedInvitation);
        } else {
          return res.status(404).json({ error: `Invitation not found` });
        }
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );
}