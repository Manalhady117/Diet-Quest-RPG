import { Router } from 'express';
import { handleAIChat } from '../controllers/chatController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Allow authenticated requests or fallback with userProfile
router.post('/', (req, res, next) => {
  // If Authorization header present, verify token
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
}, handleAIChat);

export default router;
