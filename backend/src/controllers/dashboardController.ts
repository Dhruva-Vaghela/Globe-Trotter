import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { DashboardService } from '../services/dashboardService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function getDashboardSummary(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const summary = await DashboardService.getDashboardSummary(req.user.userId);
    return sendResponse(res, 200, 'Dashboard summary retrieved', summary);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardTrips(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const trips = await DashboardService.getUserTrips(req.user.userId);
    return sendResponse(res, 200, 'User trips retrieved', trips);
  } catch (err) {
    next(err);
  }
}

export async function getPopularDestinations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const destinations = await DashboardService.getPopularDestinations();
    return sendResponse(res, 200, 'Popular destinations retrieved', destinations);
  } catch (err) {
    next(err);
  }
}

export async function getRecommendedContent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const recommendations = await DashboardService.getRecommendedContent(userId);
    return sendResponse(res, 200, 'Recommended content retrieved', recommendations);
  } catch (err) {
    next(err);
  }
}
