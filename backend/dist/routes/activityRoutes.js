"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activityController_js_1 = require("../controllers/activityController.js");
const router = (0, express_1.Router)();
router.get('/', activityController_js_1.listActivities);
router.get('/:id', activityController_js_1.getActivityById);
exports.default = router;
