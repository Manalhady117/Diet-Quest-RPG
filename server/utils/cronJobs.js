import { getCollection } from '../config/db.js';
import QuestModel from '../models/Quest.js';
import PlayerStatsModel from '../models/PlayerStats.js';

/**
 * Midnight Automatic HP Reset & Daily Quest Generation
 * Resets HP to 100 each morning and refreshes daily quest line
 */
export const runMidnightRoutine = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const users = await getCollection('users').find();

    console.log(`[Cron] Checking midnight daily refresh for ${users.length} adventurer(s) on ${today}...`);

    for (const user of users) {
      const stats = await PlayerStatsModel.findByUserId(user.id);
      
      // If stats last reset date is older than today, apply morning rejuvenation
      if (!stats.last_reset_date || stats.last_reset_date !== today) {
        console.log(`[Cron] Rejuvenating adventurer ${user.name} (${user.id}) to 100 HP!`);
        
        await PlayerStatsModel.updateStats(user.id, {
          hp_current: 100,
          water_current_ml: 0,
          steps_current: 0,
          has_unplanned_trap: false,
          last_reset_date: today,
          active_rest_day_until: null
        });

        // Seed new daily quests for user
        await QuestModel.seedDailyQuestsForUser(user.id, user.user_goal || 'weight_loss');
      }
    }
  } catch (error) {
    console.error('[Cron] Error running midnight routine:', error);
  }
};

/**
 * Initialize cron schedule (runs hourly and on server boot)
 */
export const initCronJobs = () => {
  // Run on startup
  runMidnightRoutine();

  // Run every 30 minutes to check day boundaries
  setInterval(() => {
    runMidnightRoutine();
  }, 30 * 60 * 1000);

  console.log('[Cron] Diet Quest Midnight HP reset and quest generator active.');
};

export default {
  runMidnightRoutine,
  initCronJobs
};
