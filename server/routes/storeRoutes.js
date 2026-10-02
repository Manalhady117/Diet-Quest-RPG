import { Router } from 'express';
import storeController from '../controllers/storeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/items', storeController.getStoreCatalog);
router.get('/catalog', storeController.getStoreCatalog);
router.post('/buy', storeController.buyStoreItem);
router.get('/inventory', storeController.getInventory);

export default router;
