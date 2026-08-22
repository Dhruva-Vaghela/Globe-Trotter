"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_js_1 = require("../controllers/dashboardController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
// Public discovery endpoints
router.get('/destinations', dashboardController_js_1.getPopularDestinations);
router.get('/recommendations', dashboardController_js_1.getRecommendedContent);
// Protected user dashboard endpoints
router.get('/summary', authMiddleware_js_1.authMiddleware, dashboardController_js_1.getDashboardSummary);
router.get('/trips', authMiddleware_js_1.authMiddleware, dashboardController_js_1.getDashboardTrips);
exports.default = router;
