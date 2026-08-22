import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { CalendarService } from '../services/calendarService.js';
import { sendResponse } from '../utils/ApiResponse.js';
import { AppError } from '../utils/AppError.js';

export async function getCalendarOverview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const start = req.query.start as string;
    const end = req.query.end as string;
    const calendar = await CalendarService.getCalendarOverview(req.user.userId, start, end);
    return sendResponse(res, 200, 'Calendar overview retrieved', calendar);
  } catch (err) {
    next(err);
  }
}

export async function getTripCalendar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401);
    const calendar = await CalendarService.getTripCalendarData(req.user.userId, req.params.tripId);
    return sendResponse(res, 200, 'Trip calendar events retrieved', calendar);
  } catch (err) {
    next(err);
  }
}
