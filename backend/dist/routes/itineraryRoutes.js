"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itineraryBuilderController_js_1 = require("../controllers/itineraryBuilderController.js");
const itineraryViewController_js_1 = require("../controllers/itineraryViewController.js");
const validateMiddleware_js_1 = require("../middlewares/validateMiddleware.js");
const authMiddleware_js_1 = require("../middlewares/authMiddleware.js");
const router = (0, express_1.Router)({ mergeParams: true });
router.use(authMiddleware_js_1.authMiddleware);
// Builder Endpoints (Module 6)
router.post('/:tripId/sections', (0, validateMiddleware_js_1.validate)(itineraryBuilderController_js_1.createSectionSchema), itineraryBuilderController_js_1.createSection);
router.put('/:tripId/sections/:sectionId', (0, validateMiddleware_js_1.validate)(itineraryBuilderController_js_1.updateSectionSchema), itineraryBuilderController_js_1.updateSection);
router.delete('/:tripId/sections/:sectionId', itineraryBuilderController_js_1.deleteSection);
router.post('/:tripId/sections/:sectionId/items', (0, validateMiddleware_js_1.validate)(itineraryBuilderController_js_1.addItemToSectionSchema), itineraryBuilderController_js_1.addItem);
router.delete('/:tripId/items/:itemId', itineraryBuilderController_js_1.removeItem);
router.put('/:tripId/sections/:sectionId/items/reorder', (0, validateMiddleware_js_1.validate)(itineraryBuilderController_js_1.reorderItemsSchema), itineraryBuilderController_js_1.reorderItems);
// View & Timeline Endpoints (Module 7)
router.get('/:tripId/view/daywise', itineraryViewController_js_1.getDayWiseView);
router.get('/:tripId/view/timeline', itineraryViewController_js_1.getTimelineView);
router.get('/:tripId/view/summary', itineraryViewController_js_1.getSummaryView);
exports.default = router;
