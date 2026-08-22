"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const env_js_1 = require("./config/env.js");
const PORT = env_js_1.ENV.PORT;
app_js_1.app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`🌍 GlobeTrotter Backend Running on Port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`===========================================`);
});
