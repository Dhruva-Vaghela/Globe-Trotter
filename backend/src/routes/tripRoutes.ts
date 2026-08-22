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

import itineraryRoutes from './itineraryRoutes.js';
import budgetRoutes from './budgetRoutes.js';

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

// Budget & Expense routes (TASK-MOD-08)
router.use('/', budgetRoutes);

// Section Itinerary & Timeline routes (TASK-MOD-06 & TASK-MOD-07)
router.use('/', itineraryRoutes);

export default router;
