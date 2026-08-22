"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
const ApiResponse_js_1 = require("../utils/ApiResponse.js");
function getHealth(req, res) {
    return (0, ApiResponse_js_1.sendResponse)(res, 200, 'GlobeTrotter API Server is operational', {
        status: 'UP',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
}
