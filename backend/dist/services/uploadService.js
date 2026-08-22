"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const cloudinary_1 = require("cloudinary");
const env_js_1 = require("../config/env.js");
const AppError_js_1 = require("../utils/AppError.js");
// Configure Cloudinary credentials
cloudinary_1.v2.config({
    cloud_name: env_js_1.ENV.CLOUDINARY_CLOUD_NAME,
    api_key: env_js_1.ENV.CLOUDINARY_API_KEY,
    api_secret: env_js_1.ENV.CLOUDINARY_API_SECRET,
});
class UploadService {
    static async uploadImage(input) {
        if (!input.base64Data) {
            throw new AppError_js_1.AppError('Image base64 data payload is required', 400);
        }
        try {
            const folderName = input.folder || 'globetrotter_uploads';
            const uploadResponse = await cloudinary_1.v2.uploader.upload(input.base64Data, {
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
        }
        catch (err) {
            console.error('Cloudinary Upload Error:', err);
            throw new AppError_js_1.AppError(err.message || 'Failed to upload image to Cloudinary', 500);
        }
    }
}
exports.UploadService = UploadService;
