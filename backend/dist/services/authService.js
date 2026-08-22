"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_js_1 = require("../config/db.js");
const env_js_1 = require("../config/env.js");
const AppError_js_1 = require("../utils/AppError.js");
class AuthService {
    static async hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    static async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
    static generateToken(userId, email, role) {
        const options = { expiresIn: '7d' };
        return jsonwebtoken_1.default.sign({ sub: userId, email, role }, env_js_1.ENV.JWT_SECRET, options);
    }
    static async generatePasswordResetToken(email) {
        const user = await db_js_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new AppError_js_1.AppError('No account found with this email address', 404);
        }
        const options = { expiresIn: '1h' };
        return jsonwebtoken_1.default.sign({ sub: user.id, purpose: 'reset-password' }, env_js_1.ENV.JWT_SECRET, options);
    }
    static async resetPassword(token, newPassword) {
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
        }
        catch (err) {
            throw new AppError_js_1.AppError('Invalid or expired reset token', 400);
        }
        if (decoded.purpose !== 'reset-password') {
            throw new AppError_js_1.AppError('Invalid token purpose', 400);
        }
        const passwordHash = await this.hashPassword(newPassword);
        await db_js_1.prisma.user.update({
            where: { id: decoded.sub },
            data: { passwordHash },
        });
    }
}
exports.AuthService = AuthService;
