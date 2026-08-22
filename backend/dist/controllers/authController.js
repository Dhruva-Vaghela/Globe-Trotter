"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
exports.register = register;
exports.login = login;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const zod_1 = require("zod");
const db_js_1 = require("../config/db.js");
const AppError_js_1 = require("../utils/AppError.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
const authService_js_1 = require("../services/authService.js");
const userService_js_1 = require("../services/userService.js");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address'),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Reset token is required'),
        password: zod_1.z.string().min(6, 'New password must be at least 6 characters'),
    }),
});
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const existingUser = await db_js_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError_js_1.AppError('User with this email already exists', 409);
        }
        const passwordHash = await authService_js_1.AuthService.hashPassword(password);
        const user = await db_js_1.prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                preference: {
                    create: {
                        defaultCurrency: 'USD',
                        preferredLanguage: 'en',
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatarUrl: true,
                createdAt: true,
            },
        });
        const token = authService_js_1.AuthService.generateToken(user.id, user.email, user.role);
        return (0, ApiResponse_js_1.sendResponse)(res, 201, 'User registered successfully', { token, user });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await db_js_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError_js_1.AppError('Invalid email or password', 401);
        }
        const isMatch = await authService_js_1.AuthService.verifyPassword(password, user.passwordHash);
        if (!isMatch) {
            throw new AppError_js_1.AppError('Invalid email or password', 401);
        }
        const token = authService_js_1.AuthService.generateToken(user.id, user.email, user.role);
        const userProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Login successful', { token, user: userProfile });
    }
    catch (err) {
        next(err);
    }
}
async function me(req, res, next) {
    try {
        if (!req.user)
            throw new AppError_js_1.AppError('Unauthorized', 401);
        const user = await userService_js_1.UserService.getUserProfile(req.user.userId);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'User profile retrieved', user);
    }
    catch (err) {
        next(err);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const { email } = req.body;
        const token = await authService_js_1.AuthService.generatePasswordResetToken(email);
        // In production, this sends an email with the link. Here we return the token for testing/demo.
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Password reset token generated', { token });
    }
    catch (err) {
        next(err);
    }
}
async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;
        await authService_js_1.AuthService.resetPassword(token, password);
        return (0, ApiResponse_js_1.sendResponse)(res, 200, 'Password has been reset successfully');
    }
    catch (err) {
        next(err);
    }
}
