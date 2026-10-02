import { Router } from 'express';
import gameController from '../controllers/gameController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', gameController.getStats);
router.post('/damage', gameController.applyDamage);
router.post('/water', gameController.logWater);
router.post('/trap', gameController.triggerTrap);
router.post('/use-item', gameController.useInventoryItem);
router.post('/complete-day', gameController.completeDay);
router.post('/weigh-in', gameController.recordWeighIn);
router.post('/reroll-meal', gameController.rerollMeal);
router.post('/resurrect', gameController.resurrectPlayer);
router.post('/buy-pet-item', gameController.buyPetItem);
router.post('/equip-pet-item', gameController.equipPetItem);
router.post('/interact-pet', gameController.interactPet);
router.post('/claim-badge', gameController.claimBadge);
router.post('/walk-bonus', gameController.logWalkBonus);

export default router;
