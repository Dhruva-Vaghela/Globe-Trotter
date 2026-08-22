import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { sendResponse } from '../utils/ApiResponse.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('API Error:', err);

  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, err.message);
  }

  const message = err.message || 'Internal Server Error';
  return sendResponse(res, 500, message);
}
