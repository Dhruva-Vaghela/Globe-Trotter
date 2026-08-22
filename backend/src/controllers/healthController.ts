import { Request, Response } from 'express';
import { sendResponse } from '../utils/ApiResponse.js';

export function getHealth(req: Request, res: Response) {
  return sendResponse(res, 200, 'GlobeTrotter API Server is operational', {
    status: 'UP',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}
