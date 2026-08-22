import { Router } from 'express';
import {
  createTrip,
  getTrip,
  listTrips,
  updateTrip,
  deleteTrip,
  createTripSchema,
  updateTripSchema,
} from '../controllers/tripController.js';
import {
  addActivityToSection,
  removeItineraryItem,
  reorderItineraryItems,
  addActivityToSectionSchema,
  reorderItemsSchema,
} from '../controllers/activityController.js';
import {
  addStopToTrip,
  removeStopFromTrip,
  reorderStops,
} from '../controllers/destinationController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Trip routes
router.post('/', validate(createTripSchema), createTrip);
router.get('/', listTrips);
router.get('/:id', getTrip);
router.put('/:id', validate(updateTripSchema), updateTrip);
router.delete('/:id', deleteTrip);

// Trip Stops routes (TASK-MOD-04)
router.post('/:tripId/stops', addStopToTrip);
router.delete('/:tripId/stops/:stopId', removeStopFromTrip);
router.put('/:tripId/stops/reorder', reorderStops);

// Section Itinerary Items routes (TASK-MOD-05)
router.post('/:tripId/sections/:sectionId/items', validate(addActivityToSectionSchema), addActivityToSection);
router.delete('/:tripId/items/:itemId', removeItineraryItem);
router.put('/:tripId/sections/:sectionId/items/reorder', validate(reorderItemsSchema), reorderItineraryItems);

export default router;
