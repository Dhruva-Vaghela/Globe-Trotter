import { Router } from 'express';
import { getCalendarOverview, getTripCalendar } from '../controllers/calendarController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/overview', getCalendarOverview);
router.get('/trips/:tripId', getTripCalendar);

export default router;
