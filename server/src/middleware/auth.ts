import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface JwtUserPayload extends JwtPayload {
  sub: string;
  role?: string;
}

export interface AuthedRequest extends Request {
  user?: JwtUserPayload;
}

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, env.jwtSecret) as JwtUserPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}
