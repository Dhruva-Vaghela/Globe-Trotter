"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const communityController_js_1 = require("../controllers/communityController.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
// Public community routes
router.get('/feed', communityController_js_1.getCommunityFeed);
router.get('/trips/:tripId', communityController_js_1.getPublicTripDetails);
// Protected community management routes
router.post('/publish/:tripId', authMiddleware_js_1.authMiddleware, communityController_js_1.publishTrip);
router.post('/unpublish/:tripId', authMiddleware_js_1.authMiddleware, communityController_js_1.unpublishTrip);
router.post('/copy/:tripId', authMiddleware_js_1.authMiddleware, communityController_js_1.copyTrip);
router.delete('/posts/:id', authMiddleware_js_1.authMiddleware, communityController_js_1.deleteCommunityPost);
exports.default = router;
