"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const AppError_js_1 = require("../utils/AppError.js");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError_js_1.AppError('Unauthorized access. Token missing.', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
        req.user = {
            userId: decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch (err) {
        return next(new AppError_js_1.AppError('Invalid or expired token.', 401));
    }
}
