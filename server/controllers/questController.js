import QuestModel from '../models/Quest.js';
import PlayerStatsModel from '../models/PlayerStats.js';
import UserModel from '../models/User.js';
import {
  calculateBaselineMetrics,
  calculateWalkingGoal,
  generateRealDietPlan,
  generateCustomizedQuests
} from '../services/dietAndQuestEngine.js';

export const defaultDailyProgress = {
  waterConsumed: 0, // Force 0 cups
  waterTarget: 8,
  morningWalkKm: 0, // Force 0 km
  eveningWalkKm: 0, // Force 0 km
};

export const getQuests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    let quests = await QuestModel.getQuestsByUserId(userId);

    if (quests.length === 0) {
      quests = await QuestModel.seedDailyQuestsForUser(userId, user?.user_goal || 'weight_loss');
    }

    const stats = await PlayerStatsModel.findByUserId(userId);
    const morningQuest = quests.find(q => q.title?.toLowerCase().includes('morning walk'));
    const eveningQuest = quests.find(q => q.title?.toLowerCase().includes('evening walk'));

    const dailyProgress = {
      waterConsumed: Math.floor((stats?.water_current_ml || 0) / 250),
      waterTarget: 8,
      morningWalkKm: Number(morningQuest?.progress) || defaultDailyProgress.morningWalkKm,
      eveningWalkKm: Number(eveningQuest?.progress) || defaultDailyProgress.eveningWalkKm,
    };

    res.json({
      success: true,
      quests,
      dailyProgress
    });
  } catch (error) {
    next(error);
  }
};

export const completeQuest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const quest = await QuestModel.completeQuest(id, userId);
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' });
    }

    res.json({
      success: true,
      message: `Quest "${quest.title}" marked completed! Claim your XP!`,
      quest
    });
  } catch (error) {
    next(error);
  }
};

export const claimQuest = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const quests = await QuestModel.getQuestsByUserId(userId);
    const targetQuest = quests.find(q => q.id === id);

    if (!targetQuest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' });
    }

    if (targetQuest.claimed) {
      return res.status(400).json({ success: false, message: 'XP for this quest has already been claimed.' });
    }

    // Mark quest completed if not already completed
    if (!targetQuest.completed) {
      await QuestModel.completeQuest(id, userId);
    }

    const claimedQuest = await QuestModel.claimQuest(id, userId);

    // Add XP with streak multiplier
    const xpResult = await PlayerStatsModel.addXP(userId, targetQuest.baseXP);

    // If recovery quest was completed and claimed, clear the debuff!
    if (targetQuest.type === 'recovery') {
      await PlayerStatsModel.updateStats(userId, {
        has_unplanned_trap: false,
        trap_penalty_time: null
      });
    }

    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      message: `🌟 Victory! Claimed +${xpResult.xpEarned} XP!`,
      xpEarned: xpResult.xpEarned,
      multiplier: xpResult.multiplier,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel,
      quest: claimedQuest,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const resetDailyQuests = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    const quests = await QuestModel.seedDailyQuestsForUser(userId, user?.user_goal || 'weight_loss');

    res.json({
      success: true,
      message: 'Fresh quests deployed to your adventure journal!',
      quests
    });
  } catch (error) {
    next(error);
  }
};

export const generateDietPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      age,
      height_cm,
      weight_kg,
      liked_foods,
      disliked_foods,
      user_goal,
      diet_type
    } = req.body;

    const user = await UserModel.findById(userId);
    const resolvedGoal = user_goal || user?.user_goal || 'weight_loss';
    const resolvedDiet = diet_type || user?.diet_type || 'Balanced';
    const resolvedAge = age || user?.age || '26-35';
    const resolvedHeight = height_cm || user?.height_cm || '171-180cm';
    const resolvedWeight = weight_kg || user?.weight_kg || '71-85kg';
    const resolvedLikes = liked_foods || user?.liked_foods || ['Chicken', 'Rice', 'Vegetables'];
    const resolvedDislikes = disliked_foods || user?.disliked_foods || ['None'];

    // 1. Calculate Baseline Metrics
    const metrics = calculateBaselineMetrics({
      age: resolvedAge,
      height_cm: resolvedHeight,
      weight_kg: resolvedWeight,
      user_goal: resolvedGoal,
      diet_type: resolvedDiet
    });

    // 2. Calculate AI Split Walking Goal (Morning Shift & Evening Shift)
    const walking_plan = calculateWalkingGoal({
      age: resolvedAge,
      height_cm: resolvedHeight,
      weight_kg: resolvedWeight,
      user_goal: resolvedGoal
    });

    // 3. Generate Structured Real AI Diet Plan (with exact calories & macros)
    const diet_plan = await generateRealDietPlan({
      user_goal: resolvedGoal,
      diet_type: resolvedDiet,
      liked_foods: resolvedLikes,
      disliked_foods: resolvedDislikes,
      metrics
    });

    // 4. Generate Customized RPG Quests (Split walking + Real meal quests)
    const customizedQuests = generateCustomizedQuests({
      user_goal: resolvedGoal,
      diet_type: resolvedDiet,
      liked_foods: resolvedLikes,
      disliked_foods: resolvedDislikes,
      metrics,
      walking_plan,
      diet_plan
    });

    // Save metrics, preferences, walking plan & diet plan to User profile
    await UserModel.updateProfile(userId, {
      age: resolvedAge,
      height_cm: resolvedHeight,
      weight_kg: resolvedWeight,
      liked_foods: resolvedLikes,
      disliked_foods: resolvedDislikes,
      user_goal: resolvedGoal,
      diet_type: resolvedDiet,
      metrics,
      walking_plan,
      diet_plan
    });

    // Sync water target & estimated walking steps in PlayerStats
    await PlayerStatsModel.updateStats(userId, {
      water_target_ml: metrics.water_target_ml,
      steps_target: walking_plan.estimated_steps
    });

    // Set custom quests in database
    const savedQuests = await QuestModel.setCustomQuestsForUser(userId, customizedQuests);
    const updatedUser = await UserModel.findById(userId);
    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      message: '⚔️ Real AI Diet Plan & Split Walking Quests generated!',
      metrics,
      walking_plan,
      diet_plan,
      quests: savedQuests,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        user_goal: updatedUser.user_goal,
        diet_type: updatedUser.diet_type,
        device_sync: updatedUser.device_sync,
        age: updatedUser.age,
        height_cm: updatedUser.height_cm,
        weight_kg: updatedUser.weight_kg,
        liked_foods: updatedUser.liked_foods,
        disliked_foods: updatedUser.disliked_foods,
        metrics: updatedUser.metrics,
        walking_plan: updatedUser.walking_plan,
        diet_plan: updatedUser.diet_plan,
        onboardingCompleted: updatedUser.onboardingCompleted
      },
      stats
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { amount = 1, isIncremental = true } = req.body;

    const updatedQuest = await QuestModel.updateProgress(id, userId, Number(amount), isIncremental);
    if (!updatedQuest) {
      return res.status(404).json({ success: false, message: 'Quest not found.' });
    }

    // If movement quest, also update player stats steps
    if (updatedQuest.category === 'movement' || updatedQuest.unit?.includes('km')) {
      const stats = await PlayerStatsModel.findByUserId(userId);
      const addedSteps = Math.round(Number(amount) * 1350);
      await PlayerStatsModel.updateStats(userId, {
        steps_current: Math.min(stats.steps_target, (stats.steps_current || 0) + addedSteps)
      });
    }

    const quests = await QuestModel.getQuestsByUserId(userId);
    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      quest: updatedQuest,
      quests,
      stats
    });
  } catch (error) {
    next(error);
  }
};

export default {
  defaultDailyProgress,
  getQuests,
  completeQuest,
  claimQuest,
  resetDailyQuests,
  generateDietPlan,
  updateQuestProgress
};
