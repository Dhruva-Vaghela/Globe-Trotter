import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { ActivityService } from '../services/activityService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export const listActivitiesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    maxCost: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    maxDuration: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    minRating: z.string().optional().transform((val) => (val ? Number(val) : undefined)),
    sortBy: z.enum(['rating', 'cost_asc', 'cost_desc', 'duration']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const addActivityToSectionSchema = z.object({
  body: z.object({
    activityId: z.string().uuid().optional(),
    title: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    startTime: z.string().optional(),
    cost: z.number().min(0).optional(),
  }),
});

export const reorderItemsSchema = z.object({
  body: z.object({
    itemIds: z.array(z.string().uuid('Each item ID must be a valid UUID')),
  }),
});

export async function listActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const query = {
      search: req.query.search as string,
      category: req.query.category as string,
      location: req.query.location as string,
      maxCost: req.query.maxCost ? Number(req.query.maxCost) : undefined,
      maxDuration: req.query.maxDuration ? Number(req.query.maxDuration) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };

    const activities = await ActivityService.listActivities(query);
    return sendResponse(res, 200, 'Activities retrieved successfully', activities);
  } catch (err) {
    next(err);
  }
}

export async function getActivityById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const activity = await ActivityService.getActivityById(id);
    return sendResponse(res, 200, 'Activity details retrieved successfully', activity);
  } catch (err) {
    next(err);
  }
}

export async function addActivityToSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const item = await ActivityService.addActivityToSection(
      req.user.userId,
      tripId,
      sectionId,
      req.body
    );
    return sendResponse(res, 201, 'Activity attached to trip section successfully', item);
  } catch (err) {
    next(err);
  }
}

export async function removeItineraryItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, itemId } = req.params;
    await ActivityService.removeItineraryItem(req.user.userId, tripId, itemId);
    return sendResponse(res, 200, 'Itinerary item removed successfully');
  } catch (err) {
    next(err);
  }
}

export async function reorderItineraryItems(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const { itemIds } = req.body;
    const reordered = await ActivityService.reorderItineraryItems(
      req.user.userId,
      tripId,
      sectionId,
      itemIds
    );
    return sendResponse(res, 200, 'Itinerary items reordered successfully', reordered);
  } catch (err) {
    next(err);
  }
}
