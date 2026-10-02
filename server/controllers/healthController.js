import HealthSyncModel from '../models/HealthSync.js';
import PlayerStatsModel from '../models/PlayerStats.js';
import UserModel from '../models/User.js';

const CELEBRATION_MESSAGES = [
  'You did it! Your feet walked a massive distance today! 🌟 Your character grew stronger!',
  'Unstoppable energy! Step goal unlocked! Take a breath and drink some cold water! 💧',
  'Legendary stride! Your stamina has reached god-tier today! Keep pressing onward, hero! ⚔️',
  'Daily step goal shattered! Your energy core is pulsating at maximum power! 🔥'
];

export const syncHealthTelemetry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { steps, bpm = 74, caloriesBurned = 250, deviceType } = req.body;

    const user = await UserModel.findById(userId);
    const prevStats = await PlayerStatsModel.findByUserId(userId);

    const stepsTarget = prevStats.steps_target || 8000;
    const previousSteps = prevStats.steps_current || 0;
    const newSteps = Number(steps);

    // Check if user crossed the step target milestone
    const goalJustAchieved = previousSteps < stepsTarget && newSteps >= stepsTarget;
    let celebrationPayload = null;

    if (goalJustAchieved) {
      // Award +200 XP for hitting smartwatch step milestone
      const xpResult = await PlayerStatsModel.addXP(userId, 200);

      const randomMsg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];

      celebrationPayload = {
        triggered: true,
        bonusXP: xpResult.xpEarned,
        message: randomMsg,
        sound: 'victory_chime',
        mascotState: 'mascot_celebrate'
      };
    }

    // Update player stats with telemetry
    const updatedStats = await PlayerStatsModel.updateStats(userId, {
      steps_current: newSteps,
      bpm_current: Number(bpm)
    });

    // Log walking session packet
    await HealthSyncModel.logTelemetry({
      userId,
      deviceType: deviceType || 'In-App Walking Quest',
      steps: newSteps,
      bpm: Number(bpm),
      caloriesBurned: Number(caloriesBurned)
    });

    res.json({
      success: true,
      message: goalJustAchieved ? 'Walking milestone achieved! +200 XP!' : 'In-app walking session recorded.',
      stats: updatedStats,
      celebration: celebrationPayload
    });
  } catch (error) {
    next(error);
  }
};

export const getHealthHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const logs = await HealthSyncModel.getRecentLogs(userId, 15);

    res.json({
      success: true,
      logs
    });
  } catch (error) {
    next(error);
  }
};

export const mockStepIncrement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { deltaSteps = 1000, bpm = 88 } = req.body;

    const currentStats = await PlayerStatsModel.findByUserId(userId);
    const newTotalSteps = (currentStats.steps_current || 0) + Number(deltaSteps);

    // Delegate to syncHealthTelemetry logic
    req.body.steps = newTotalSteps;
    req.body.bpm = bpm;
    return await syncHealthTelemetry(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default {
  syncHealthTelemetry,
  getHealthHistory,
  mockStepIncrement
};
