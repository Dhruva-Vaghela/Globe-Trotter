import { Router } from 'express';
import {
  getDashboardSummary,
  getDashboardTrips,
  getPopularDestinations,
  getRecommendedContent,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public discovery endpoints
router.get('/destinations', getPopularDestinations);
router.get('/recommendations', getRecommendedContent);

// Protected user dashboard endpoints
router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/trips', authMiddleware, getDashboardTrips);

export default router;
