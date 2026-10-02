import PlayerStatsModel from '../models/PlayerStats.js';
import InventoryModel from '../models/Inventory.js';
import QuestModel from '../models/Quest.js';
import UserModel from '../models/User.js';
import { generateRealDietPlan, generateCustomizedQuests, rerollSingleMeal } from '../services/dietAndQuestEngine.js';
import { generateMealWithAI } from '../services/aiDietService.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await PlayerStatsModel.findByUserId(req.user.id);
    const inventory = await InventoryModel.getByUserId(req.user.id);

    res.json({
      success: true,
      stats,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

export const applyDamage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { damage = 20, reason = 'Unplanned caloric overage or junk food logged' } = req.body;

    const damageResult = await PlayerStatsModel.takeDamage(userId, Number(damage));
    const inventory = await InventoryModel.getByUserId(userId);

    res.json({
      success: true,
      message: damageResult.shieldBlocked
        ? '🛡️ Aegis Shield activated! Blocked all HP damage!'
        : `⚡ Ouch! Took -${damageResult.damageTaken} HP damage from ${reason}!`,
      damageTaken: damageResult.damageTaken,
      shieldBlocked: damageResult.shieldBlocked,
      stats: damageResult.stats,
      inventory
    });
  } catch (error) {
    next(error);
  }
};

export const logWater = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { amount_ml = 250 } = req.body;

    const currentStats = await PlayerStatsModel.findByUserId(userId);
    const prevWater = currentStats.water_current_ml || 0;
    const newWater = prevWater + Number(amount_ml);

    // Over-achievement bonus check: standard daily target is 8 cups (2000 mL)
    const prevCups = Math.floor(prevWater / 250);
    const newCups = Math.floor(newWater / 250);
    let bonusEarned = false;
    let bonusCoins = 0;

    if (newCups > 8 && newCups > prevCups) {
      const extraCups = newCups - Math.max(8, prevCups);
      bonusCoins = extraCups * 5; // +5 Coins per extra cup
      await PlayerStatsModel.addCoins(userId, bonusCoins);
      bonusEarned = true;
    }

    // Award +25 Base XP for hydrating!
    const xpResult = await PlayerStatsModel.addXP(userId, 25);
    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      water_current_ml: newWater
    });

    res.json({
      success: true,
      message: bonusEarned
        ? 'Bonus Earned! 🎉 You surpassed your daily goal!'
        : `💧 Drank ${amount_ml}mL of pure water! Energy recharged!`,
      waterAdded: Number(amount_ml),
      xpEarned: xpResult.xpEarned,
      multiplier: xpResult.multiplier,
      bonusEarned,
      bonusCoins,
      bonusToast: bonusEarned ? 'Bonus Earned! 🎉 You surpassed your daily goal!' : null,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const logWalkBonus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { extraKm = 1.0 } = req.body;

    // Extra Steps Bonus: If walking steps exceed target (e.g., > 3.0 km), reward +20 Coins / +50 XP per extra 1.0 km
    const units = Math.max(1, Math.round(Number(extraKm) || 1));
    const bonusCoins = units * 20;
    const bonusXP = units * 50;

    await PlayerStatsModel.addCoins(userId, bonusCoins);
    await PlayerStatsModel.addXP(userId, bonusXP);
    const updatedStats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      message: 'Bonus Earned! 🎉 You surpassed your daily goal!',
      bonusCoins,
      bonusXP,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const triggerTrap = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const stats = await PlayerStatsModel.findByUserId(userId);

    // Check if shield protects player
    if (stats.active_shield_until && new Date(stats.active_shield_until) > new Date()) {
      return res.json({
        success: true,
        shieldBlocked: true,
        message: '🛡️ Your Aegis Shield absorbed the Fast Food Trap penalty! No XP was lost!',
        stats
      });
    }

    // Deduct 300 XP from user pool
    const updatedStats = await PlayerStatsModel.deductXP(userId, 300);
    // Mark debuff active
    await PlayerStatsModel.updateStats(userId, {
      has_unplanned_trap: true,
      trap_penalty_time: new Date().toISOString()
    });

    // Create mandatory Recovery Quest
    const recoveryQuest = await QuestModel.createRecoveryQuest(userId);

    res.json({
      success: true,
      shieldBlocked: false,
      message: '🚨 Unplanned Fast Food Trap sprung! Lost 300 XP and received a 20-minute Walking Recovery Quest!',
      xpDeducted: 300,
      recoveryQuest,
      stats: await PlayerStatsModel.findByUserId(userId)
    });
  } catch (error) {
    next(error);
  }
};

export const useInventoryItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required.' });
    }

    const consumeResult = await InventoryModel.consumeItem(userId, itemId);
    if (!consumeResult.success) {
      return res.status(400).json({ success: false, message: consumeResult.message });
    }

    let actionMessage = '';
    let updatedStats;

    if (itemId === 'speed_potion') {
      // Speed Potion: Consumed 15 minutes prior to meal. Grants +50 XP for drinking 500 mL water
      const xpResult = await PlayerStatsModel.addXP(userId, 50);
      const current = await PlayerStatsModel.findByUserId(userId);
      updatedStats = await PlayerStatsModel.updateStats(userId, {
        water_current_ml: (current.water_current_ml || 0) + 500
      });
      actionMessage = '🧪 Drank Speed Potion & 500mL water! Curbs appetite, +50 XP granted!';
    } else if (itemId === 'shield_barrier') {
      // Shield: shields user from logging penalties for the next 6 hours
      const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
      updatedStats = await PlayerStatsModel.updateStats(userId, {
        active_shield_until: expiresAt
      });
      actionMessage = '🛡️ Aegis Shield activated! You are immune to logging penalties for 6 hours!';
    } else if (itemId === 'cheat_meal_pass') {
      // Cheat meal pass: Clears any active trap and restores 25 HP
      await PlayerStatsModel.healHP(userId, 25);
      updatedStats = await PlayerStatsModel.updateStats(userId, {
        has_unplanned_trap: false
      });
      actionMessage = '🍕 Cheat Meal Pass redeemed! Controlled cheat meal consumed without any penalty or debuff!';
    } else if (itemId === 'rest_day_pass') {
      // Rest Day Pass: Exempts from side quests for 24 hours while preserving streak
      const until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      updatedStats = await PlayerStatsModel.updateStats(userId, {
        active_rest_day_until: until
      });
      actionMessage = '⛺ Rest Day Pass active! Streak protected for 24 hours while muscles recover!';
    }

    res.json({
      success: true,
      message: actionMessage,
      inventory: consumeResult.inventory,
      stats: updatedStats || (await PlayerStatsModel.findByUserId(userId))
    });
  } catch (error) {
    next(error);
  }
};

export const completeDay = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { completedMealIds = [], dayNotes = '' } = req.body;

    const user = await UserModel.findById(userId);
    let stats = await PlayerStatsModel.findByUserId(userId);
    const quests = await QuestModel.findByUserId(userId);

    // Initialize or read campaign
    const campaign = user.campaign || {
      current_day: 1,
      current_week: 1,
      starting_weight_kg: 75,
      target_weight_kg: user.user_goal === 'weight_loss' ? 70 : user.user_goal === 'weight_gain' ? 80 : 75,
      current_weight_kg: 75,
      weight_history: [],
      week_unlocked: 1,
      needs_weigh_in: false,
      daily_logs: []
    };

    const prevDay = campaign.current_day || 1;

    // Calculate calories & macros from completed meals
    const activeMeals = user.diet_plan?.meals || [];
    let caloriesConsumed = 0;
    let proteinConsumed = 0;
    let carbsConsumed = 0;
    let fatsConsumed = 0;

    activeMeals.forEach(meal => {
      // If client sent completedMealIds, only count those. Otherwise if meal quest was completed, count it
      const isEaten = completedMealIds.includes(meal.id) ||
        quests.some(q => q.category === 'nutrition' && q.title.toLowerCase().includes(meal.id) && q.isClaimed);
      if (isEaten) {
        caloriesConsumed += meal.calories || 0;
        proteinConsumed += meal.protein_g || 0;
        carbsConsumed += meal.carbs_g || 0;
        fatsConsumed += meal.fats_g || 0;
      }
    });

    // Calculate total XP earned today from completed quests
    const completedQuests = quests.filter(q => q.isClaimed || q.progress >= q.maxProgress);
    const xpFromQuests = completedQuests.reduce((acc, q) => acc + (q.baseXP || 100), 0);

    // Calorie surplus calculation vs targetCalories
    const targetCalories = user.metrics?.caloric_target || 2200;
    let surplusPenalty = null;
    let dayBonus = 100;

    if (caloriesConsumed > targetCalories) {
      const extraKcal = caloriesConsumed - targetCalories;
      const penaltyUnits = Math.ceil(extraKcal / 100);
      const hpPenalty = Math.min(50, penaltyUnits * 10);
      const xpPenalty = Math.min(250, penaltyUnits * 50);

      // Deduct HP / XP instead of awarding positive progress
      await PlayerStatsModel.takeDamage(userId, hpPenalty);
      await PlayerStatsModel.deductXP(userId, xpPenalty);

      surplusPenalty = {
        extraKcal,
        hpPenalty,
        xpPenalty,
        message: `Calorie surplus of +${extraKcal} kcal detected! Incurred -${hpPenalty} HP damage and -${xpPenalty} XP penalty.`
      };
      dayBonus = Math.max(0, 100 - xpPenalty);
    } else {
      // Award normal completion bonus
      await PlayerStatsModel.addXP(userId, dayBonus);
    }

    // Increment streak in database
    await PlayerStatsModel.incrementStreak(userId);
    stats = await PlayerStatsModel.findByUserId(userId);

    const totalXpToday = xpFromQuests + dayBonus;

    // Advance Day or trigger weekly weigh-in requirement
    let nextDay = prevDay + 1;
    let needsWeighIn = false;

    if (prevDay >= 7) {
      needsWeighIn = true;
      campaign.needs_weigh_in = true;
      nextDay = 7;
    } else {
      campaign.current_day = nextDay;
      campaign.needs_weigh_in = false;
    }

    // Advance active meals for the new day and reset meal claim statuses to false
    let updatedDietPlan = user.diet_plan;
    if (updatedDietPlan?.week_schedule && updatedDietPlan.week_schedule.length > 0) {
      const nextDaySchedule = updatedDietPlan.week_schedule.find(s => s.day === nextDay) || updatedDietPlan.week_schedule[0];
      updatedDietPlan.current_day = nextDay;
      updatedDietPlan.meals = (nextDaySchedule.meals || []).map(m => ({
        ...m,
        isClaimed: false,
        claimed: false
      }));
    } else if (updatedDietPlan?.meals) {
      updatedDietPlan.meals = updatedDietPlan.meals.map(m => ({
        ...m,
        isClaimed: false,
        claimed: false
      }));
    }

    // Record day log
    const dayLog = {
      day: prevDay,
      week: campaign.current_week || 1,
      date: new Date().toISOString(),
      xp_earned: totalXpToday,
      calories_consumed: caloriesConsumed,
      target_calories: user.metrics?.caloric_target || 2200,
      macros: {
        protein: proteinConsumed,
        carbs: carbsConsumed,
        fats: fatsConsumed
      },
      hp_end: stats.hp_current,
      streak: stats.streak_count,
      notes: dayNotes
    };
    campaign.daily_logs = [...(campaign.daily_logs || []), dayLog];

    // Full Daily Progression Reset Engine on "Next Day":
    // 1. Reset Daily Water Intake to 0 / 8 cups (0 mL)
    // 2. Reset Daily Walking Distance to 0.0 / target km (0 steps)
    await PlayerStatsModel.updateStats(userId, {
      water_current_ml: 0,
      steps_current: 0
    });
    stats = await PlayerStatsModel.findByUserId(userId);

    // Persist user campaign and diet plan
    await UserModel.updateProfile(userId, {
      campaign,
      currentActiveDay: nextDay,
      diet_plan: updatedDietPlan
    });

    // Regenerate daily quests for the new day's meals and activities
    let updatedQuests = quests;
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

      // Clear today's claimed quests and seed fresh ones
      await QuestModel.deleteByUserId(userId);
      updatedQuests = await QuestModel.createMany(userId, freshQuestTemplates);
    }

    const updatedUser = await UserModel.findById(userId);

    res.json({
      success: true,
      summary: {
        completedDayNumber: prevDay,
        nextDayNumber: nextDay,
        currentWeek: campaign.current_week || 1,
        xpEarnedToday: totalXpToday,
        caloriesConsumed,
        targetCalories: user.metrics?.caloric_target || 2200,
        macrosConsumed: {
          protein: proteinConsumed,
          carbs: carbsConsumed,
          fats: fatsConsumed
        },
        targetMacros: {
          protein: user.metrics?.protein_g || 160,
          carbs: user.metrics?.carbs_g || 220,
          fats: user.metrics?.fats_g || 65
        },
        hpCurrent: stats.hp_current,
        hpMax: stats.hp_max,
        streakCount: stats.streak_count,
        needsWeighIn,
        unlockedWeek: campaign.week_unlocked || 1,
        surplusPenalty
      },
      user: {
        ...updatedUser,
        campaign
      },
      stats,
      quests: updatedQuests
    });
  } catch (error) {
    next(error);
  }
};

export const recordWeighIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weight_kg, note = '' } = req.body;

    if (!weight_kg || isNaN(weight_kg) || weight_kg <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid weight in kg.' });
    }

    const user = await UserModel.findById(userId);
    const weightNum = parseFloat(weight_kg);

    const campaign = user.campaign || {
      current_day: 1,
      current_week: 1,
      starting_weight_kg: weightNum,
      target_weight_kg: user.user_goal === 'weight_loss' ? 70 : user.user_goal === 'weight_gain' ? 80 : 75,
      current_weight_kg: weightNum,
      weight_history: [],
      week_unlocked: 1,
      needs_weigh_in: false,
      daily_logs: []
    };

    const newHistoryEntry = {
      date: new Date().toISOString(),
      weight_kg: weightNum,
      week: campaign.current_week || 1,
      note
    };

    campaign.weight_history = [...(campaign.weight_history || []), newHistoryEntry];
    campaign.current_weight_kg = weightNum;
    campaign.week_unlocked = (campaign.week_unlocked || 1) + 1;
    campaign.current_week = (campaign.current_week || 1) + 1;
    campaign.current_day = 1;
    campaign.needs_weigh_in = false;

    // Award +300 Milestone XP for weekly weigh-in unlock
    await PlayerStatsModel.addXP(userId, 300);
    const stats = await PlayerStatsModel.findByUserId(userId);

    // Generate fresh diverse 7-day meal plan for Week 2+
    let updatedDietPlan = user.diet_plan;
    if (user.metrics) {
      updatedDietPlan = await generateRealDietPlan({
        user_goal: user.user_goal,
        diet_type: user.diet_type,
        liked_foods: user.liked_foods,
        disliked_foods: user.disliked_foods,
        metrics: user.metrics
      });
      updatedDietPlan.current_day = 1;
    }

    // Refresh quests
    let quests = [];
    if (updatedDietPlan && user.walking_plan && user.metrics) {
      const templates = generateCustomizedQuests({
        user_goal: user.user_goal,
        diet_type: user.diet_type,
        liked_foods: user.liked_foods,
        disliked_foods: user.disliked_foods,
        metrics: user.metrics,
        walking_plan: user.walking_plan,
        diet_plan: updatedDietPlan
      });
      await QuestModel.deleteByUserId(userId);
      quests = await QuestModel.createMany(userId, templates);
    }

    await UserModel.updateProfile(userId, {
      campaign,
      weight_kg: `${weightNum}kg`,
      diet_plan: updatedDietPlan
    });

    const updatedUser = await UserModel.findById(userId);

    res.json({
      success: true,
      message: `🎉 Week ${campaign.current_week} Plan Unlocked! Weekly weigh-in of ${weightNum} kg logged! +300 Milestone XP!`,
      user: {
        ...updatedUser,
        campaign
      },
      stats,
      quests
    });
  } catch (error) {
    next(error);
  }
};

export const rerollMeal = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { day = 1, mealId } = req.body;

    if (!mealId) {
      return res.status(400).json({ success: false, message: 'mealId is required.' });
    }

    const user = await UserModel.findById(userId);
    const dietPlan = user.diet_plan || {};
    const weekSchedule = dietPlan.week_schedule || [];

    // Find current day's meals
    let daySchedule = weekSchedule.find(s => s.day === Number(day));
    let currentMeal = null;

    if (daySchedule && daySchedule.meals) {
      currentMeal = daySchedule.meals.find(m => m.id === mealId);
    } else if (dietPlan.meals) {
      currentMeal = dietPlan.meals.find(m => m.id === mealId);
    }

    // Check if meal is locked/claimed
    if (currentMeal && (currentMeal.isClaimed || currentMeal.claimed)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reroll a meal that has already been claimed/logged.'
      });
    }

    // Generate with live Gemini AI model
    let newMeal = null;
    try {
      newMeal = await generateMealWithAI({
        currentMeal: currentMeal || { name: mealId },
        mealId,
        targetCalories: currentMeal?.calories || Math.round((user.metrics?.caloric_target || 2100) * 0.3),
        goal: user.user_goal,
        diet_type: user.diet_type,
        liked_foods: user.liked_foods,
        disliked_foods: user.disliked_foods,
        favorite_cuisines: user.favorite_cuisines || ['Egyptian', 'Mediterranean']
      });
    } catch (aiErr) {
      console.error('[gameController] Final AI Error:', aiErr.message);
      return res.status(503).json({
        success: false,
        message: 'High server traffic on AI nodes. Please tap retry in 5 seconds!'
      });
    }

    // Update the meal in diet_plan
    if (daySchedule && daySchedule.meals) {
      daySchedule.meals = daySchedule.meals.map(m => m.id === mealId ? newMeal : m);
    }
    if (dietPlan.meals) {
      dietPlan.meals = dietPlan.meals.map(m => m.id === mealId ? newMeal : m);
    }

    // Also update any active quest associated with this meal
    const quests = await QuestModel.findByUserId(userId);
    for (const q of quests) {
      if (q.category === 'nutrition' && (q.title?.toLowerCase().includes(mealId) || q.description?.toLowerCase().includes(mealId))) {
        await QuestModel.update(q.id, {
          title: `Meal Quest: ${newMeal.name} (+200 XP)`,
          description: `Log eating your ${mealId} (${newMeal.calories} kcal, ${newMeal.protein_g}g Protein) to fuel today's adventure.`
        });
      }
    }

    await UserModel.updateProfile(userId, { diet_plan: dietPlan });
    const updatedUser = await UserModel.findById(userId);
    const updatedQuests = await QuestModel.findByUserId(userId);

    res.json({
      success: true,
      message: `🎲 Rerolled ${mealId} to: "${newMeal.name}"!`,
      newMeal,
      diet_plan: dietPlan,
      user: updatedUser,
      quests: updatedQuests
    });
  } catch (error) {
    next(error);
  }
};

export const resurrectPlayer = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { method = 'recovery_walk' } = req.body;

    const healedStats = await PlayerStatsModel.healHP(userId, 100);
    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      has_unplanned_trap: false,
      hp_current: 100
    });

    res.json({
      success: true,
      message: method === 'recovery_walk'
        ? '🗡️ Recovery Quest Completed! You have arisen with 100 HP! Your progress is safe!'
        : '✨ Revitalizing Sacred Water consumed! You have been resurrected with 100 HP!',
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const buyPetItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { itemId, costCoins = 100, itemType = 'hat' } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: 'itemId is required' });
    }

    const stats = await PlayerStatsModel.findByUserId(userId);
    const currentCoins = stats.coins || 0;

    if (currentCoins < costCoins) {
      return res.status(400).json({
        success: false,
        message: `Not enough coins! Item costs ${costCoins} coins, but you only have ${currentCoins}.`
      });
    }

    const currentUnlocked = stats.pet_customization?.unlocked_items || [];
    if (currentUnlocked.includes(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'You already own this item!'
      });
    }

    const newCoins = currentCoins - Number(costCoins);
    const newUnlocked = [...currentUnlocked, itemId];

    const petCustomization = {
      ...(stats.pet_customization || {}),
      unlocked_items: newUnlocked
    };

    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      coins: newCoins,
      pet_customization: petCustomization
    });

    res.json({
      success: true,
      message: `Unlocked ${itemId}! You now have ${newCoins} coins remaining.`,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const equipPetItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { slot, itemId } = req.body; // slot: 'hat' | 'glasses' | 'outfit' | 'background'

    if (!slot) {
      return res.status(400).json({ success: false, message: 'slot is required' });
    }

    const stats = await PlayerStatsModel.findByUserId(userId);
    const petCustomization = { ...(stats.pet_customization || {}) };
    const unlocked = petCustomization.unlocked_items || [];

    // If equipping (not unequipping), verify ownership
    if (itemId && !unlocked.includes(itemId)) {
      return res.status(400).json({
        success: false,
        message: 'You do not own this item yet!'
      });
    }

    const slotKey = `equipped_${slot}`;
    petCustomization[slotKey] = itemId || null;

    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      pet_customization: petCustomization
    });

    res.json({
      success: true,
      message: itemId ? `Equipped ${itemId} on your pet!` : `Unequipped item from ${slot}!`,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const interactPet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { action = 'pet' } = req.body; // 'pet' | 'feed' | 'play'

    const stats = await PlayerStatsModel.findByUserId(userId);
    const pet = { ...(stats.pet_customization || {}) };

    let xpEarned = 10;
    let message = 'Your pet purrs happily and snuggles closer! 💖';

    if (action === 'feed') {
      const currentNourishment = pet.nourishment !== undefined ? pet.nourishment : Math.max(0, 100 - (pet.hunger ?? 20));
      const updatedNourishment = Math.min(100, currentNourishment + 20);
      pet.nourishment = updatedNourishment;
      pet.hunger = Math.max(0, 100 - updatedNourishment);
      pet.happiness = Math.min(100, (pet.happiness || 80) + 15);
      xpEarned = 15;
      message = 'Your pet crunched the healthy fruit! "Nom nom! That was super fresh and energizing!" 🍏';
    } else if (action === 'play') {
      pet.happiness = Math.min(100, (pet.happiness || 80) + 20);
      xpEarned = 15;
      message = 'High five! Your pet bounced with joy! "We\'re going to crush our goals today, boss!" 🐾';
    } else {
      // pet
      pet.happiness = Math.min(100, (pet.happiness || 80) + 10);
      xpEarned = 10;
      message = 'You gently pat your companion! Hearts burst into the air! 💕';
    }

    pet.last_interaction = new Date().toISOString();

    await PlayerStatsModel.addXP(userId, xpEarned);
    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      pet_customization: pet
    });

    res.json({
      success: true,
      message,
      xpEarned,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export const claimBadge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { badgeId } = req.body;

    const stats = await PlayerStatsModel.findByUserId(userId);
    const badges = stats.scout_badges || [];
    const badge = badges.find(b => b.id === badgeId);

    if (!badge) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }

    if (badge.claimed) {
      return res.status(400).json({ success: false, message: 'Badge reward already claimed!' });
    }

    const coinsReward = badge.coinsReward || 150;
    const updatedBadges = badges.map(b => b.id === badgeId ? { ...b, claimed: true } : b);

    await PlayerStatsModel.addCoins(userId, coinsReward);
    await PlayerStatsModel.addXP(userId, 100);

    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      scout_badges: updatedBadges
    });

    res.json({
      success: true,
      message: `🎖️ Scout Honor Claimed: ${badge.title}! Awarded +${coinsReward} Coins and +100 XP!`,
      coinsReward,
      stats: updatedStats
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStats,
  applyDamage,
  logWater,
  triggerTrap,
  useInventoryItem,
  completeDay,
  recordWeighIn,
  rerollMeal,
  resurrectPlayer,
  buyPetItem,
  equipPetItem,
  interactPet,
  claimBadge,
  logWalkBonus
};
