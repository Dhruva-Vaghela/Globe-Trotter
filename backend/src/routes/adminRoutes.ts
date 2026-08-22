import { Router } from 'express';
import {
  getDashboardAnalytics,
  getPopularItems,
  listUsers,
  updateUserRole,
  deleteUser,
  updateUserRoleSchema,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';

const router = Router();

// Protect all admin routes with authMiddleware and adminMiddleware
router.use(authMiddleware, adminMiddleware);

router.get('/analytics', getDashboardAnalytics);
router.get('/popular', getPopularItems);
router.get('/users', listUsers);
router.put('/users/:userId/role', validate(updateUserRoleSchema), updateUserRole);
router.delete('/users/:userId', deleteUser);

export default router;
