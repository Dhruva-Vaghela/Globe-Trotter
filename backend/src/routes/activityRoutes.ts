import { Router } from 'express';
import {
  listActivities,
  getActivityById,
} from '../controllers/activityController.js';

const router = Router();

router.get('/', listActivities);
router.get('/:id', getActivityById);

export default router;
