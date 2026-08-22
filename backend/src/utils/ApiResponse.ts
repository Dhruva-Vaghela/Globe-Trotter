import { Response } from 'express';

export function sendResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: any = null
) {
  return res.status(statusCode).json({
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  });
}
