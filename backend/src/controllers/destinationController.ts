import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { DestinationService } from '../services/destinationService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function getDestinations(req: Request, res: Response, next: NextFunction) {
  try {
    const destinations = await DestinationService.listDestinations(req.query);
    return sendResponse(res, 200, 'Destinations retrieved successfully', destinations);
  } catch (err) {
    next(err);
  }
}

export async function getDestination(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const destination = await DestinationService.getDestinationById(id);
    return sendResponse(res, 200, 'Destination details retrieved successfully', destination);
  } catch (err) {
    next(err);
  }
}

export async function addStopToTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const stop = await DestinationService.addTripStop(req.user.userId, tripId, req.body);
    return sendResponse(res, 201, 'Stop added to trip successfully', stop);
  } catch (err) {
    next(err);
  }
}

export async function removeStopFromTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, stopId } = req.params;
    await DestinationService.removeTripStop(req.user.userId, tripId, stopId);
    return sendResponse(res, 200, 'Stop removed from trip successfully');
  } catch (err) {
    next(err);
  }
}

export async function reorderStops(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const stopIds: string[] = req.body.stopIds || req.body.stops || [];
    if (!Array.isArray(stopIds)) {
      throw new AppError('stopIds must be an array of string IDs', 400);
    }
    const updatedStops = await DestinationService.reorderTripStops(req.user.userId, tripId, stopIds);
    return sendResponse(res, 200, 'Trip stops reordered successfully', updatedStops);
  } catch (err) {
    next(err);
  }
}
