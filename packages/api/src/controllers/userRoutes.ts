import { Request, Response, Router } from "express";
import { userSchema } from "../domain/schemas";
import { type User } from "../domain/types";
import { UserService } from "../services/user.service";
import {
  createAuthMiddleware, ensureApiKey, ensureParamId,
  validateBody, validateQuery,
} from "./routerUtils";

function sanitizeUser(user: User): Omit<User, 'password' | 'tokenVersion'> {
  const {
    password: _password,
    tokenVersion: _tokenVersion,
    ...userWithoutPassword
  } = user;
  return userWithoutPassword;
}

export default function userRoutes(router: Router, userService: UserService) {
  const { ensureGamblerUser, ensureManagerUser, ensureAdminUser } = createAuthMiddleware(userService);

  router.post('/login',
    validateBody(userSchema.pick({ email: true, password: true })),
    ensureApiKey,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedBody } = res.locals;
      try {
        const login = await userService.login(apiKey, parsedBody);
        if (!login) {
          return res.status(401).json({ error: "Authentication failed!" });
        }
        res.status(200).json(login);
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  router.post('/logout',
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, userId } = res.locals;
      try {
        const success = await userService.logout(apiKey, userId);
        if (!success) {
          return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "Logged out successfully" });
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/me",
    ensureApiKey,
    ensureGamblerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, userId } = res.locals;
      const user = await userService.get(apiKey, userId);
      if (!user) {
        return res.status(404).json({ error: `User record not found` });
      }
      res.status(200).json(sanitizeUser(user));
    },
  );
  
  router.put("/users",
    validateBody(
      userSchema.omit({ id: true, dateCreated: true, dateModified: true, tokenVersion: true }),
    ),
    ensureApiKey,
    ensureAdminUser,
    async (req: Request, res: Response) => {
      const { apiKey, parsedBody } = res.locals;
      try {
        const user = await userService.create(apiKey, parsedBody);
        res.status(201).json(sanitizeUser(user));
      } catch (err) {
        res.status(400).json({ error: (err as Error).message });
      }
    },
  );

  router.get("/users",
    validateQuery(userSchema.partial()),
    ensureApiKey,
    ensureManagerUser,
    async (_req: Request, res: Response) => {
      const { apiKey, parsedQuery } = res.locals;
      const users = await userService.find(apiKey, parsedQuery);
      res.status(200).json(users.map(sanitizeUser));
    },
  );

  router.get("/users/:id",
    ensureParamId,
    ensureApiKey,
    ensureAdminUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      const user = (await userService.find(apiKey, { id }))[0];
      if (!user) {
        return res.status(404).json({ error: `Id ${id} not found` });
      }
      res.status(200).json(sanitizeUser(user));
    },
  );

  router.patch("/users/:id",
    ensureParamId,
    validateBody(
      userSchema.omit({ id: true, dateCreated: true, dateModified: true }).partial(),
    ),
    ensureApiKey,
    ensureAdminUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id, parsedBody } = res.locals;
      try {
        const updated = await userService.update(apiKey, id, parsedBody);
        if (updated < 1) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        return res.status(200).json({ updated });
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );

  router.delete("/users/:id",
    ensureParamId,
    ensureApiKey,
    ensureAdminUser,
    async (_req: Request, res: Response) => {
      const { apiKey, id } = res.locals;
      try {
        const deleted = await userService.delete(apiKey, id);
        if (!deleted) {
          return res.status(404).json({ error: `Id ${id} not found` });
        }
        res.status(200).json({ deleted });
      } catch (err) {
        res.status(500).json({ error: (err as Error).message });
      }
    },
  );
}
