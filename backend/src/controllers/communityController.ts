import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { CommunityService } from '../services/communityService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function getCommunityFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const query = {
      search: req.query.search as string,
      city: req.query.city as string,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };
    const feed = await CommunityService.getCommunityFeed(query);
    return sendResponse(res, 200, 'Community feed retrieved successfully', feed);
  } catch (err) {
    next(err);
  }
}

export async function getPublicTripDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const { tripId } = req.params;
    const trip = await CommunityService.getPublicTripDetails(tripId);
    return sendResponse(res, 200, 'Public trip details retrieved successfully', trip);
  } catch (err) {
    next(err);
  }
}

export async function publishTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const result = await CommunityService.publishTrip(req.user.userId, tripId, req.body);
    return sendResponse(res, 200, 'Trip published to community feed successfully', result);
  } catch (err) {
    next(err);
  }
}

export async function unpublishTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const result = await CommunityService.unpublishTrip(req.user.userId, tripId);
    return sendResponse(res, 200, 'Trip unpublished successfully', result);
  } catch (err) {
    next(err);
  }
}

export async function copyTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const newTrip = await CommunityService.copyTrip(req.user.userId, tripId);
    return sendResponse(res, 201, 'Trip adopted and copied to your account successfully', newTrip);
  } catch (err) {
    next(err);
  }
}

export async function deleteCommunityPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { id } = req.params;
    await CommunityService.deleteCommunityPost(req.user.userId, id);
    return sendResponse(res, 200, 'Community post deleted successfully');
  } catch (err) {
    next(err);
  }
}
