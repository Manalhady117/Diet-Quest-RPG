import { Router } from 'express';
import questController from '../controllers/questController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', questController.getQuests);
router.post('/generate-plan', questController.generateDietPlan);
router.post('/:id/complete', questController.completeQuest);
router.post('/:id/claim', questController.claimQuest);
router.post('/:id/progress', questController.updateQuestProgress);
router.put('/:id/progress', questController.updateQuestProgress);
router.post('/reset', questController.resetDailyQuests);

export default router;
