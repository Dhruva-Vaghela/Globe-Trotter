"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_js_1 = require("../controllers/healthController.js");
const router = (0, express_1.Router)();
router.get('/health', healthController_js_1.getHealth);
exports.default = router;
