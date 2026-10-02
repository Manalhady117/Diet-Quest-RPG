import { Router } from 'express';
import healthController from '../controllers/healthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/sync', healthController.syncHealthTelemetry);
router.get('/history', healthController.getHealthHistory);
router.post('/mock-step', healthController.mockStepIncrement);

export default router;
