import { Router } from 'express';
import {
  generateShareLink,
  revokeShareLink,
  getPublicItineraryByToken,
  getPublicItineraryById,
  copyPublicTrip,
} from '../controllers/publicItineraryController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Protected Share Management Routes
router.post('/trips/:tripId/share', authMiddleware, generateShareLink);
router.delete('/trips/:tripId/share', authMiddleware, revokeShareLink);

// Public Read-only Viewing Routes (No auth required)
router.get('/public/trips/share/:token', getPublicItineraryByToken);
router.get('/public/trips/:tripId', getPublicItineraryById);

// Protected Copy Trip Route
router.post('/public/trips/:identifier/copy', authMiddleware, copyPublicTrip);

export default router;
