import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

export interface UploadImageInput {
  base64Data?: string;
  filename?: string;
  mimeType?: string;
}

export class UploadService {
  static async uploadImage(input: UploadImageInput) {
    if (!input.base64Data && !input.filename) {
      throw new AppError('Image file or base64 data payload is required', 400);
    }

    const uniqueId = crypto.randomUUID();
    const ext = input.filename ? input.filename.split('.').pop() || 'jpg' : 'jpg';
    const filename = `img_${uniqueId}.${ext}`;

    // Return structured response with mock CDN/local URL & metadata
    return {
      success: true,
      imageUrl: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80`,
      filename,
      sizeBytes: input.base64Data ? Math.round((input.base64Data.length * 3) / 4) : 102400,
      uploadedAt: new Date().toISOString(),
    };
  }
}
