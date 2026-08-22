import { Router } from 'express';
import {
  createSection,
  updateSection,
  deleteSection,
  addItem,
  removeItem,
  reorderItems,
  createSectionSchema,
  updateSectionSchema,
  addItemToSectionSchema,
  reorderItemsSchema,
} from '../controllers/itineraryBuilderController.js';
import {
  getDayWiseView,
  getTimelineView,
  getSummaryView,
} from '../controllers/itineraryViewController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// Builder Endpoints (Module 6)
router.post('/:tripId/sections', validate(createSectionSchema), createSection);
router.put('/:tripId/sections/:sectionId', validate(updateSectionSchema), updateSection);
router.delete('/:tripId/sections/:sectionId', deleteSection);
router.post('/:tripId/sections/:sectionId/items', validate(addItemToSectionSchema), addItem);
router.delete('/:tripId/items/:itemId', removeItem);
router.put('/:tripId/sections/:sectionId/items/reorder', validate(reorderItemsSchema), reorderItems);

// View & Timeline Endpoints (Module 7)
router.get('/:tripId/view/daywise', getDayWiseView);
router.get('/:tripId/view/timeline', getTimelineView);
router.get('/:tripId/view/summary', getSummaryView);

export default router;
