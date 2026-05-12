import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from './error.js';

export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AdminRole;
}

export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth: RequestHandler = (req: AuthedRequest, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (...allowed: AdminRole[]): RequestHandler => {
  return (req: AuthedRequest, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Not authenticated'));
    if (!allowed.includes(req.user.role)) {
      return next(new HttpError(403, 'Insufficient role'));
    }
    next();
  };
};

export const canWriteContent = requireRole('super_admin', 'editor');
export const isSuperAdmin = requireRole('super_admin');
