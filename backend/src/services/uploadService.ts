import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

// Configure Cloudinary credentials
cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export interface UploadImageInput {
  base64Data?: string;
  filename?: string;
  mimeType?: string;
  folder?: string;
}

export class UploadService {
  static async uploadImage(input: UploadImageInput) {
    if (!input.base64Data) {
      throw new AppError('Image base64 data payload is required', 400);
    }

    try {
      const folderName = input.folder || 'globetrotter_uploads';
      const uploadResponse = await cloudinary.uploader.upload(input.base64Data, {
        folder: folderName,
        resource_type: 'auto',
      });

      return {
        success: true,
        imageUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        filename: input.filename || `${uploadResponse.public_id}.${uploadResponse.format || 'jpg'}`,
        sizeBytes: uploadResponse.bytes,
        uploadedAt: uploadResponse.created_at || new Date().toISOString(),
      };
    } catch (err: any) {
      console.error('Cloudinary Upload Error:', err);
      throw new AppError(err.message || 'Failed to upload image to Cloudinary', 500);
    }
  }
}
