import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'diet_quest_secret_rpg_adventurer_key_999';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign payload and return a JWT token string
 */
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token string and return decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export default {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  signToken,
  verifyToken,
};
