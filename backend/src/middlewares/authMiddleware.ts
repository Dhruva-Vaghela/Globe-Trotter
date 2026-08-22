import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized access. Token missing.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
    };
    req.user = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token.', 401));
  }
}

export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      sub: string;
      email: string;
      role: string;
    };
    req.user = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
}
