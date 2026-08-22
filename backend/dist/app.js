"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_js_1 = require("./config/env.js");
const index_js_1 = __importDefault(require("./routes/index.js"));
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_js_1.ENV.CORS_ORIGIN,
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Mount API v1 router
exports.app.use('/api/v1', index_js_1.default);
// Global Error Handler
exports.app.use(errorHandler_js_1.errorHandler);
