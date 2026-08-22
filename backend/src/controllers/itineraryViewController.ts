import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { ItineraryViewService } from '../services/itineraryViewService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function getDayWiseView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const daywiseData = await ItineraryViewService.getDayWiseView(req.user.userId, tripId);
    return sendResponse(res, 200, 'Day-wise itinerary retrieved successfully', daywiseData);
  } catch (err) {
    next(err);
  }
}

export async function getTimelineView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const timelineData = await ItineraryViewService.getTimelineView(req.user.userId, tripId);
    return sendResponse(res, 200, 'Itinerary timeline retrieved successfully', timelineData);
  } catch (err) {
    next(err);
  }
}

export async function getSummaryView(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const summaryData = await ItineraryViewService.getSummaryView(req.user.userId, tripId);
    return sendResponse(res, 200, 'Itinerary summary retrieved successfully', summaryData);
  } catch (err) {
    next(err);
  }
}
