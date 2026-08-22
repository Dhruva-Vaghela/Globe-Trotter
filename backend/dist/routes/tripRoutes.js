"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tripController_js_1 = require("../controllers/tripController.js");
const activityController_js_1 = require("../controllers/activityController.js");
const validateMiddleware_js_1 = require("../middlewares/validateMiddleware.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)();
router.use(authMiddleware_js_1.authMiddleware);
// Trip routes
router.post('/', (0, validateMiddleware_js_1.validate)(tripController_js_1.createTripSchema), tripController_js_1.createTrip);
router.get('/', tripController_js_1.listTrips);
router.get('/:id', tripController_js_1.getTrip);
router.put('/:id', (0, validateMiddleware_js_1.validate)(tripController_js_1.updateTripSchema), tripController_js_1.updateTrip);
router.delete('/:id', tripController_js_1.deleteTrip);
// Section Itinerary Items routes (Module 5 Activity attachment & management)
router.post('/:tripId/sections/:sectionId/items', (0, validateMiddleware_js_1.validate)(activityController_js_1.addActivityToSectionSchema), activityController_js_1.addActivityToSection);
router.delete('/:tripId/items/:itemId', activityController_js_1.removeItineraryItem);
router.put('/:tripId/sections/:sectionId/items/reorder', (0, validateMiddleware_js_1.validate)(activityController_js_1.reorderItemsSchema), activityController_js_1.reorderItineraryItems);
exports.default = router;
