import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { type User } from '../domain/types';

const saltRounds = 15;
const tokenExpiration = '3h';

export async function passwordHash(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {  
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

export function userToken(user: User) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    throw new Error('JWT secret key is not defined!');
  }
  const { email, id, role, tokenVersion } = user;
  const token = jwt.sign(
    { email, role, id, tokenVersion },
    secretKey,
    { expiresIn: tokenExpiration },
  );
  return token;
}
