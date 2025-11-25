export type EntityId = string;

export interface Entity {
  id: EntityId;
  dateCreated: Date;
  dateModified: null | Date;
}

export type OwnFields<T extends Entity> = Omit<T, keyof Entity>;

export enum UserRole {
  Gambler = 'gambler',
  Manager = 'manager',
  Admin = 'admin',
}

export const userRoles = Object.values(UserRole) as string[];

export interface User extends Entity {
  email: string;
  password: string;
  role: UserRole;
  tokenVersion: number;
}

export interface Login {
  email: User['email'];
  role: User['role'];
  token: string;
  userId: User['id'];
}

export interface Tournament extends Entity {
  name: string;
  description: string;
  beginning: Date;
  ending: Date;
}

export interface Match extends Entity {
  title: string;
  date: Date;
  tournament: Tournament['id'];
  homeTeam?: Team['id'];
  awayTeam?: Team['id'];
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface Team extends Entity {
  title: string;
  description: string;
}

export interface Invitation extends Entity {
  invitedGambler: User['id'];
  invitingManager: User['id'];
  tournament: Tournament['id'];
  acceptedAt: Date | null;
  revokedAt: Date | null;
}

export interface Gamble extends Entity {
  user: User['id'];
  match: Match['id'];
  homeScore: number;
  awayScore: number;
}

export interface Ranking {
  user: User['id'];
  rank: number;
  points: number;
}
