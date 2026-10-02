import bcrypt from 'bcryptjs';
import { getCollection } from '../config/db.js';

const userCollection = () => getCollection('users');

export const UserModel = {
  async create({ name, email, password, user_goal = 'weight_loss', diet_type = 'Balanced', device_sync = 'Apple Watch', age = '26-35', height_cm = '171-180cm', weight_kg = '71-85kg', liked_foods = ['Chicken', 'Rice', 'Vegetables'], disliked_foods = ['None'], favorite_cuisines = ['Egyptian', 'Mediterranean'], allergies = ['None'], metrics = null }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      user_goal,
      diet_type,
      device_sync,
      age,
      height_cm,
      weight_kg,
      liked_foods,
      disliked_foods,
      favorite_cuisines,
      allergies,
      metrics,
      campaign: {
        current_day: 1,
        current_week: 1,
        starting_weight_kg: 75,
        target_weight_kg: user_goal === 'weight_loss' ? 70 : user_goal === 'weight_gain' ? 80 : 75,
        current_weight_kg: 75,
        weight_history: [],
        week_unlocked: 1,
        needs_weigh_in: false,
        daily_logs: []
      },
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return await userCollection().insertOne(newUser);
  },

  async findByEmail(email) {
    if (!email) return null;
    return await userCollection().findOne({ email: email.toLowerCase().trim() });
  },

  async findById(id) {
    if (!id) return null;
    return await userCollection().findById(id);
  },

  async comparePassword(candidatePassword, passwordHash) {
    return await bcrypt.compare(candidatePassword, passwordHash);
  },

  async updateProfile(userId, updates) {
    const allowed = [
      'name',
      'user_goal',
      'diet_type',
      'device_sync',
      'onboardingCompleted',
      'age',
      'height_cm',
      'weight_kg',
      'liked_foods',
      'disliked_foods',
      'favorite_cuisines',
      'allergies',
      'metrics',
      'diet_plan',
      'walking_plan',
      'campaign',
      'pet_customization',
      'badges'
    ];
    const filtered = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filtered[key] = updates[key];
      }
    }
    return await userCollection().updateOne({ id: userId }, filtered);
  }
};

export default UserModel;
