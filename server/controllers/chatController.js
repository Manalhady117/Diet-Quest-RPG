import UserModel from '../models/User.js';
import PlayerStatsModel from '../models/PlayerStats.js';
import { chatWithDietitian, callAIWithFallback } from '../services/aiDietService.js';

/**
 * Direct Gemini generator with fallback
 */
export const generateGeminiResponse = async (message, userProfile = null, chatHistory = []) => {
  const userContext = userProfile || {
    name: 'Adventurer',
    user_goal: 'weight_loss',
    diet_type: 'Balanced',
    metrics: {},
    favorite_cuisines: ['Egyptian', 'Mediterranean'],
    disliked_foods: [],
    stats: {}
  };

  const res = await chatWithDietitian({
    message,
    chatHistory,
    userContext
  });

  return res.reply;
};

/**
 * Safeguarded AI Chat Handler
 */
export const handleAIChat = async (req, res) => {
  try {
    const { message, userProfile, chatHistory = [] } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ reply: 'Please write a valid prompt or question.' });
    }

    const userId = req.user?.id;
    let resolvedProfile = userProfile;

    if (!resolvedProfile && userId) {
      const user = await UserModel.findById(userId);
      const stats = await PlayerStatsModel.findByUserId(userId);
      resolvedProfile = {
        name: user?.name || 'Adventurer',
        user_goal: user?.user_goal || 'weight_loss',
        diet_type: user?.diet_type || 'Balanced',
        metrics: user?.metrics || {},
        favorite_cuisines: user?.favorite_cuisines || ['Egyptian', 'Mediterranean'],
        disliked_foods: user?.disliked_foods || [],
        stats: stats || {}
      };
    }

    const reply = await generateGeminiResponse(message, resolvedProfile, chatHistory);
    return res.json({ success: true, reply });
  } catch (error) {
    console.error('AI Chat Engine Error:', error);
    return res.status(500).json({
      success: false,
      reply: "I'm having trouble connecting to my knowledge base right now. Please try sending your request again!",
      error: error.message
    });
  }
};

export default {
  handleAIChat,
  generateGeminiResponse
};
