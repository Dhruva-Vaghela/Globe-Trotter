"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
const uploadService_js_1 = require("../services/uploadService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
async function uploadImage(req, res, next) {
    try {
        const { base64Data, filename, mimeType } = req.body;
        const result = await uploadService_js_1.UploadService.uploadImage({ base64Data, filename, mimeType });
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'Image uploaded successfully', result);
    }
    catch (err) {
        next(err);
    }
}
