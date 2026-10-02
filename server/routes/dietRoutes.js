import { Router } from 'express';
import dietController from '../controllers/dietController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/reroll-meal', dietController.rerollMealWithAI);
router.post('/reroll-meal-ai', dietController.rerollMealWithAI);
router.post('/claim-meal', dietController.claimMeal);
router.post('/chat', dietController.chat);
router.post('/next-day', dietController.nextDay);

export default router;
