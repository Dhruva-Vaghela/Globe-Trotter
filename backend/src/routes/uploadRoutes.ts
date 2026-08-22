import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, uploadImage);

export default router;
