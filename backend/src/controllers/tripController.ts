import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { TripService } from '../services/tripService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';
import { TripStatus } from '@prisma/client';

export const createTripSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Trip name must be at least 2 characters'),
    description: z.string().optional(),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    coverImageUrl: z.string().url().or(z.string().length(0)).optional(),
    destinationCity: z.string().optional(),
    destinationCountry: z.string().optional(),
    totalBudget: z.number().min(0).optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const updateTripSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    coverImageUrl: z.string().url().or(z.string().length(0)).optional(),
    status: z.nativeEnum(TripStatus).optional(),
    isPublic: z.boolean().optional(),
    totalBudget: z.number().min(0).optional(),
  }),
});

export async function createTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const trip = await TripService.createTrip(req.user.userId, req.body);
    return sendResponse(res, 201, 'Trip created successfully', trip);
  } catch (err) {
    next(err);
  }
}

export async function getTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const trip = await TripService.getTripById(req.user.userId, req.params.id);
    return sendResponse(res, 200, 'Trip details retrieved', trip);
  } catch (err) {
    next(err);
  }
}

export async function listTrips(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const query = {
      search: req.query.search as string,
      status: req.query.status as TripStatus,
      sortBy: req.query.sortBy as 'startDate' | 'createdAt' | 'name',
      sortOrder: req.query.sortOrder as 'asc' | 'desc',
    };
    const trips = await TripService.listUserTrips(req.user.userId, query);
    return sendResponse(res, 200, 'User trips retrieved', trips);
  } catch (err) {
    next(err);
  }
}

export async function updateTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const updated = await TripService.updateTrip(req.user.userId, req.params.id, req.body);
    return sendResponse(res, 200, 'Trip updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteTrip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    await TripService.deleteTrip(req.user.userId, req.params.id);
    return sendResponse(res, 200, 'Trip deleted successfully');
  } catch (err) {
    next(err);
  }
}
