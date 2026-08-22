import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { PublicItineraryService } from '../services/publicItineraryService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function generateShareLink(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const shareData = await PublicItineraryService.generateShareLink(req.user.userId, tripId);
    return sendResponse(res, 200, 'Public share link generated successfully', shareData);
  } catch (err) {
    next(err);
  }
}

export async function revokeShareLink(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const result = await PublicItineraryService.revokeShareLink(req.user.userId, tripId);
    return sendResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
}

export async function getPublicItineraryByToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const itineraryData = await PublicItineraryService.getPublicItineraryByToken(token);
    return sendResponse(res, 200, 'Public itinerary retrieved successfully', itineraryData);
  } catch (err) {
    next(err);
  }
}

export async function getPublicItineraryById(req: Request, res: Response, next: NextFunction) {
  try {
    const { tripId } = req.params;
    const itineraryData = await PublicItineraryService.getPublicItineraryById(tripId);
    return sendResponse(res, 200, 'Public itinerary retrieved successfully', itineraryData);
  } catch (err) {
    next(err);
  }
}

export async function copyPublicTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { identifier } = req.params;
    const result = await PublicItineraryService.copyPublicTrip(req.user.userId, identifier);
    return sendResponse(res, 201, result.message, result);
  } catch (err) {
    next(err);
  }
}
