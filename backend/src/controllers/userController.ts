import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { UserService } from '../services/userService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    avatarUrl: z.string().url().or(z.string().length(0)).optional(),
    bio: z.string().max(500).optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    defaultCurrency: z.string().length(3).optional(),
    preferredLanguage: z.string().min(2).max(10).optional(),
    travelStyle: z.string().max(100).optional(),
  }),
});

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const profile = await UserService.getUserProfile(req.user.userId);
    return sendResponse(res, 200, 'Profile retrieved', profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const updated = await UserService.updateProfile(req.user.userId, req.body);
    return sendResponse(res, 200, 'Profile updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const updated = await UserService.updatePreferences(req.user.userId, req.body);
    return sendResponse(res, 200, 'Preferences updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    await UserService.deleteAccount(req.user.userId);
    return sendResponse(res, 200, 'Account deleted successfully');
  } catch (err) {
    next(err);
  }
}
