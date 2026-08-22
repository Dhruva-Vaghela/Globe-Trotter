import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  deleteAccount,
  updateProfileSchema,
  updatePreferencesSchema,
} from '../controllers/userController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.put('/preferences', validate(updatePreferencesSchema), updatePreferences);
router.delete('/account', deleteAccount);

export default router;
