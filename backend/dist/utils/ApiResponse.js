"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = sendResponse;
function sendResponse(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data,
    });
}
