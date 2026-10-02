import { verifyToken } from '../config/jwt.js';
import UserModel from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Malformed authorization header.'
      });
    }

    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session expired or user no longer exists.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      user_goal: user.user_goal,
      diet_type: user.diet_type,
      device_sync: user.device_sync
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token.',
      error: error.message
    });
  }
};

export default authMiddleware;
