"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const AppError_js_1 = require("../utils/AppError.js");
class UploadService {
    static async uploadImage(input) {
        if (!input.base64Data && !input.filename) {
            throw new AppError_js_1.AppError('Image file or base64 data payload is required', 400);
        }
        const uniqueId = crypto_1.default.randomUUID();
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
exports.UploadService = UploadService;
