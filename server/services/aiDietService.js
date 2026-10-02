import { GoogleGenAI } from '@google/genai';

/**
 * Modern Multi-Model Fallback Chain for Gemini Cloud AI
 * Cascades across models to avoid 503 High Demand / Quota errors:
 */
export const MODELS_TO_TRY = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

export const callClaudeFallback = async (prompt, systemInstruction = '', maxTokens = 1000) => {
  console.log('[AI Service] Switching to Claude API fallback...');
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const msg = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    system: systemInstruction || undefined,
    messages: [{ role: 'user', content: prompt }],
  });

  return msg.content[0].text;
};

/**
 * Executes an AI call with automatic model cascading, retry backoff, and optional Claude fallback
 */
export const callAIWithFallback = async (prompt, { isJson = false, systemInstruction = '', maxOutputTokens = 1000 } = {}) => {
  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('No AI API key (GEMINI_API_KEY or ANTHROPIC_API_KEY) configured on the server.');
  }

  let lastError = null;

  if (process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    for (const modelName of MODELS_TO_TRY) {
      // Allow up to 2 attempts per model for transient 503 high demand
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const config = {
            temperature: 0.7,
            maxOutputTokens
          };

          if (isJson) {
            config.responseMimeType = 'application/json';
          }

          if (systemInstruction) {
            config.systemInstruction = systemInstruction;
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config
          });

          if (response && response.text) {
            return response.text;
          }
        } catch (error) {
          const status = error?.status || error?.code || 500;
          if (status === 503 || status === 429) {
            lastError = error;
          } else if (!lastError) {
            lastError = error;
          }
          console.warn(`[AI Service] Model ${modelName} (attempt ${attempt}) failed with status ${status}: ${error?.message || error}.`);
          if (status === 503 || status === 429) {
            // Exponential backoff before retry or next model
            await new Promise((res) => setTimeout(res, 1000 * attempt));
          } else {
            // Not a transient 503/429 (e.g. 404), break immediately to next model
            break;
          }
        }
      }
    }
  }

  // 2. If all Gemini models fail, attempt Claude API fallback
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await callClaudeFallback(prompt, systemInstruction, maxOutputTokens);
    } catch (claudeErr) {
      console.warn('[AI Service] Claude fallback failed:', claudeErr.message);
      lastError = claudeErr;
    }
  }

  // If cloud nodes are completely unreachable, throw descriptive error
  throw lastError || new Error('All AI models are currently unavailable. Please try again in a moment.');
};

/**
 * Standard callAIModel wrapper
 */
export const callAIModel = async (prompt, isJson = true) => {
  return await callAIWithFallback(prompt, { isJson });
};

/**
 * Generates an alternative meal via live AI call to Gemini with full recipe instructions
 */
export const generateMealWithAI = async ({
  currentMeal = {},
  mealId = 'lunch',
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFats,
  goal = 'weight_loss',
  diet_type = 'Balanced',
  liked_foods = [],
  disliked_foods = [],
  favorite_cuisines = ['Egyptian', 'Mediterranean']
}) => {
  const mealCalories = targetCalories || currentMeal.calories || 500;
  const mealName = currentMeal.name || mealId;

  const prompt = `Act as an elite RPG executive nutritionist and culinary chef. Generate a fresh, realistic, highly creative alternative meal to replace "${mealName}".
Requirements:
- Target Calories: exact ${mealCalories} kcal (±35 kcal).
- Target Goal: ${goal}.
${diet_type ? `- Dietary Type: ${diet_type}` : ''}
${favorite_cuisines?.length ? `- Preferred Cuisines (prioritize Egyptian & Mediterranean if requested): ${favorite_cuisines.join(', ')}` : ''}
${liked_foods?.length ? `- Preferred ingredients: ${liked_foods.join(', ')}` : ''}
${disliked_foods?.length ? `- Strictly exclude: ${disliked_foods.join(', ')}` : ''}
- If Egyptian cuisine is favored, provide an authentic healthy adaptation (e.g., Healthy Brown Rice & Lentil Koshary with Dakka, Shorbat Ads / Spiced Egyptian Lentil Soup, Grilled Lean Kofta with Tahini & Baladi Salad, Hawawshi in Whole Wheat Pita, or Shakshuka).
- Include step-by-step cooking method and preparation instructions.
- Output JSON format: {
  "name": string,
  "name_ar": string,
  "rpg_title": string,
  "description": string,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "prep_time_mins": number,
  "cook_time_mins": number,
  "ingredients": string[],
  "recipe_steps": string[],
  "cooking_tip": string
}`;

  try {
    const rawJson = await callAIWithFallback(prompt, { isJson: true });
    const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;

    const defaultSteps = [
      'Preheat cooking surface or skillet with a light coat of olive oil spray.',
      'Season main ingredients thoroughly with cumin, paprika, garlic, and fresh herbs.',
      'Sauté or grill for 8-12 minutes until cooked to temperature.',
      'Assemble with grain or roasted vegetables and serve warm with a squeeze of fresh lemon.'
    ];

    return {
      id: mealId,
      name: parsed.name,
      name_ar: parsed.name_ar || parsed.name,
      rpg_title: parsed.rpg_title || `${parsed.name} Platter`,
      description: parsed.description || 'Nutrient-dense culinary masterpiece.',
      calories: Number(parsed.calories) || mealCalories,
      protein_g: Number(parsed.protein ?? parsed.protein_g ?? 30),
      carbs_g: Number(parsed.carbs ?? parsed.carbs_g ?? 40),
      fats_g: Number(parsed.fats ?? parsed.fats_g ?? 12),
      prep_time_mins: Number(parsed.prep_time_mins) || 12,
      cook_time_mins: Number(parsed.cook_time_mins) || 18,
      ingredients: Array.isArray(parsed.ingredients) && parsed.ingredients.length > 0
        ? parsed.ingredients
        : ['Lean Protein', 'Complex Carbs', 'Fresh Green Salad'],
      recipe_steps: Array.isArray(parsed.recipe_steps) && parsed.recipe_steps.length > 0
        ? parsed.recipe_steps
        : defaultSteps,
      cooking_tip: parsed.cooking_tip || parsed.description || 'Prepare with fresh spices for optimal thermogenesis.'
    };
  } catch (err) {
    console.warn('[AI Diet Service] Live AI meal reroll error:', err.message);
    throw err;
  }
};

/**
 * Interactive Live AI Dietitian Chat with user biometric context & cascading model retry
 */
export const chatWithDietitian = async ({ message, chatHistory = [], userContext = {} }) => {
  const {
    name = 'Adventurer',
    user_goal = 'weight_loss',
    diet_type = 'Balanced',
    metrics = {},
    favorite_cuisines = ['Egyptian', 'Mediterranean'],
    disliked_foods = [],
    stats = {}
  } = userContext;

  const targetCals = metrics.caloric_target || 1850;
  const targetProtein = metrics.protein_g || 140;
  const targetCarbs = metrics.carbs_g || 180;
  const targetFats = metrics.fats_g || 60;
  const dislikesStr = disliked_foods.filter(d => d !== 'None').join(', ') || 'None';
  const cuisinesStr = favorite_cuisines.join(', ') || 'Egyptian, Mediterranean';

  const systemContext = `You are Dr. Alexandria, an enthusiastic, world-class AI Sports Dietitian and RPG Nutrition Coach in Diet Quest RPG.
You talk directly to user "${name}".
USER BIOMETRICS & RPG PROFILE:
- Fitness Archetype / Goal: ${user_goal.replace('_', ' ')}
- Daily Calorie Target: ${targetCals} kcal
- Daily Macros Target: ${targetProtein}g Protein | ${targetCarbs}g Carbs | ${targetFats}g Fats
- Dietary Preference: ${diet_type}
- Favorite Cuisines: ${cuisinesStr} (You have deep expertise in Egyptian dishes like healthy Koshary, grilled Kofta, Shorbat Ads, Foul, Hawawshi, Molokhia, as well as Mediterranean and global cuisines)
- Strictly Excluded / Allergens: ${dislikesStr}
- Level: ${stats.level || 1} (HP: ${stats.hp_current || 100}/100, Streak: ${stats.streak_count || 0} days)

GUIDELINES:
1. Provide practical, appetizing, accurate nutritional guidance with specific calorie & macro approximations.
2. Honor their cuisine preferences (especially authentic Egyptian & Mediterranean options when relevant) and NEVER recommend excluded allergens (${dislikesStr}).
3. Keep your tone encouraging, energizing, game-like yet medically sound and practical.
4. Format using clean markdown (bold keywords, bullet points, numbered recipe steps where helpful).`;

  let prompt = `${systemContext}\n\n`;

  if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    prompt += `PREVIOUS CONVERSATION HISTORY:\n`;
    for (const h of chatHistory.slice(-6)) {
      prompt += `${h.role === 'user' ? 'Adventurer' : 'Dr. Alexandria'}: ${h.text || h.content}\n`;
    }
    prompt += `\n`;
  }

  prompt += `CURRENT USER QUERY:\nAdventurer: "${message}"\n\nDr. Alexandria's Expert Guidance:`;

  try {
    const replyText = await callAIWithFallback(prompt, {
      isJson: false,
      maxOutputTokens: 1000
    });

    return {
      reply: replyText,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error('[aiDietService.chatWithDietitian] Model cascade failed:', err.message);

    // Intelligent context-aware nutritionist fallback in case all external APIs spike
    let fallbackAdvice = `Hello ${name}! I'm right here with your **${targetCals} kcal** target in mind.\n\n`;
    const lower = message.toLowerCase();

    if (lower.includes('drink') || lower.includes('water') || lower.includes('beverage') || lower.includes('tea') || lower.includes('thirst')) {
      fallbackAdvice += `Here are my top healthy hydrating beverage recommendations:\n\n` +
        `1. **Egyptian Karkadeh (Hibiscus Iced Infusion)**: Steep dried hibiscus flowers, chill with ice and fresh mint leaves. Naturally calorie-free (~5 kcal) and loaded with antioxidants!\n` +
        `2. **Citrus Electrolyte Water**: 500 mL cold water + juice of 1/2 fresh lemon + a tiny pinch of Himalayan pink salt. Absorbs rapidly into cells.\n` +
        `3. **Spiced Cinnamon Mint Green Tea**: Boosts metabolic thermogenesis with zero sugar (~0 kcal).\n` +
        `4. **Sparkling Water with Crushed Berries**: Gives the crisp fizz of soda without added sugars.\n\n` +
        `💧 Remember: Drink one cup now to conquer your daily water intake quest!`;
    } else if (lower.includes('koshary') || lower.includes('egypt') || lower.includes('egyptian')) {
      fallbackAdvice += `For an authentic, healthy Egyptian meal:\n\n` +
        `• **Champion's Brown Lentil Koshary**: Use 1 cup brown lentils (high protein & fiber), 1/2 cup brown rice, topped with spiced tomato garlic dakka and air-fried crispy onions. (~480 kcal, 24g Protein).\n` +
        `• Pair with a fresh baladi cucumber and tomato salad dressed with cumin and lemon juice!`;
    } else {
      fallbackAdvice += `For your **${user_goal.replace('_', ' ')}** goal, prioritize lean proteins (25-35g per meal) and fiber-rich slow carbs.\n\n` +
        `• **Quick Power Idea**: Grilled spiced poultry or fish skewers with cumin roasted sweet potatoes and a crisp tahini salad (~450 kcal).\n` +
        `• Keep hydrating and hit your steps to keep your HP bar at 100%!`;
    }

    return {
      reply: fallbackAdvice,
      timestamp: new Date().toISOString()
    };
  }
};

export default {
  callAIWithFallback,
  callAIModel,
  generateMealWithAI,
  chatWithDietitian
};
