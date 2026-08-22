import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';
import { AppError } from '../utils/AppError.js';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError('Forbidden. Admin authorization required.', 403));
  }
  next();
}
