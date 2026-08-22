"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
class UserService {
    static async getUserProfile(userId) {
        const user = await db_js_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
                preference: true,
            },
        });
        if (!user)
            throw new AppError_js_1.AppError('User profile not found', 404);
        return user;
    }
    static async updateProfile(userId, data) {
        const user = await db_js_1.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
                ...(data.bio !== undefined && { bio: data.bio }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                bio: true,
                createdAt: true,
            },
        });
        return user;
    }
    static async updatePreferences(userId, data) {
        const preference = await db_js_1.prisma.userPreference.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                defaultCurrency: data.defaultCurrency || 'USD',
                preferredLanguage: data.preferredLanguage || 'en',
                travelStyle: data.travelStyle,
            },
        });
        return preference;
    }
    static async deleteAccount(userId) {
        await db_js_1.prisma.user.delete({
            where: { id: userId },
        });
    }
}
exports.UserService = UserService;
