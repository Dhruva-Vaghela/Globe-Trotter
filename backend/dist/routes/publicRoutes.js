"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicItineraryController_js_1 = require("../controllers/publicItineraryController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
// Protected Share Management Routes
router.post('/trips/:tripId/share', authMiddleware_js_1.authMiddleware, publicItineraryController_js_1.generateShareLink);
router.delete('/trips/:tripId/share', authMiddleware_js_1.authMiddleware, publicItineraryController_js_1.revokeShareLink);
// Public Read-only Viewing Routes (No auth required)
router.get('/public/trips/share/:token', publicItineraryController_js_1.getPublicItineraryByToken);
router.get('/public/trips/:tripId', publicItineraryController_js_1.getPublicItineraryById);
// Protected Copy Trip Route
router.post('/public/trips/:identifier/copy', authMiddleware_js_1.authMiddleware, publicItineraryController_js_1.copyPublicTrip);
exports.default = router;
