import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { AdminService } from '../services/adminService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';
import { Role } from '@prisma/client';

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(Role),
  }),
});

export async function getDashboardAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const analytics = await AdminService.getDashboardAnalytics();
    return sendResponse(res, 200, 'Admin analytics retrieved successfully', analytics);
  } catch (err) {
    next(err);
  }
}

export async function getPopularItems(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const items = await AdminService.getPopularItems(limit);
    return sendResponse(res, 200, 'Popular destinations and activities retrieved', items);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const query = {
      search: req.query.search as string | undefined,
      role: req.query.role as Role | undefined,
      sortBy: req.query.sortBy as 'createdAt' | 'name' | 'email' | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };
    const userList = await AdminService.listUsers(query);
    return sendResponse(res, 200, 'Users list retrieved successfully', userList);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { userId } = req.params;
    const { role } = req.body;
    const updated = await AdminService.updateUserRole(req.user.userId, userId, role);
    return sendResponse(res, 200, 'User role updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { userId } = req.params;
    const result = await AdminService.deleteUser(req.user.userId, userId);
    return sendResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
}
