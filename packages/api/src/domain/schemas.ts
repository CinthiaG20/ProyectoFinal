import { z } from "zod";
import { UserRole } from "./types";

export const entitySchema = z.object({
  id: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date().nullable(),
});

export const userRoleSchema = z.nativeEnum(UserRole);

export const userSchema = entitySchema.extend({
  email: z.string().email(),
  password: z.string(),
  role: userRoleSchema,
  tokenVersion: z.number().int().nonnegative(),
});

export const tournamentSchema = entitySchema.extend({
  name: z.string(),
  description: z.string(),
  beginning: z.coerce.date(),
  ending: z.coerce.date(),
});
  
export const matchSchema = entitySchema.extend({
  title: z.string(),
  date: z.coerce.date(),
  tournament: z.string(),
  homeTeam: z.string(),
  awayTeam: z.string(),
  homeScore: z.number().nullable(),
  awayScore: z.number().nullable(),
});

export const teamSchema = entitySchema.extend({
  title: z.string(),
  description: z.string(),
});

export const invitationSchema = entitySchema.extend({
  invitedGambler: z.string(),
  invitingManager: z.string(),
  tournament: z.string(),
  acceptedAt: z.coerce.date().nullable(),
  revokedAt: z.coerce.date().nullable(),
});

export const gambleSchema = entitySchema.extend({
  user: z.string(),
  match: z.string(),
  homeScore: z.number(),
  awayScore: z.number(),
});

export const rankingSchema = z.object({
  user: z.string(),
  rank: z.number(),
  points: z.number(),
});
