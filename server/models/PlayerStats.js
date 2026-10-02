import { getCollection } from '../config/db.js';

const statsCollection = () => getCollection('playerStats');

export const calculateEnergy = (waterCurrent, waterTarget, stepsCurrent, stepsTarget) => {
  const waterRatio = Math.min(1, Math.max(0, (waterCurrent || 0) / (waterTarget || 2500)));
  const stepRatio = Math.min(1, Math.max(0, (stepsCurrent || 0) / (stepsTarget || 8000)));
  return Math.min(100, Math.round((waterRatio * 0.5 + stepRatio * 0.5) * 100));
};

export const calculateLevel = (totalXP) => {
  const safeXP = Math.max(0, totalXP || 0);
  return Math.floor(safeXP / 1000) + 1;
};

export const calculatePetStage = (level) => {
  if (level >= 50) return 'champion';
  if (level >= 25) return 'adult';
  if (level >= 10) return 'teen';
  return 'baby';
};

export const getStreakMultiplier = (streakCount) => {
  return (streakCount || 0) >= 5 ? 1.5 : 1.0;
};

export const defaultPetCustomization = () => ({
  name: 'Pip',
  stage: 'baby',
  equipped_hat: null,
  equipped_glasses: null,
  equipped_outfit: null,
  equipped_background: 'bg_cozy_guild',
  unlocked_items: ['bg_cozy_guild'],
  happiness: 50,
  hunger: 50,
  last_interaction: new Date().toISOString()
});

export const defaultScoutBadges = (stats) => {
  const water = stats?.water_current_ml || 0;
  const steps = stats?.steps_current || 0;
  const streak = stats?.streak_count || 0;

  let waterStars = 1;
  if (water >= 4000) waterStars = 3;
  else if (water >= 2500) waterStars = 2;

  let stepStars = 1;
  if (steps >= 16000) stepStars = 3;
  else if (steps >= 8000) stepStars = 2;

  let streakStars = 1;
  if (streak >= 7) streakStars = 3;
  else if (streak >= 3) streakStars = 2;

  return [
    {
      id: 'hydration_titan',
      title: 'Hydration Titan Scout',
      category: 'water',
      stars: waterStars,
      maxStars: 3,
      current: water,
      target: 4000,
      unit: 'mL',
      isOverachiever: water >= 4000,
      badgeIcon: '💧',
      description: 'Drink 4.0L+ water (exceeding standard 3L) for the 3-star Overachiever rating!',
      claimed: false,
      coinsReward: 150
    },
    {
      id: 'trailblazer_scout',
      title: 'Trailblazer Scout',
      category: 'steps',
      stars: stepStars,
      maxStars: 3,
      current: steps,
      target: 16000,
      unit: 'steps',
      isOverachiever: steps >= 16000,
      badgeIcon: '👟',
      description: 'Achieve double daily steps (16,000 steps) for the 3-star Overachiever rating!',
      claimed: false,
      coinsReward: 200
    },
    {
      id: 'iron_will',
      title: 'Iron Will Scout',
      category: 'streak',
      stars: streakStars,
      maxStars: 3,
      current: streak,
      target: 7,
      unit: 'days',
      isOverachiever: streak >= 7,
      badgeIcon: '🔥',
      description: 'Maintain an uninterrupted 7-day fitness streak without breaking discipline!',
      claimed: false,
      coinsReward: 250
    },
    {
      id: 'culinary_virtuoso',
      title: 'Culinary Virtuoso Scout',
      category: 'diet',
      stars: 2,
      maxStars: 3,
      current: 2,
      target: 3,
      unit: 'meals',
      isOverachiever: false,
      badgeIcon: '🍳',
      description: 'Log and claim all 3 daily meals directly according to your personalized AI plan.',
      claimed: false,
      coinsReward: 120
    }
  ];
};

export const PlayerStatsModel = {
  async initStats(userId, goal = 'weight_loss') {
    let waterTarget = 3000;
    let stepTarget = 8000;

    if (goal === 'weight_gain') {
      waterTarget = 2500;
      stepTarget = 8000;
    } else if (goal === 'weight_maintenance') {
      waterTarget = 2500;
      stepTarget = 10000;
    }

    const defaultStats = {
      userId,
      hp_current: 100,
      hp_max: 100,
      xp_total: 0,
      level: 1,
      coins: 200, // Exactly 200 starting coins
      streak_count: 0,
      streak_multiplier: 1.0,
      water_current_ml: 0, // Strict 0
      water_target_ml: waterTarget,
      steps_current: 0, // Strict 0
      steps_target: stepTarget,
      bpm_current: 72,
      energy_bar: 0,
      active_shield_until: null,
      active_rest_day_until: null,
      has_unplanned_trap: false,
      trap_penalty_time: null,
      last_reset_date: new Date().toISOString().split('T')[0],
      pet_customization: defaultPetCustomization(),
      scout_badges: []
    };

    defaultStats.energy_bar = calculateEnergy(
      defaultStats.water_current_ml,
      defaultStats.water_target_ml,
      defaultStats.steps_current,
      defaultStats.steps_target
    );
    defaultStats.scout_badges = defaultScoutBadges(defaultStats);

    return await statsCollection().insertOne(defaultStats);
  },

  async findByUserId(userId) {
    let stats = await statsCollection().findOne({ userId });
    if (!stats) {
      stats = await this.initStats(userId);
    }
    // Recompute dynamic values
    stats.level = calculateLevel(stats.xp_total);
    // Wipe legacy 614/350 coins or missing coins to exactly 200 fresh starting balance
    if (stats.coins === undefined || stats.coins === 614 || stats.coins === 350) {
      stats.coins = 200;
    }
    if (!stats.pet_customization) stats.pet_customization = defaultPetCustomization();
    stats.pet_customization.stage = calculatePetStage(stats.level);
    stats.streak_multiplier = getStreakMultiplier(stats.streak_count);
    stats.energy_bar = calculateEnergy(
      stats.water_current_ml,
      stats.water_target_ml,
      stats.steps_current,
      stats.steps_target
    );
    if (!stats.scout_badges || stats.scout_badges.length === 0) {
      stats.scout_badges = defaultScoutBadges(stats);
    } else {
      // Sync badge progress
      stats.scout_badges = stats.scout_badges.map(b => {
        if (b.id === 'hydration_titan') {
          const w = stats.water_current_ml || 0;
          let stars = 1;
          if (w >= 4000) stars = 3;
          else if (w >= 2500) stars = 2;
          return { ...b, current: w, stars, isOverachiever: w >= 4000 };
        }
        if (b.id === 'trailblazer_scout') {
          const s = stats.steps_current || 0;
          let stars = 1;
          if (s >= 16000) stars = 3;
          else if (s >= 8000) stars = 2;
          return { ...b, current: s, stars, isOverachiever: s >= 16000 };
        }
        if (b.id === 'iron_will') {
          const st = stats.streak_count || 0;
          let stars = 1;
          if (st >= 7) stars = 3;
          else if (st >= 3) stars = 2;
          return { ...b, current: st, stars, isOverachiever: st >= 7 };
        }
        return b;
      });
    }
    return stats;
  },

  async updateStats(userId, updates) {
    const existing = await this.findByUserId(userId);
    const merged = { ...existing, ...updates };

    // Recompute level, pet stage, and energy
    merged.level = calculateLevel(merged.xp_total);
    if (merged.coins === undefined) merged.coins = existing.coins ?? 200;
    if (!merged.pet_customization) merged.pet_customization = defaultPetCustomization();
    merged.pet_customization.stage = calculatePetStage(merged.level);
    merged.streak_multiplier = getStreakMultiplier(merged.streak_count);
    merged.energy_bar = calculateEnergy(
      merged.water_current_ml,
      merged.water_target_ml,
      merged.steps_current,
      merged.steps_target
    );

    await statsCollection().updateOne({ userId }, merged);
    return merged;
  },

  async addCoins(userId, amount) {
    const stats = await this.findByUserId(userId);
    const newCoins = Math.max(0, (stats.coins || 0) + Number(amount));
    return await this.updateStats(userId, { coins: newCoins });
  },

  async deductCoins(userId, amount) {
    const stats = await this.findByUserId(userId);
    if ((stats.coins || 0) < amount) {
      throw new Error(`Insufficient coins! You need ${amount} coins but currently have ${stats.coins || 0}.`);
    }
    const newCoins = (stats.coins || 0) - Number(amount);
    return await this.updateStats(userId, { coins: newCoins });
  },

  async addXP(userId, baseXP) {
    const stats = await this.findByUserId(userId);
    const multiplier = getStreakMultiplier(stats.streak_count);
    const xpEarned = Math.round(baseXP * multiplier);
    const newXP = Math.max(0, (stats.xp_total || 0) + xpEarned);
    const oldLevel = stats.level;
    const newLevel = calculateLevel(newXP);

    const updated = await this.updateStats(userId, { xp_total: newXP });
    return {
      updated,
      xpEarned,
      multiplier,
      leveledUp: newLevel > oldLevel,
      newLevel
    };
  },

  async deductXP(userId, xpAmount) {
    const stats = await this.findByUserId(userId);
    const newXP = Math.max(0, (stats.xp_total || 0) - xpAmount);
    return await this.updateStats(userId, { xp_total: newXP });
  },

  async takeDamage(userId, damageAmount) {
    const stats = await this.findByUserId(userId);
    
    // Check if shielded
    if (stats.active_shield_until && new Date(stats.active_shield_until) > new Date()) {
      return {
        stats,
        damageTaken: 0,
        shieldBlocked: true,
        message: 'Shield absorbed the caloric penalty!'
      };
    }

    const newHP = Math.max(0, Math.min(100, (stats.hp_current || 100) - damageAmount));
    const updated = await this.updateStats(userId, { hp_current: newHP });
    return {
      stats: updated,
      damageTaken: damageAmount,
      shieldBlocked: false,
      isFainted: newHP <= 0
    };
  },

  async healHP(userId, healAmount) {
    const stats = await this.findByUserId(userId);
    const newHP = Math.min(100, (stats.hp_current || 0) + healAmount);
    return await this.updateStats(userId, { hp_current: newHP });
  },

  async incrementStreak(userId) {
    const stats = await this.findByUserId(userId);
    const newStreak = (stats?.streak_count || 0) + 1;
    return await this.updateStats(userId, { streak_count: newStreak });
  }
};

export default PlayerStatsModel;
