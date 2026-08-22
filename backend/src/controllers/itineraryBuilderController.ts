import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { ItineraryBuilderService } from '../services/itineraryBuilderService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export const createSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    sectionBudget: z.number().min(0).optional(),
  }),
});

export const updateSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    startDate: z.string().or(z.date()).optional(),
    endDate: z.string().or(z.date()).optional(),
    sectionBudget: z.number().min(0).optional(),
  }),
});

export const addItemToSectionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    activityId: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().or(z.date()).optional(),
    startTime: z.string().optional(),
    cost: z.number().min(0).optional(),
  }),
});

export const reorderItemsSchema = z.object({
  body: z.object({
    itemIds: z.array(z.string()).min(1, 'itemIds must contain at least one item'),
  }),
});

export async function createSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId } = req.params;
    const section = await ItineraryBuilderService.createSection(req.user.userId, tripId, req.body);
    return sendResponse(res, 201, 'Itinerary section created successfully', section);
  } catch (err) {
    next(err);
  }
}

export async function updateSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const updated = await ItineraryBuilderService.updateSection(req.user.userId, tripId, sectionId, req.body);
    return sendResponse(res, 200, 'Itinerary section updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteSection(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const result = await ItineraryBuilderService.deleteSection(req.user.userId, tripId, sectionId);
    return sendResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
}

export async function addItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const item = await ItineraryBuilderService.addItemToSection(req.user.userId, tripId, sectionId, req.body);
    return sendResponse(res, 201, 'Itinerary item added successfully', item);
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, itemId } = req.params;
    const result = await ItineraryBuilderService.removeItem(req.user.userId, tripId, itemId);
    return sendResponse(res, 200, result.message);
  } catch (err) {
    next(err);
  }
}

export async function reorderItems(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const { tripId, sectionId } = req.params;
    const items = await ItineraryBuilderService.reorderItems(req.user.userId, tripId, sectionId, req.body.itemIds);
    return sendResponse(res, 200, 'Items reordered successfully', items);
  } catch (err) {
    next(err);
  }
}
