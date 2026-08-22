"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const initialPort = Number(env_js_1.ENV.PORT) || 5001;
function startServer(portToUse) {
    const server = http_1.default.createServer(app_js_1.app);
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`⚠️ Port ${portToUse} is currently in use by another process. Retrying on port ${portToUse + 1}...`);
            setTimeout(() => {
                startServer(portToUse + 1);
            }, 300);
        }
        else {
            console.error('❌ Server error:', err);
        }
    });
    server.listen(portToUse, () => {
        console.log(`===========================================`);
        console.log(`🌍 GlobeTrotter Backend Running on Port ${portToUse}`);
        console.log(`📍 Health Check: http://localhost:${portToUse}/api/v1/health`);
        console.log(`===========================================`);
    });
}
startServer(initialPort);
