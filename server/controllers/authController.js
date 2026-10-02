import UserModel from '../models/User.js';
import PlayerStatsModel from '../models/PlayerStats.js';
import QuestModel from '../models/Quest.js';
import InventoryModel from '../models/Inventory.js';
import { signToken } from '../config/jwt.js';

const formatUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    user_goal: user.user_goal || 'weight_loss',
    diet_type: user.diet_type || 'Balanced',
    device_sync: user.device_sync || 'Apple Watch',
    age: user.age || '26-35',
    height_cm: user.height_cm || '171-180cm',
    weight_kg: user.weight_kg || '71-85kg',
    liked_foods: user.liked_foods || ['Chicken', 'Rice', 'Vegetables'],
    disliked_foods: user.disliked_foods || ['None'],
    favorite_cuisines: user.favorite_cuisines || ['Egyptian', 'Mediterranean'],
    allergies: user.allergies || ['None'],
    metrics: user.metrics || null,
    diet_plan: user.diet_plan || null,
    walking_plan: user.walking_plan || null,
    campaign: user.campaign || {
      current_day: 1,
      current_week: 1,
      starting_weight_kg: 75,
      target_weight_kg: user.user_goal === 'weight_loss' ? 70 : user.user_goal === 'weight_gain' ? 80 : 75,
      current_weight_kg: 75,
      weight_history: [],
      week_unlocked: 1,
      needs_weigh_in: false,
      daily_logs: []
    },
    onboardingCompleted: !!user.onboardingCompleted
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, user_goal, diet_type, device_sync, age, height_cm, weight_kg, liked_foods, disliked_foods, metrics } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required to embark on the quest!'
      });
    }

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An adventurer with this email already exists! Please log in.'
      });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      user_goal: user_goal || 'weight_loss',
      diet_type: diet_type || 'Balanced',
      device_sync: device_sync || 'Apple Watch',
      age: age || '26-35',
      height_cm: height_cm || '171-180cm',
      weight_kg: weight_kg || '71-85kg',
      liked_foods: liked_foods || ['Chicken', 'Rice', 'Vegetables'],
      disliked_foods: disliked_foods || ['None'],
      metrics: metrics || null
    });

    // Initialize RPG Stats
    const stats = await PlayerStatsModel.initStats(user.id, user.user_goal);
    // Initialize Inventory starter pack
    const inventory = await InventoryModel.getByUserId(user.id);
    // Seed Daily Quests tailored to goal
    const quests = await QuestModel.seedDailyQuestsForUser(user.id, user.user_goal);

    const token = signToken({ id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: `Welcome Adventurer ${user.name}! Your journey begins!`,
      token,
      user: formatUser(user),
      stats,
      inventory,
      quests
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const isMatch = await UserModel.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const stats = await PlayerStatsModel.findByUserId(user.id);
    const inventory = await InventoryModel.getByUserId(user.id);
    const quests = await QuestModel.seedDailyQuestsForUser(user.id, user.user_goal);
    const token = signToken({ id: user.id, email: user.email });

    res.json({
      success: true,
      message: `Welcome back, hero ${user.name}!`,
      token,
      user: formatUser(user),
      stats,
      inventory,
      quests
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const stats = await PlayerStatsModel.findByUserId(userId);
    const inventory = await InventoryModel.getByUserId(userId);
    const quests = await QuestModel.seedDailyQuestsForUser(userId, user.user_goal);

    res.json({
      success: true,
      user: formatUser(user),
      stats,
      inventory,
      quests
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      user_goal,
      diet_type,
      device_sync,
      onboardingCompleted,
      age,
      height_cm,
      weight_kg,
      liked_foods,
      disliked_foods,
      favorite_cuisines,
      allergies,
      metrics,
      campaign,
      diet_plan,
      walking_plan
    } = req.body;

    const updatedUser = await UserModel.updateProfile(userId, {
      name,
      user_goal,
      diet_type,
      device_sync,
      onboardingCompleted,
      age,
      height_cm,
      weight_kg,
      liked_foods,
      disliked_foods,
      favorite_cuisines,
      allergies,
      metrics,
      campaign,
      diet_plan,
      walking_plan
    });

    // Update target stats if goal changed
    if (user_goal) {
      let waterTarget = metrics?.water_target_ml || 3000;
      let stepTarget = 8000;
      if (user_goal === 'weight_gain') {
        waterTarget = metrics?.water_target_ml || 2500;
        stepTarget = 8000;
      } else if (user_goal === 'weight_maintenance') {
        waterTarget = metrics?.water_target_ml || 2500;
        stepTarget = 10000;
      }
      await PlayerStatsModel.updateStats(userId, {
        water_target_ml: waterTarget,
        steps_target: stepTarget
      });
      // Refresh daily quests for the new goal if not already set
      await QuestModel.seedDailyQuestsForUser(userId, user_goal);
    }

    const stats = await PlayerStatsModel.findByUserId(userId);

    res.json({
      success: true,
      message: 'Profile and RPG parameters successfully updated!',
      user: formatUser(updatedUser),
      stats
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  getMe,
  updateProfile
};
