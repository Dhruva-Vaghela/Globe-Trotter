import { Router } from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { optionalAuthMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, globalSearch);

export default router;
