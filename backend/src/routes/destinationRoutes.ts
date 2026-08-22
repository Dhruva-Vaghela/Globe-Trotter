import { Router } from 'express';
import { getDestinations, getDestination } from '../controllers/destinationController.js';

const router = Router();

router.get('/', getDestinations);
router.get('/:id', getDestination);

export default router;
