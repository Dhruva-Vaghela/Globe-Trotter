import { Router } from 'express';
import {
  getCommunityFeed,
  getPublicTripDetails,
  publishTrip,
  unpublishTrip,
  copyTrip,
  deleteCommunityPost,
} from '../controllers/communityController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public community routes
router.get('/feed', getCommunityFeed);
router.get('/trips/:tripId', getPublicTripDetails);

// Protected community management routes
router.post('/publish/:tripId', authMiddleware, publishTrip);
router.post('/unpublish/:tripId', authMiddleware, unpublishTrip);
router.post('/copy/:tripId', authMiddleware, copyTrip);
router.delete('/posts/:id', authMiddleware, deleteCommunityPost);

export default router;
