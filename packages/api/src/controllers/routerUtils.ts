import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { entitySchema } from "../domain/schemas";
import { UserRole } from "../domain/types";
import type { UserService } from "../services/user.service";

export const ensureApiKey: RequestHandler = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res
      .status(401)
      .json({ error: "Missing x-api-key header" });
  }
  res.locals.apiKey = apiKey;
  next();
}

export function makeAuthMiddleware(roles: UserRole[], userService?: UserService): RequestHandler {
  return async (req, res, next) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401)
        .json({ error: "Authentication failed, missing token" });
    }
    if (!secretKey) {
      return res.status(500).json({ error: "Could not validate key!" });
    }
    try {
      const decoded: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;
      res.locals.userId = decoded.id;
      res.locals.userRole = decoded.role;
      if (!roles.includes(decoded.role)) {
        return res.status(403)
          .json({ error: `Role ${decoded.role} is not allowed!` });
      }
      // Verify tokenVersion if userService is provided
      if (userService && res.locals.apiKey) {
        try {
          const user = await userService.get(res.locals.apiKey, decoded.id);
          if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401)
              .json({ error: "Token has been invalidated" });
          }
        } catch {
          return res.status(401)
            .json({ error: "Authentication failed, user not found" });
        }
      }
      next();
    } catch (err) {
      return res.status(401)
        .json({ error: "Authentication failed, invalid token" });
    }
  };
}

// Legacy middleware without token version checking (for backwards compatibility during migration)
export const ensureGamblerUser = makeAuthMiddleware([UserRole.Gambler, UserRole.Manager, UserRole.Admin]);
export const ensureManagerUser = makeAuthMiddleware([UserRole.Manager, UserRole.Admin]);
export const ensureAdminUser = makeAuthMiddleware([UserRole.Admin]);

// Factory functions that create middleware with token version validation
export function createAuthMiddleware(userService: UserService) {
  return {
    ensureGamblerUser: makeAuthMiddleware([UserRole.Gambler, UserRole.Manager, UserRole.Admin], userService),
    ensureManagerUser: makeAuthMiddleware([UserRole.Manager, UserRole.Admin], userService),
    ensureAdminUser: makeAuthMiddleware([UserRole.Admin], userService),
  };
}

export const validateBody = (schema: z.ZodSchema<any>): RequestHandler => {
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.body);
    if (error) {
      return res.status(400).json({ error });
    }
    res.locals.parsedBody = data;
    next();
  };
};

export const validateParams = (schema: z.ZodSchema<any>): RequestHandler => {
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.params);
    if (error) {
      return res.status(400).json({ error });
    }
    res.locals.parsedParams = data;
    next();
  };
};

export const validateQuery = (schema: z.ZodSchema<any>): RequestHandler => {
  return (req, res, next) => {
    const { data, error } = schema.safeParse(req.query);
    if (error) {
      return res.status(400).json({ error });
    }
    res.locals.parsedQuery = data;
    next();
  };
};

export const ensureParamId: RequestHandler = (req, res, next) => {
  const { data, error } = entitySchema.pick({ id: true }).safeParse(req.params);
  if (error) {
    return res.status(400).json({ error });
  }
  res.locals.id = data.id;
  next();
};
