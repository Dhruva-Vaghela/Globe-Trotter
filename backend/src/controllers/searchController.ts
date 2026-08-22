import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { SearchService } from '../services/searchService.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function globalSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query.q as string;
    const userId = (req as AuthRequest).user?.userId;
    const results = await SearchService.globalSearch(q || '', userId);
    return sendResponse(res, 200, 'Global search executed successfully', results);
  } catch (err) {
    next(err);
  }
}
