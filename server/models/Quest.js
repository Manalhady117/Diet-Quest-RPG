import { getCollection } from '../config/db.js';

const questCollection = () => getCollection('quests');

export const getDailyQuestTemplates = (goal = 'weight_loss') => {
  switch (goal) {
    case 'weight_gain':
      return [
        {
          type: 'main',
          category: 'weight_gain',
          title: 'Macro Fortress: Calorie Surplus',
          description: 'Log 3 main balanced meals plus 2 high-protein calorie-dense snacks.',
          baseXP: 300,
          unit: 'meals & snacks',
          progress: 0,
          maxProgress: 5,
        },
        {
          type: 'side',
          category: 'weight_gain',
          title: 'Titan Hydration & Iron Forge',
          description: 'Drink 2.5 Liters of water and complete a full resistance/strength workout session.',
          baseXP: 100,
          unit: 'tasks',
          progress: 0,
          maxProgress: 2,
        },
        {
          type: 'boss',
          category: 'weight_gain',
          title: 'Boss Battle: The Anabolic Titan',
          description: 'Hit 100% of both daily total calorie targets and daily total protein macros.',
          baseXP: 500,
          unit: '% macro completion',
          progress: 0,
          maxProgress: 100,
        }
      ];

    case 'weight_maintenance':
      return [
        {
          type: 'main',
          category: 'weight_maintenance',
          title: 'Equilibrium Stance',
          description: 'Maintain exact target caloric intake within a small margin of error (±5%).',
          baseXP: 300,
          unit: 'precision margin',
          progress: 0,
          maxProgress: 1,
        },
        {
          type: 'side',
          category: 'weight_maintenance',
          title: 'The 10k Wanderer March',
          description: 'Reach 10,000 total steps tracked via smartwatch or phone pedometer.',
          baseXP: 100,
          unit: 'steps',
          progress: 0,
          maxProgress: 10000,
        },
        {
          type: 'boss',
          category: 'weight_maintenance',
          title: 'Boss Battle: Sugar Phantom Zero',
          description: 'Consume zero processed or refined sugars for 24 consecutive hours.',
          baseXP: 500,
          unit: 'sugar-free hours',
          progress: 0,
          maxProgress: 24,
        }
      ];

    case 'weight_loss':
    default:
      return [
        {
          type: 'main',
          category: 'weight_loss',
          title: 'Deficit Vanguard',
          description: 'Log all meals while strictly staying within the assigned daily caloric deficit limit.',
          baseXP: 300,
          unit: 'meals logged in deficit',
          progress: 0,
          maxProgress: 3,
        },
        {
          type: 'side',
          category: 'weight_loss',
          title: 'Hydration Springs & Swift Pacing',
          description: 'Drink 3 Liters of water and reach 8,000 steps tracked by smartwatch or phone.',
          baseXP: 100,
          unit: 'milestones met',
          progress: 0,
          maxProgress: 2,
        },
        {
          type: 'boss',
          category: 'weight_loss',
          title: 'Boss Battle: The 16-Hour Fasting Dragon',
          description: 'Complete a 16-hour Intermittent Fasting window without breaking the diet.',
          baseXP: 500,
          unit: 'fasting hours',
          progress: 0,
          maxProgress: 16,
        }
      ];
  }
};

export const QuestModel = {
  async findByUserId(userId) {
    const userQuests = await questCollection().find(q => q.userId === userId);
    return userQuests || [];
  },

  async getQuestsByUserId(userId) {
    return this.findByUserId(userId);
  },

  async createMany(userId, questList = []) {
    return this.setCustomQuestsForUser(userId, questList);
  },

  async deleteByUserId(userId) {
    await questCollection().deleteMany(q => q.userId === userId);
    return true;
  },

  async update(questId, updates) {
    const updated = await questCollection().updateOne({ id: questId }, updates);
    return updated;
  },

  async seedDailyQuestsForUser(userId, goal = 'weight_loss') {
    const today = new Date().toISOString().split('T')[0];
    const existing = await questCollection().find(q => q.userId === userId && q.date === today);
    
    if (existing.length > 0) {
      return existing;
    }

    const templates = getDailyQuestTemplates(goal);
    const createdQuests = [];

    for (const t of templates) {
      const doc = await questCollection().insertOne({
        userId,
        title: t.title,
        description: t.description,
        type: t.type,
        category: t.category,
        baseXP: t.baseXP,
        unit: t.unit,
        progress: t.progress || 0,
        maxProgress: t.maxProgress || 1,
        completed: false,
        claimed: false,
        date: today
      });
      createdQuests.push(doc);
    }

    return createdQuests;
  },

  async setCustomQuestsForUser(userId, questList) {
    const today = new Date().toISOString().split('T')[0];
    // Remove existing regular quests for today (keep recovery quests if any)
    await questCollection().deleteMany(q => q.userId === userId && q.type !== 'recovery');

    const createdQuests = [];
    for (const t of questList) {
      const doc = await questCollection().insertOne({
        userId,
        title: t.title,
        description: t.description,
        type: t.type,
        category: t.category,
        baseXP: t.baseXP,
        unit: t.unit,
        progress: t.progress || 0,
        maxProgress: t.maxProgress || 1,
        completed: false,
        claimed: false,
        date: today
      });
      createdQuests.push(doc);
    }
    return createdQuests;
  },

  async createRecoveryQuest(userId) {
    const today = new Date().toISOString().split('T')[0];
    const quest = await questCollection().insertOne({
      userId,
      title: '🚨 Recovery Quest: Fast Food Purge',
      description: 'Walk for 20 minutes briskly to counteract the junk food trap debuff and restore stamina.',
      type: 'recovery',
      category: 'recovery',
      baseXP: 150,
      unit: 'minutes brisk walking',
      progress: 0,
      maxProgress: 20,
      completed: false,
      claimed: false,
      date: today
    });
    return quest;
  },

  async completeQuest(questId, userId) {
    const quest = await questCollection().findOne(q => q.id === questId && q.userId === userId);
    if (!quest) return null;

    const updated = await questCollection().updateOne({ id: questId }, {
      completed: true,
      progress: quest.maxProgress,
      completedAt: new Date().toISOString()
    });
    return updated;
  },

  async claimQuest(questId, userId) {
    const quest = await questCollection().findOne(q => q.id === questId && q.userId === userId);
    if (!quest || !quest.completed || quest.claimed) return null;

    const updated = await questCollection().updateOne({ id: questId }, {
      claimed: true,
      claimedAt: new Date().toISOString()
    });
    return updated;
  },

  async updateProgress(questId, userId, amount, isIncremental = true) {
    const quest = await questCollection().findOne(q => q.id === questId && q.userId === userId);
    if (!quest) return null;

    let newProgress = isIncremental ? (quest.progress || 0) + amount : amount;
    newProgress = Math.min(quest.maxProgress, Math.max(0, Number(newProgress.toFixed(2))));

    const isCompleted = newProgress >= quest.maxProgress;

    const updated = await questCollection().updateOne({ id: questId }, {
      progress: newProgress,
      completed: isCompleted,
      ...(isCompleted && !quest.completed ? { completedAt: new Date().toISOString() } : {})
    });
    return updated;
  }
};

export default QuestModel;
