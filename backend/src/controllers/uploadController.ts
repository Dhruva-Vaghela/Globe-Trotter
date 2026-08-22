import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/uploadService.js';
import { sendResponse } from '../utils/ApiResponse.js';

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    const { base64Data, filename, mimeType } = req.body;
    const result = await UploadService.uploadImage({ base64Data, filename, mimeType });
    return sendResponse(res, 201, 'Image uploaded successfully', result);
  } catch (err) {
    next(err);
  }
}
