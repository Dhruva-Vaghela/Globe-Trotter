"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferencesSchema = exports.updateProfileSchema = void 0;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.updatePreferences = updatePreferences;
exports.deleteAccount = deleteAccount;
const zod_1 = require("zod");
const userService_js_1 = require("../services/userService.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const AppError_js_1 = require("../utils/AppError.js");
const uploadService_js_1 = require("../services/uploadService.js");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        avatarUrl: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        bio: zod_1.z.string().max(500).optional(),
    }),
});
exports.updatePreferencesSchema = zod_1.z.object({
    body: zod_1.z.object({
        defaultCurrency: zod_1.z.string().length(3).optional(),
        preferredLanguage: zod_1.z.string().min(2).max(10).optional(),
        travelStyle: zod_1.z.string().max(100).optional(),
    }),
});
async function getProfile(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const profile = await userService_js_1.UserService.getUserProfile(req.user.userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Profile retrieved', profile);
    }
    catch (err) {
        next(err);
    }
}
async function updateProfile(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const { name, avatarUrl, profileImage, bio } = req.body;
        let finalAvatarUrl = avatarUrl;
        const imgToUpload = profileImage || (avatarUrl?.startsWith('data:') ? avatarUrl : null);
        if (imgToUpload) {
            try {
                const uploadRes = await uploadService_js_1.UploadService.uploadImage({
                    base64Data: imgToUpload,
                    folder: 'globetrotter_avatars',
                });
                if (uploadRes && uploadRes.imageUrl) {
                    finalAvatarUrl = uploadRes.imageUrl;
                }
                else {
                    finalAvatarUrl = imgToUpload;
                }
            }
            catch (err) {
                console.error('Cloudinary update profile upload fallback:', err);
                finalAvatarUrl = imgToUpload;
            }
        }
        const updated = await userService_js_1.UserService.updateProfile(req.user.userId, {
            name,
            bio,
            ...(finalAvatarUrl !== undefined && { avatarUrl: finalAvatarUrl }),
        });
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Profile updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function updatePreferences(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const updated = await userService_js_1.UserService.updatePreferences(req.user.userId, req.body);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Preferences updated successfully', updated);
    }
    catch (err) {
        next(err);
    }
}
async function deleteAccount(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        await userService_js_1.UserService.deleteAccount(req.user.userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Account deleted successfully');
    }
    catch (err) {
        next(err);
    }
}
