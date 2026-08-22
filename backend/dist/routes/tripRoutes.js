"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_js_1 = require("../controllers/tripController.js");
const destinationController_js_1 = require("../controllers/destinationController.js");
const validateMiddleware_js_1 = require("../middlewares/validateMiddleware.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const itineraryRoutes_js_1 = __importDefault(require("./itineraryRoutes.js"));
const budgetRoutes_js_1 = __importDefault(require("./budgetRoutes.js"));
const router = (0, express_1.Router)();
router.use(authMiddleware_js_1.authMiddleware);
// Trip routes
router.post('/', (0, validateMiddleware_js_1.validate)(tripController_js_1.createTripSchema), tripController_js_1.createTrip);
router.get('/', tripController_js_1.listTrips);
router.get('/:id', tripController_js_1.getTrip);
router.put('/:id', (0, validateMiddleware_js_1.validate)(tripController_js_1.updateTripSchema), tripController_js_1.updateTrip);
router.delete('/:id', tripController_js_1.deleteTrip);
// Trip Stops routes (TASK-MOD-04)
router.post('/:tripId/stops', destinationController_js_1.addStopToTrip);
router.delete('/:tripId/stops/:stopId', destinationController_js_1.removeStopFromTrip);
router.put('/:tripId/stops/reorder', destinationController_js_1.reorderStops);
// Budget & Expense routes (TASK-MOD-08)
router.use('/', budgetRoutes_js_1.default);
// Section Itinerary & Timeline routes (TASK-MOD-06 & TASK-MOD-07)
router.use('/', itineraryRoutes_js_1.default);
exports.default = router;
