"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_js_1 = require("../utils/AppError.js");
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
function errorHandler(err, req, res, next) {
    console.error('API Error:', err);
    if (err instanceof AppError_js_1.AppError) {
        return (0, ApiResponse_js_1.sendResponse)(res, err.statusCode, err.message);
    }
    const message = err.message || 'Internal Server Error';
    return (0, ApiResponse_js_1.sendResponse)(res, 500, message);
}
