"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const AppError_js_1 = require("../utils/AppError.js");
function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== 'ADMIN') {
        return next(new AppError_js_1.AppError('Forbidden. Admin authorization required.', 403));
    }
    next();
}
