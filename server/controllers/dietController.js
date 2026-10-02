import UserModel from '../models/User.js';
import QuestModel from '../models/Quest.js';
import PlayerStatsModel from '../models/PlayerStats.js';
import { generateMealWithAI, callAIModel, chatWithDietitian } from '../services/aiDietService.js';
import { rerollSingleMeal, generateCustomizedQuests } from '../services/dietAndQuestEngine.js';

export const rerollMealWithAI = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { currentMeal, targetCalories, goal, day = 1, mealId } = req.body;

    const user = userId ? await UserModel.findById(userId) : null;
    const activeMealId = mealId || currentMeal?.id || 'lunch';

    // Verify if meal was already claimed
    if (user?.diet_plan) {
      const daySchedule = user.diet_plan.week_schedule?.find(s => s.day === Number(day));
      const existing = (daySchedule?.meals || user.diet_plan.meals || []).find(m => m.id === activeMealId);
      if (existing && (existing.isClaimed || existing.claimed)) {
        return res.status(400).json({
          success: false,
          message: 'Meal has already been claimed/logged. Swapping is locked.'
        });
      }
    }

    const targetGoal = goal || user?.user_goal || 'weight_loss';
    const dietType = user?.diet_type || 'Balanced';
    const likedFoods = user?.liked_foods || [];
    const dislikedFoods = user?.disliked_foods || [];
    const effectiveTargetCalories = targetCalories || currentMeal?.calories || 500;

    let newMeal = null;
    try {
      newMeal = await generateMealWithAI({
        currentMeal: currentMeal || { name: activeMealId },
        mealId: activeMealId,
        targetCalories: effectiveTargetCalories,
        goal: targetGoal,
        diet_type: dietType,
        liked_foods: likedFoods,
        disliked_foods: dislikedFoods,
        favorite_cuisines: user?.favorite_cuisines || ['Egyptian', 'Mediterranean']
      });
    } catch (aiErr) {
      console.error('[dietController] Final AI Error:', aiErr.message);
      return res.status(503).json({
        success: false,
        message: 'High server traffic on AI nodes. Please tap retry in 5 seconds!'
      });
    }

    // If authenticated user, persist to database
    if (user && user.diet_plan) {
      const dietPlan = user.diet_plan;
      const weekSchedule = dietPlan.week_schedule || [];
      const daySchedule = weekSchedule.find(s => s.day === Number(day));

      if (daySchedule && daySchedule.meals) {
        daySchedule.meals = daySchedule.meals.map(m => m.id === activeMealId ? { ...newMeal, isClaimed: false } : m);
      }
      if (dietPlan.meals) {
        dietPlan.meals = dietPlan.meals.map(m => m.id === activeMealId ? { ...newMeal, isClaimed: false } : m);
      }

      await UserModel.updateProfile(userId, { diet_plan: dietPlan });

      // Sync meal title in active quest
      const quests = await QuestModel.findByUserId(userId);
      for (const q of quests) {
        if (q.category === 'nutrition' && (q.title?.toLowerCase().includes(activeMealId) || q.description?.toLowerCase().includes(activeMealId))) {
          await QuestModel.update(q.id, {
            title: `Meal Quest: ${newMeal.name} (+200 XP)`,
            description: `Log eating your ${activeMealId} (${newMeal.calories} kcal, ${newMeal.protein_g}g Protein) to fuel today's adventure.`
          });
        }
      }
    }

    return res.json({
      success: true,
      newMeal,
      meal: newMeal,
      ...newMeal
    });
  } catch (error) {
    next(error);
  }
};

export const claimMeal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mealId, day = 1 } = req.body;

    if (!mealId) {
      return res.status(400).json({ success: false, message: 'mealId is required.' });
    }

    const user = await UserModel.findById(userId);
    const dietPlan = user.diet_plan || {};
    const weekSchedule = dietPlan.week_schedule || [];
    const daySchedule = weekSchedule.find(s => s.day === Number(day));

    let foundMeal = null;
    if (daySchedule && daySchedule.meals) {
      daySchedule.meals = daySchedule.meals.map(m => {
        if (m.id === mealId) {
          m.isClaimed = true;
          m.claimed = true;
          foundMeal = m;
        }
        return m;
      });
    }
    if (dietPlan.meals) {
      dietPlan.meals = dietPlan.meals.map(m => {
        if (m.id === mealId) {
          m.isClaimed = true;
          m.claimed = true;
          foundMeal = m;
        }
        return m;
      });
    }

    // Award XP & Coins (+200 XP, +10 Coins)
    const xpResult = await PlayerStatsModel.addXP(userId, 200);
    await PlayerStatsModel.addCoins(userId, 10);
    const stats = await PlayerStatsModel.findByUserId(userId);

    // Update quest
    const quests = await QuestModel.findByUserId(userId);
    const matchingQuest = quests.find(q =>
      q.relatedMealId === mealId ||
      q.id === `quest_${mealId}` ||
      q.title?.toLowerCase().includes(mealId.toLowerCase())
    );

    if (matchingQuest) {
      await QuestModel.update(matchingQuest.id, {
        progress: matchingQuest.maxProgress || 1,
        completed: true,
        isClaimed: true
      });
    }

    await UserModel.updateProfile(userId, { diet_plan: dietPlan });
    const updatedUser = await UserModel.findById(userId);
    const updatedQuests = await QuestModel.findByUserId(userId);

    res.json({
      success: true,
      message: 'Meal claimed! +200 XP awarded!',
      meal: foundMeal,
      stats,
      user: updatedUser,
      quests: updatedQuests
    });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { message, chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const user = userId ? await UserModel.findById(userId) : null;
    const stats = userId ? await PlayerStatsModel.findByUserId(userId) : {};

    const userContext = {
      name: user?.name || 'Adventurer',
      user_goal: user?.user_goal || 'weight_loss',
      diet_type: user?.diet_type || 'Balanced',
      metrics: user?.metrics || {},
      favorite_cuisines: user?.favorite_cuisines || ['Egyptian', 'Mediterranean'],
      disliked_foods: user?.disliked_foods || [],
      stats
    };

    const result = await chatWithDietitian({
      message,
      chatHistory,
      userContext
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[dietController.chat] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to contact AI Dietitian assistant. Please try again.',
      error: error.message
    });
  }
};

export const nextDay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentDay = user.currentActiveDay || user.campaign?.current_day || 1;
    const nextDayNum = Math.min(7, currentDay + 1);

    const campaign = user.campaign || {
      current_day: 1,
      current_week: 1,
      starting_weight_kg: 75,
      target_weight_kg: 70,
      current_weight_kg: 75,
      weight_history: [],
      week_unlocked: 1,
      needs_weigh_in: false,
      daily_logs: []
    };
    campaign.current_day = nextDayNum;

    // Reset meal claim statuses for the new day
    let updatedDietPlan = user.diet_plan || {};
    if (updatedDietPlan.week_schedule && updatedDietPlan.week_schedule.length > 0) {
      const nextSchedule = updatedDietPlan.week_schedule.find(s => s.day === nextDayNum) || updatedDietPlan.week_schedule[0];
      updatedDietPlan.current_day = nextDayNum;
      updatedDietPlan.meals = (nextSchedule.meals || []).map(m => ({
        ...m,
        isClaimed: false,
        claimed: false
      }));
    } else if (updatedDietPlan.meals) {
      updatedDietPlan.meals = updatedDietPlan.meals.map(m => ({
        ...m,
        isClaimed: false,
        claimed: false
      }));
    }

    // 1. Reset Daily Water Intake to 0 / 8 cups
    // 2. Reset Daily Walking Distance to 0.0 / target km
    await PlayerStatsModel.updateStats(userId, {
      water_current_ml: 0,
      steps_current: 0
    });
    await PlayerStatsModel.incrementStreak(userId);
    const stats = await PlayerStatsModel.findByUserId(userId);

    // Persist user updates
    await UserModel.updateProfile(userId, {
      campaign,
      currentActiveDay: nextDayNum,
      diet_plan: updatedDietPlan
    });

    // 3. Reset and regenerate Quests with 0 progress
    let updatedQuests = [];
    if (updatedDietPlan && user.walking_plan && user.metrics) {
      const freshQuestTemplates = generateCustomizedQuests({
        user_goal: user.user_goal,
        diet_type: user.diet_type,
        liked_foods: user.liked_foods,
        disliked_foods: user.disliked_foods,
        metrics: user.metrics,
        walking_plan: user.walking_plan,
        diet_plan: updatedDietPlan
      });
      await QuestModel.deleteByUserId(userId);
      updatedQuests = await QuestModel.createMany(userId, freshQuestTemplates);
    } else {
      updatedQuests = await QuestModel.findByUserId(userId);
    }

    const updatedUser = await UserModel.findById(userId);

    return res.json({
      success: true,
      message: `Advanced to Day ${nextDayNum}! Daily progression reset to 0.`,
      currentActiveDay: nextDayNum,
      user: updatedUser,
      stats,
      quests: updatedQuests
    });
  } catch (error) {
    next(error);
  }
};

export default {
  rerollMealWithAI,
  claimMeal,
  chat,
  nextDay
};
