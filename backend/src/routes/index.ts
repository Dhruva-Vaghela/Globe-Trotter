import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import tripRoutes from './tripRoutes.js';
import activityRoutes from './activityRoutes.js';
import destinationRoutes from './destinationRoutes.js';
import calendarRoutes from './calendarRoutes.js';
import communityRoutes from './communityRoutes.js';
import publicRoutes from './publicRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import searchRoutes from './searchRoutes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/trips', tripRoutes);
router.use('/activities', activityRoutes);
router.use('/destinations', destinationRoutes);
router.use('/calendar', calendarRoutes);
router.use('/community', communityRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/search', searchRoutes);
router.use('/', publicRoutes);

export default router;
