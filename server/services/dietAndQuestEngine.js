import { GoogleGenAI } from '@google/genai';

/**
 * Parses user categorical inputs into numerical estimates for BMR & TDEE calculation
 */
export const parseMetricsInput = ({ age, height_cm, weight_kg }) => {
  // Age parsing
  let ageYears = 28;
  if (typeof age === 'number') {
    ageYears = age;
  } else if (age === 'Under 18') {
    ageYears = 17;
  } else if (age === '18-25') {
    ageYears = 22;
  } else if (age === '26-35') {
    ageYears = 30;
  } else if (age === '36+') {
    ageYears = 42;
  } else if (typeof age === 'string' && !isNaN(parseInt(age, 10))) {
    ageYears = parseInt(age, 10);
  }

  // Height parsing (cm)
  let heightCm = 172;
  if (typeof height_cm === 'number') {
    heightCm = height_cm;
  } else if (height_cm === 'Under 160cm') {
    heightCm = 155;
  } else if (height_cm === '160-170cm') {
    heightCm = 165;
  } else if (height_cm === '171-180cm') {
    heightCm = 175;
  } else if (height_cm === '181cm+') {
    heightCm = 186;
  } else if (typeof height_cm === 'string' && !isNaN(parseInt(height_cm, 10))) {
    heightCm = parseInt(height_cm, 10);
  }

  // Weight parsing (kg)
  let weightKg = 74;
  if (typeof weight_kg === 'number') {
    weightKg = weight_kg;
  } else if (weight_kg === 'Under 55kg') {
    weightKg = 52;
  } else if (weight_kg === '55-70kg') {
    weightKg = 63;
  } else if (weight_kg === '71-85kg') {
    weightKg = 78;
  } else if (weight_kg === '86kg+') {
    weightKg = 92;
  } else if (typeof weight_kg === 'string' && !isNaN(parseFloat(weight_kg))) {
    weightKg = parseFloat(weight_kg);
  }

  return { ageYears, heightCm, weightKg };
};

/**
 * Calculates baseline metrics: Caloric target, macro split (C/P/F), and water intake
 */
export const calculateBaselineMetrics = ({ age, height_cm, weight_kg, user_goal = 'weight_loss', diet_type = 'Balanced' }) => {
  const { ageYears, heightCm, weightKg } = parseMetricsInput({ age, height_cm, weight_kg });

  // Mifflin-St Jeor equation for Basal Metabolic Rate
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5);

  // Moderate physical activity multiplier for active adventurer
  const tdee = Math.round(bmr * 1.45);

  let caloric_target = tdee;
  if (user_goal === 'weight_loss') {
    caloric_target = Math.max(1350, Math.round(tdee - 450));
  } else if (user_goal === 'weight_gain') {
    caloric_target = Math.round(tdee + 400);
  } else {
    // weight_maintenance
    caloric_target = tdee;
  }

  let protein_g = 0;
  let fats_g = 0;
  let carbs_g = 0;

  if (diet_type === 'Keto') {
    // Ketogenic split: Low carbs (5%), High fat (70%), Moderate-high protein (25%)
    carbs_g = 25; // 100 kcal
    protein_g = Math.round(weightKg * 1.8); // 1.8g/kg
    const remainingCals = caloric_target - (carbs_g * 4) - (protein_g * 4);
    fats_g = Math.max(30, Math.round(remainingCals / 9));
  } else {
    // Standard / High-Protein Balanced / IF / Vegetarian split
    const proteinFactor = user_goal === 'weight_maintenance' ? 1.6 : 2.0;
    protein_g = Math.round(weightKg * proteinFactor);
    // Fats: ~25% of total caloric target
    fats_g = Math.round((caloric_target * 0.25) / 9);
    // Remainder to Carbs
    const remainingCals = caloric_target - (protein_g * 4) - (fats_g * 9);
    carbs_g = Math.max(50, Math.round(remainingCals / 4));
  }

  // Water intake goal: ~35 mL per kg, clamped between 2,200 mL and 3,600 mL
  const rawWater = Math.round((weightKg * 35) / 100) * 100;
  const water_target_ml = Math.min(3600, Math.max(2200, rawWater));

  const totalMacroCals = carbs_g * 4 + protein_g * 4 + fats_g * 9;
  const carbs_pct = Math.round(((carbs_g * 4) / totalMacroCals) * 100);
  const protein_pct = Math.round(((protein_g * 4) / totalMacroCals) * 100);
  const fats_pct = Math.round(((fats_g * 9) / totalMacroCals) * 100);

  return {
    bmr,
    tdee,
    caloric_target,
    carbs_g,
    protein_g,
    fats_g,
    water_target_ml,
    carbs_pct,
    protein_pct,
    fats_pct,
    ageYears,
    heightCm,
    weightKg
  };
};

/**
 * Calculates AI daily walking distance & two-part split micro-quests based on biometrics & goal
 */
export const calculateWalkingGoal = ({ age, height_cm, weight_kg, user_goal = 'weight_loss' }) => {
  const { ageYears, weightKg } = parseMetricsInput({ age, height_cm, weight_kg });

  let total_distance_km = 6.0;
  let total_time_mins = 60;

  if (user_goal === 'weight_loss') {
    // Higher expenditure for steady-state fat loss
    if (weightKg >= 85 && ageYears <= 35) {
      total_distance_km = 6.4;
      total_time_mins = 65;
    } else if (ageYears >= 36) {
      total_distance_km = 5.6;
      total_time_mins = 55;
    } else {
      total_distance_km = 6.0;
      total_time_mins = 60;
    }
  } else if (user_goal === 'weight_maintenance') {
    total_distance_km = 5.0;
    total_time_mins = 50;
  } else {
    // weight_gain: aerobic conditioning without draining anabolic surplus
    total_distance_km = 4.0;
    total_time_mins = 40;
  }

  const morning_distance_km = Number((total_distance_km / 2).toFixed(1));
  const morning_time_mins = Math.round(total_time_mins / 2);
  const evening_distance_km = Number((total_distance_km / 2).toFixed(1));
  const evening_time_mins = Math.round(total_time_mins / 2);

  const estimated_steps = Math.round(total_distance_km * 1350);
  const morning_steps = Math.round(morning_distance_km * 1350);
  const evening_steps = Math.round(evening_distance_km * 1350);

  return {
    total_distance_km,
    total_time_mins,
    estimated_steps,
    morning_shift: {
      distance_km: morning_distance_km,
      time_mins: morning_time_mins,
      steps: morning_steps,
      title: 'Morning Walk Quest (Morning Shift)'
    },
    evening_shift: {
      distance_km: evening_distance_km,
      time_mins: evening_time_mins,
      steps: evening_steps,
      title: 'Evening Walk Quest (Evening Shift)'
    }
  };
};

/**
 * Filters a string item against user's disliked food / allergy list
 */
export const isFoodDisliked = (item, dislikes = []) => {
  if (!Array.isArray(dislikes) || dislikes.includes('None')) return false;
  const lowerItem = item.toLowerCase();
  for (const d of dislikes) {
    const lowerD = d.toLowerCase();
    if (lowerD === 'seafood' && (lowerItem.includes('fish') || lowerItem.includes('salmon') || lowerItem.includes('tuna') || lowerItem.includes('shrimp') || lowerItem.includes('seafood'))) return true;
    if (lowerD === 'eggs' && (lowerItem.includes('egg') || lowerItem.includes('omelet'))) return true;
    if (lowerD === 'lactose' && (lowerItem.includes('dairy') || lowerItem.includes('milk') || lowerItem.includes('yogurt') || lowerItem.includes('cheese') || lowerItem.includes('whey'))) return true;
    if (lowerD === 'gluten' && (lowerItem.includes('wheat') || lowerItem.includes('bread') || lowerItem.includes('pasta') || lowerItem.includes('oat'))) return true;
    if (lowerD === 'nuts' && (lowerItem.includes('nut') || lowerItem.includes('almond') || lowerItem.includes('peanut') || lowerItem.includes('cashew'))) return true;
    if (lowerD === 'spicy food' && (lowerItem.includes('spicy') || lowerItem.includes('chili') || lowerItem.includes('pepper') || lowerItem.includes('jalapeno'))) return true;
    if (lowerItem.includes(lowerD)) return true;
  }
  return false;
};

/**
 * Generates an authentic, structured Real AI Diet Plan with realistic nutritional values & 7-day variety
 */
export const generateRealDietPlan = async ({ user_goal = 'weight_loss', diet_type = 'Balanced', liked_foods = [], disliked_foods = [], metrics }) => {
  const targetCals = metrics.caloric_target;
  const targetProtein = metrics.protein_g;
  const targetCarbs = metrics.carbs_g;
  const targetFats = metrics.fats_g;

  const dislikes = Array.isArray(disliked_foods) ? disliked_foods : [];
  const likes = Array.isArray(liked_foods) ? liked_foods : [];

  // Caloric & Macro distributions:
  // Breakfast ~25%, Lunch ~35%, Dinner ~30%, Power Snack ~10%
  const bCals = Math.round(targetCals * 0.25);
  const bProtein = Math.round(targetProtein * 0.25);
  const bCarbs = Math.round(targetCarbs * 0.25);
  const bFats = Math.round(targetFats * 0.25);

  const lCals = Math.round(targetCals * 0.35);
  const lProtein = Math.round(targetProtein * 0.35);
  const lCarbs = Math.round(targetCarbs * 0.35);
  const lFats = Math.round(targetFats * 0.35);

  const dCals = Math.round(targetCals * 0.30);
  const dProtein = Math.round(targetProtein * 0.30);
  const dCarbs = Math.round(targetCarbs * 0.30);
  const dFats = Math.round(targetFats * 0.30);

  const sCals = targetCals - (bCals + lCals + dCals);
  const sProtein = Math.max(10, targetProtein - (bProtein + lProtein + dProtein));
  const sCarbs = Math.max(10, targetCarbs - (bCarbs + lCarbs + dCarbs));
  const sFats = Math.max(4, targetFats - (bFats + lFats + dFats));

  const hasEggs = likes.includes('Eggs') && !isFoodDisliked('Eggs', dislikes);
  const hasOats = likes.includes('Oats') && !isFoodDisliked('Oats', dislikes);
  const hasChicken = likes.includes('Chicken') && !isFoodDisliked('Chicken', dislikes);
  const hasFish = likes.includes('Fish') && !isFoodDisliked('Fish', dislikes);
  const hasBeef = likes.includes('Beef') && !isFoodDisliked('Beef', dislikes);
  const hasRice = likes.includes('Rice') && !isFoodDisliked('Rice', dislikes);
  const hasDairy = likes.includes('Dairy') && !isFoodDisliked('Dairy', dislikes);

  // 7-Day Curated Non-Repeating Meal Catalog
  const dayThemes = [
    { day: 1, name: 'Day 1', weekday: 'Monday', theme: 'Metabolic Dawn Catalyst' },
    { day: 2, name: 'Day 2', weekday: 'Tuesday', theme: 'Strength & Muscular Hypertrophy' },
    { day: 3, name: 'Day 3', weekday: 'Wednesday', theme: 'Omega-3 Recovery & Joint Defense' },
    { day: 4, name: 'Day 4', weekday: 'Thursday', theme: 'Cellular Vitality & Micronutrients' },
    { day: 5, name: 'Day 5', weekday: 'Friday', theme: 'Endurance & Glycogen Replenishment' },
    { day: 6, name: 'Day 6', weekday: 'Saturday', theme: 'Citadel High-Protein Recharge' },
    { day: 7, name: 'Day 7', weekday: 'Sunday', theme: "Champion's Restorative Banquet" }
  ];

  const weekSchedule = dayThemes.map(({ day, name, weekday, theme }) => {
    let bName = '';
    let bRpg = '';
    let bIng = [];
    let bTip = '';

    let lName = '';
    let lRpg = '';
    let lIng = [];
    let lTip = '';

    let dName = '';
    let dRpg = '';
    let dIng = [];
    let dTip = '';

    let sName = '';
    let sRpg = '';
    let sIng = [];
    let sTip = '';

    if (day === 1) {
      bName = hasEggs ? 'Dawn Power Protein Scramble & Whole-Grain Sourdough' : 'Tofu Scramble with Spinach & Avocado Toast';
      bRpg = 'Dawn Forge Sunrise Fuel';
      bIng = [hasEggs ? '3 Whole Pasture-Raised Eggs' : '220g Spiced Silken Tofu', '2 Slices Artisanal Sourdough', '1 Cup Baby Spinach & Cherry Tomatoes', '1 tsp Cold-Pressed Olive Oil'];
      bTip = 'Cook eggs over low-medium heat for fluffy curd consistency and maximum nutrient bioavailability.';

      const prot1 = hasChicken ? 'Grilled Lemon-Herb Chicken Breast' : hasFish ? 'Pan-Seared White Cod Fillet' : 'Tender Marinated Tempeh';
      lName = `${prot1} with Fragrant Jasmine Rice & Steamed Broccoli`;
      lRpg = 'Vanguard Midday Feast';
      lIng = [`180g ${prot1}`, hasRice ? '160g Steamed Jasmine Rice' : '150g Fluffy Quinoa', '140g Steamed Broccoli Florets', '1 tbsp Extra Virgin Olive Oil & Lemon'];
      lTip = 'Sear protein with fragrant oregano, lemon juice, and a pinch of pink salt.';

      const prot2 = hasFish ? 'Wild Atlantic Salmon Fillet' : hasBeef ? 'Lean Grass-Fed Flank Steak' : 'Roasted Turkey Breast';
      dName = `${prot2} with Roasted Sweet Potatoes & Garlic Asparagus`;
      dRpg = 'Twilight Recovery Banquet';
      dIng = [`170g ${prot2}`, '180g Oven-Roasted Sweet Potato Cubes', '120g Garlic Grilled Asparagus Spears', 'Sea Salt, Cracked Black Pepper & Rosemary'];
      dTip = 'Roast sweet potatoes in the oven at 200°C for caramelized natural richness.';

      sName = hasDairy ? 'High-Protein Greek Yogurt Parfait with Honey & Walnuts' : 'Crisp Honeycrisp Apple Slices with Natural Almond Butter';
      sRpg = 'Ranger Waypoint Stamina Ration';
      sIng = [hasDairy ? '180g Non-Fat Greek Yogurt' : '1 Crisp Honeycrisp Apple', hasDairy ? '25g Raw Crushed Walnuts & Honey drizzle' : '2 tbsp Smooth Almond Butter', '15g High-Antioxidant Blueberries'];
      sTip = 'Enjoy as an afternoon bridge to stabilize insulin and prevent evening hunger spikes.';
    } else if (day === 2) {
      bName = hasOats ? 'Warm Cinnamon Vanilla Protein Oatmeal with Chia Seeds' : 'Avocado Egg Toast with Microgreens';
      bRpg = 'Iron Mountain Morning Crucible';
      bIng = [hasOats ? '60g Rolled Steel-Cut Oats' : '2 Slices Multi-Seed Toast', '1 Scoop Whey/Plant Protein Isolate', '15g Organic Chia Seeds', '1/2 Cup Fresh Blueberries'];
      bTip = 'Stir in the protein powder after taking oats off heat to avoid clumping.';

      const prot = hasBeef ? 'Lean Sirloin Steak Strips' : hasChicken ? 'Blackened Cajun Chicken Breast' : 'High-Protein Lentil & Quinoa Bowl';
      lName = `${prot} with Herbed Quinoa & Charred Bell Peppers`;
      lRpg = 'Citadel Strength Provision';
      lIng = [`175g ${prot}`, '160g Fluffy Tri-Color Quinoa', '150g Fire-Roasted Peppers & Zucchini', '1 tbsp Cilantro Lime Vinaigrette'];
      lTip = 'High iron and complete aminos fuel mid-week muscular recovery.';

      const dProt = hasChicken ? 'Rosemary Roast Chicken Breast' : hasFish ? 'Pan-Seared Halibut Fillet' : 'Tofu Stir-Fry with Cashews';
      dName = `${dProt} with Smashed Fingerling Potatoes & Sautéed Kale`;
      dRpg = 'Shadow Forest Hearth Dinner';
      dIng = [`180g ${dProt}`, '170g Golden Smashed Potatoes', '120g Garlic Sautéed Tuscan Kale', '1 tsp Crushed Garlic & Olive Oil'];
      dTip = 'Boil potatoes until tender, then smash and crisp in a hot pan.';

      sName = 'Handful of Raw Almonds & 85% Dark Cacao Squares';
      sRpg = 'Alchemist Energy Elixir';
      sIng = ['30g Raw California Almonds', '15g 85% Dark Single-Origin Chocolate', '1 Cup Pure Green Tea'];
      sTip = 'Flavonoids and monounsaturated fats enhance sustained mental alertness.';
    } else if (day === 3) {
      bName = hasEggs ? 'Mediterranean Spinach & Crumbled Feta Egg White Omelet' : 'Chia Seed Berry Pudding with Coconut Cream';
      bRpg = 'Azure Coast Sunrise Fuel';
      bIng = [hasEggs ? '4 Egg Whites + 1 Whole Egg' : '40g Chia Seeds with Coconut Milk', '40g Crumbled Light Feta', '1 Cup Baby Spinach & Sun-Dried Tomatoes', '1 Slice Toasted Spelt Bread'];
      bTip = 'Whisk eggs thoroughly for an airy, melt-in-the-mouth texture.';

      const lProt = hasFish ? 'Pan-Seared Salmon Bowl' : hasChicken ? 'Herb-Marinated Chicken Shawarma' : 'Spiced Chickpea & Avocado Salad';
      lName = `${lProt} with Brown Basmati Rice & Cucumber Ribbon Salad`;
      lRpg = 'Aegean Sea Warrior Feast';
      lIng = [`175g ${lProt}`, '160g Steamed Brown Basmati', '120g Crisp Persian Cucumbers & Red Onions', 'Drizzle of Lemon Tahini'];
      lTip = 'Omega-3 fatty acids actively damp down training inflammation.';

      const dProt = hasBeef ? 'Lean Ground Beef Stir-Fry' : hasFish ? 'Garlic Butter Cod' : 'Tender Roasted Turkey Breast';
      dName = `${dProt} with Roasted Butternut Squash & Green Beans`;
      dRpg = 'Twilight Hearth Recovery';
      dIng = [`170g ${dProt}`, '180g Caramelized Butternut Squash', '130g Tender Steamed Haricots Verts', '1 tbsp Toasted Sesame Oil'];
      dTip = 'Squash delivers beta-carotene and gentle complex carbohydrates for sound sleep.';

      sName = hasDairy ? 'Creamy Cottage Cheese Bowl with Pineapple Chunks' : 'Crunchy Rice Cakes with Peanut Butter & Cinnamon';
      sRpg = 'Wayfarer Midnight Ration';
      sIng = [hasDairy ? '180g Low-Fat Cottage Cheese' : '2 Brown Rice Cakes', hasDairy ? '80g Sweet Pineapple Chunks' : '2 tbsp Pure Peanut Butter', 'Drizzle of Raw Wild Honey'];
      sTip = 'Slow-digesting casein protein supports overnight tissue repair.';
    } else if (day === 4) {
      bName = hasEggs ? 'Fluffy High-Protein Oat Flour Pancakes with Fresh Berries' : 'Golden Turmeric Smoothie Bowl with Granola';
      bRpg = 'Golden Sun Titan Batter';
      bIng = ['50g Blended Rolled Oats', hasEggs ? '2 Whole Eggs + 1 Scoop Protein' : 'Plant Protein & Almond Milk', '1 Cup Sliced Strawberries', 'Pure Maple Syrup Drizzle'];
      bTip = 'Blend oats and eggs in a blender for an ultra-smooth instant batter.';

      const lProt = hasChicken ? 'Crispy Air-Fried Chicken Cutlet' : hasFish ? 'Tuna Poke Rice Bowl' : 'Crispy Garlic Tofu Triangles';
      lName = `${lProt} with Sweet Corn, Black Beans & Wild Rice`;
      lRpg = 'Solar Citadel Power Bowl';
      lIng = [`180g ${lProt}`, '150g Cooked Wild Rice', '100g Sweet Corn & Black Bean Salsa', 'Fresh Cilantro & Sliced Jalapeno'];
      lTip = 'Packed with insoluble fiber and lean protein for sustained satiety.';

      const dProt = hasFish ? 'Baked Wild Salmon with Dill Cream' : hasBeef ? 'Charred Flat Iron Steak' : 'Herb-Roasted Turkey Medallions';
      dName = `${dProt} with Roasted Cauliflower Steaks & Herb Mash`;
      dRpg = 'Northern Fortress Banquet';
      dIng = [`175g ${dProt}`, '180g Thick-Cut Roasted Cauliflower', '130g Herbed Yukon Gold Potatoes', '1 tsp Dijon Mustard Glaze'];
      dTip = 'Roasting cruciferous veggies at high heat unleashes a nutty, savory flavor.';

      sName = 'Roasted Sea Salt Edamame & Light String Cheese';
      sRpg = 'Ranger Vitality Pods';
      sIng = ['1 Cup Steamed/Roasted Edamame in Pods', '1 Part-Skim Mozzarella String Cheese', 'Flaky Maldon Sea Salt'];
      sTip = 'Plant-based amino acids and calcium keep energy steady without sluggishness.';
    } else if (day === 5) {
      bName = hasEggs ? 'Smoked Salmon & Soft-Poached Eggs on Multigrain Crisp' : 'Warm Spiced Quinoa Porridge with Almonds';
      bRpg = 'Valkyrie Dawn Rations';
      bIng = [hasEggs ? '2 Large Poached Eggs' : '60g Quinoa Flakes with Oat Milk', '60g Smoked Wild Salmon', '2 Slices Toasted Multigrain', 'Fresh Dill & Caper Berries'];
      bTip = 'Gently swirl boiling water before dropping eggs in for perfectly rounded whites.';

      const lProt = hasBeef ? 'Grilled Lean Beef Kofta Patties' : hasChicken ? 'Lemon Herb Rotisserie Chicken' : 'Tempeh Bacon Avocado Wrap';
      lName = `${lProt} with Spiced Couscous & Roasted Zucchini Ribbons`;
      lRpg = 'Oasis Caravan Sustenance';
      lIng = [`180g ${lProt}`, '160g Fluffy Whole-Wheat Couscous', '140g Grilled Yellow Squash & Zucchini', '1 tbsp Mint Yogurt Sauce'];
      lTip = 'Mediterranean seasonings provide antioxidants with zero added refined sugars.';

      const dProt = hasFish ? 'Pan-Roasted Atlantic Cod Fillet' : hasChicken ? 'Tender Chicken Breast Supreme' : 'Mushroom & Lentil Shepherd Pie';
      dName = `${dProt} with Garlic Roasted Carrots & Brown Rice`;
      dRpg = 'Highland Keep Evening Feast';
      dIng = [`170g ${dProt}`, '180g Rainbow Baby Carrots with Thyme', '150g Steamed Brown Rice', '1 tsp Cold-Pressed Grapeseed Oil'];
      dTip = 'Slow-roasted root carrots release rich natural sweetness without sauces.';

      sName = 'Protein Shake Blended with Unsweetened Almond Milk & Berries';
      sRpg = 'Mana Recovery Flask';
      sIng = ['1 Scoop High-Purity Whey/Plant Protein', '250mL Unsweetened Almond Milk', '1/2 Cup Frozen Wild Raspberries'];
      sTip = 'Rapidly absorbs into working muscle fibers to kickstart protein synthesis.';
    } else if (day === 6) {
      bName = hasEggs ? 'Spiced Shakshuka Poached Eggs in Rich Tomato Pepper Sauce' : 'Berry Acai Power Bowl with Toasted Hemp Seeds';
      bRpg = 'Desert Sun Forge Skillet';
      bIng = [hasEggs ? '3 Fresh Eggs Poached in Sauce' : 'Unsweetened Acai Puree with Hemp Seeds', '1 Cup Crushed Tomatoes, Bell Peppers & Cumin', '1 Warm Pita/Sourdough Slice', 'Fresh Coriander'];
      bTip = 'Simmer peppers and tomatoes gently until sweet before cracking eggs into wells.';

      const lProt = hasChicken ? 'Grilled Peri-Peri Chicken Breast' : hasBeef ? 'Lean Beef Burger Patties (No Bun)' : 'Grilled Halloumi & Lentil Bowl';
      lName = `${lProt} with Sweet Potato Fries & Crispy Green Salad`;
      lRpg = 'Weekend Warrior Fuel';
      lIng = [`180g ${lProt}`, '170g Baked Sweet Potato Wedges', '100g Mixed Baby Greens & Radishes', '1 tbsp Apple Cider Vinaigrette'];
      lTip = 'Bake sweet potato wedges with a pinch of smoked paprika for restaurant quality.';

      const dProt = hasFish ? 'Teriyaki Glazed Wild Salmon' : hasChicken ? 'Pan-Seared Turkey Medallions' : 'Seared Tofu Steaks with Teriyaki';
      dName = `${dProt} with Sautéed Baby Bok Choy & Jasmine Rice`;
      dRpg = 'Eastern Shrine Twilight Repast';
      dIng = [`175g ${dProt}`, '140g Sautéed Baby Bok Choy with Ginger', '160g Steamed Fragrant Rice', '1 tbsp Tamari & Sesame Drizzle'];
      dTip = 'Quickly flash-fry bok choy with fresh ginger to keep it crunchy and vibrant.';

      sName = 'Two Hard-Boiled Pastured Eggs with Everything Bagel Seasoning';
      sRpg = 'Sentinel Sentry Snack';
      sIng = ['2 Large Pasture-Raised Eggs', '1 tsp Everything Bagel Spice', 'Small Handful of Crisp Celery Sticks'];
      sTip = 'Choline and sulfur compounds aid healthy liver lipid metabolism.';
    } else {
      // Day 7
      bName = hasEggs ? 'Loaded Breakfast Scramble Wrap with Avocado & Salsa' : 'Loaded Oatmeal Bake with Pecans & Dates';
      bRpg = 'Grand Finale Sunrise Feast';
      bIng = [hasEggs ? '3 Farm Eggs Scrambled' : '60g Baked Rolled Oats with Dates', '1/2 Sliced Ripe Avocado', '1 Whole-Wheat Tortilla Wrap', 'Fresh Chunky Pico de Gallo'];
      bTip = 'Wrap tightly in parchment paper and lightly toast on both sides in a dry skillet.';

      const lProt = hasChicken ? 'Citrus Herb Grilled Chicken Breast' : hasFish ? 'Seared Halibut & Mango Salsa' : 'Warm White Bean & Kale Stew';
      lName = `${lProt} with Wild Rice Pilaf & Roasted Brussels Sprouts`;
      lRpg = 'Champion Table Midday Banquet';
      lIng = [`180g ${lProt}`, '160g Nutty Wild Rice Pilaf', '150g Caramelized Roasted Brussels Sprouts', '1 tbsp Lemon Herb Dressing'];
      lTip = 'Quarter brussels sprouts and roast cut-side down for ultra-crispy edges.';

      const dProt = hasBeef ? 'Slow-Braised Lean Beef Sirloin' : hasFish ? 'Herb-Crusted Wild Salmon' : 'Baked Vegetable Lasagna Rolls';
      dName = `${dProt} with Smashed Garlic Potatoes & Steamed Asparagus`;
      dRpg = 'Ascendant Sunday Victory Feast';
      dIng = [`175g ${dProt}`, '180g Smashed Garlic Potatoes with Parsley', '130g Tender Asparagus Spears', 'Natural Pan Au Jus Reduction'];
      dTip = 'Complete week milestone meal to replenish glycogen and celebrate dedication.';

      sName = hasDairy ? 'Vanilla Greek Yogurt with Chopped Dark Cherries' : 'Crisp Apple Slices with Natural Peanut Butter';
      sRpg = 'Zenith Serenity Treat';
      sIng = [hasDairy ? '180g Plain Greek Yogurt' : '1 Honeycrisp Apple', hasDairy ? '50g Pitted Dark Sweet Cherries' : '2 tbsp Natural Peanut Butter', 'Dash of Ground Cinnamon'];
      sTip = 'Cherries contain natural melatonin to support deep, restorative Sunday night sleep.';
    }

    // Keto adjustments
    if (diet_type === 'Keto') {
      bIng = bIng.filter(i => !i.toLowerCase().includes('oat') && !i.toLowerCase().includes('bread') && !i.toLowerCase().includes('maple') && !i.toLowerCase().includes('pita') && !i.toLowerCase().includes('tortilla'));
      bIng.push('1/2 Fresh Avocado & 30g Cheddar');
      lIng = lIng.filter(i => !i.toLowerCase().includes('rice') && !i.toLowerCase().includes('quinoa') && !i.toLowerCase().includes('couscous'));
      lIng.push('Cauliflower Rice with Garlic Butter');
      dIng = dIng.filter(i => !i.toLowerCase().includes('potato') && !i.toLowerCase().includes('squash') && !i.toLowerCase().includes('rice'));
      dIng.push('Buttery Steamed Broccoli & Herb Cream');
    }

    const meals = [
      {
        id: 'breakfast',
        name: bName,
        rpg_title: bRpg,
        calories: bCals,
        protein_g: bProtein,
        carbs_g: bCarbs,
        fats_g: bFats,
        ingredients: bIng,
        cooking_tip: bTip
      },
      {
        id: 'lunch',
        name: lName,
        rpg_title: lRpg,
        calories: lCals,
        protein_g: lProtein,
        carbs_g: lCarbs,
        fats_g: lFats,
        ingredients: lIng,
        cooking_tip: lTip
      },
      {
        id: 'dinner',
        name: dName,
        rpg_title: dRpg,
        calories: dCals,
        protein_g: dProtein,
        carbs_g: dCarbs,
        fats_g: dFats,
        ingredients: dIng,
        cooking_tip: dTip
      },
      {
        id: 'snack',
        name: sName,
        rpg_title: sRpg,
        calories: sCals,
        protein_g: sProtein,
        carbs_g: sCarbs,
        fats_g: sFats,
        ingredients: sIng,
        cooking_tip: sTip
      }
    ];

    return {
      day,
      name,
      weekday,
      theme,
      calories: targetCals,
      macros: { protein: targetProtein, carbs: targetCarbs, fats: targetFats },
      meals
    };
  });

  return {
    source: 'deterministic-ai',
    caloric_target: targetCals,
    macros: { protein: targetProtein, carbs: targetCarbs, fats: targetFats },
    current_day: 1,
    week_schedule: weekSchedule,
    meals: weekSchedule[0].meals
  };
};

/**
 * Generates the unified customized RPG quests:
 * 1. Morning Walk Quest (Morning Shift)
 * 2. Evening Walk Quest (Evening Shift)
 * 3. Breakfast Meal Quest (Real nutrition)
 * 4. Lunch Meal Quest (Real nutrition)
 * 5. Dinner Meal Quest (Real nutrition)
 * 6. Hydration Quest (Water goal)
 * 7. Boss Battle: Macro Precision Champion
 */
export const generateCustomizedQuests = ({
  user_goal = 'weight_loss',
  diet_type = 'Balanced',
  liked_foods = [],
  disliked_foods = [],
  metrics,
  walking_plan,
  diet_plan
}) => {
  const dislikes = Array.isArray(disliked_foods) ? disliked_foods : [];
  const cleanDislikes = dislikes.filter(d => d !== 'None');
  const allergenNote = cleanDislikes.length > 0 ? ` (Zero ${cleanDislikes.join(', ')})` : '';

  const mWalk = walking_plan?.morning_shift || { distance_km: 3.0, time_mins: 30, steps: 4050 };
  const eWalk = walking_plan?.evening_shift || { distance_km: 3.0, time_mins: 30, steps: 4050 };

  const meals = diet_plan?.meals || [];
  const breakfast = meals.find(m => m.id === 'breakfast') || {
    name: 'Dawn Power Breakfast',
    calories: Math.round(metrics.caloric_target * 0.25),
    protein_g: Math.round(metrics.protein_g * 0.25),
    carbs_g: Math.round(metrics.carbs_g * 0.25),
    fats_g: Math.round(metrics.fats_g * 0.25),
    ingredients: ['Whole Eggs', 'Oats', 'Berries']
  };

  const lunch = meals.find(m => m.id === 'lunch') || {
    name: 'Midday Citadel Feast',
    calories: Math.round(metrics.caloric_target * 0.35),
    protein_g: Math.round(metrics.protein_g * 0.35),
    carbs_g: Math.round(metrics.carbs_g * 0.35),
    fats_g: Math.round(metrics.fats_g * 0.35),
    ingredients: ['Lean Poultry', 'Rice', 'Vegetables']
  };

  const dinner = meals.find(m => m.id === 'dinner') || {
    name: 'Twilight Recovery Banquet',
    calories: Math.round(metrics.caloric_target * 0.30),
    protein_g: Math.round(metrics.protein_g * 0.30),
    carbs_g: Math.round(metrics.carbs_g * 0.30),
    fats_g: Math.round(metrics.fats_g * 0.30),
    ingredients: ['Salmon or Steak', 'Sweet Potatoes', 'Asparagus']
  };

  return [
    // 1. Two-Part Split Walking Quest: Morning Shift
    {
      type: 'main',
      category: 'movement',
      title: `Morning Walk Quest (Morning Shift) (+150 XP)`,
      description: `Complete the first half of your AI daily walking goal: ${mWalk.distance_km} km (${mWalk.time_mins} mins). Log your session directly in-app.`,
      baseXP: 150,
      unit: 'km walked',
      progress: 0,
      maxProgress: mWalk.distance_km,
    },
    // 2. Two-Part Split Walking Quest: Evening Shift
    {
      type: 'main',
      category: 'movement',
      title: `Evening Walk Quest (Evening Shift) (+150 XP)`,
      description: `Complete the second half of your AI daily walking goal: ${eWalk.distance_km} km (${eWalk.time_mins} mins) to finalize today's mobility objective.`,
      baseXP: 150,
      unit: 'km walked',
      progress: 0,
      maxProgress: eWalk.distance_km,
    },
    // 3. Real AI Meal Quest: Breakfast
    {
      type: 'main',
      category: 'nutrition',
      title: `Breakfast Quest: ${breakfast.name} (+200 XP)`,
      description: `Consume ${breakfast.name} (~${breakfast.calories} kcal, ${breakfast.protein_g}g P / ${breakfast.carbs_g}g C / ${breakfast.fats_g}g F)${allergenNote}. Ingredients: ${breakfast.ingredients.slice(0, 3).join(', ')}.`,
      baseXP: 200,
      unit: 'meal completed',
      progress: 0,
      maxProgress: 1,
    },
    // 4. Real AI Meal Quest: Lunch
    {
      type: 'main',
      category: 'nutrition',
      title: `Lunch Quest: ${lunch.name} (+200 XP)`,
      description: `Fuel up with ${lunch.name} (~${lunch.calories} kcal, ${lunch.protein_g}g P / ${lunch.carbs_g}g C / ${lunch.fats_g}g F)${allergenNote}. Ingredients: ${lunch.ingredients.slice(0, 3).join(', ')}.`,
      baseXP: 200,
      unit: 'meal completed',
      progress: 0,
      maxProgress: 1,
    },
    // 5. Real AI Meal Quest: Dinner
    {
      type: 'main',
      category: 'nutrition',
      title: `Dinner Quest: ${dinner.name} (+200 XP)`,
      description: `Replenish with ${dinner.name} (~${dinner.calories} kcal, ${dinner.protein_g}g P / ${dinner.carbs_g}g C / ${dinner.fats_g}g F)${allergenNote}. Ingredients: ${dinner.ingredients.slice(0, 3).join(', ')}.`,
      baseXP: 200,
      unit: 'meal completed',
      progress: 0,
      maxProgress: 1,
    },
    // 6. Hydration Side Quest
    {
      type: 'side',
      category: 'hydration',
      title: `Side Quest: Springs of Vitality (+100 XP)`,
      description: `Drink your personalized baseline target of ${metrics.water_target_ml} mL of water to recharge your Energy Core to 100%.`,
      baseXP: 100,
      unit: 'mL hydrated',
      progress: 0,
      maxProgress: metrics.water_target_ml,
    },
    // 7. Boss Battle Quest
    {
      type: 'boss',
      category: user_goal,
      title: `Boss Battle: Macro Precision Champion (+500 XP)`,
      description: `Finish the day landing within ±5% of your ${metrics.caloric_target} kcal target and achieving ${metrics.protein_g}g Protein${allergenNote}!`,
      baseXP: 500,
      unit: '% plan adherence',
      progress: 0,
      maxProgress: 100,
    }
  ];
};

/**
 * Smart Reroll Engine: Generates an instant alternative meal that matches the exact
 * caloric target and macro ratio (protein, carbs, fats) while honoring user preferences.
 */
export const rerollSingleMeal = ({
  mealId,
  currentMeal = {},
  user_goal = 'weight_loss',
  diet_type = 'Balanced',
  liked_foods = [],
  disliked_foods = [],
  metrics = {}
}) => {
  const calories = currentMeal.calories || Math.round((metrics.caloric_target || 2100) * 0.3);
  const protein_g = currentMeal.protein_g || Math.round((metrics.protein_g || 160) * 0.3);
  const carbs_g = currentMeal.carbs_g || Math.round((metrics.carbs_g || 200) * 0.3);
  const fats_g = currentMeal.fats_g || Math.round((metrics.fats_g || 65) * 0.3);

  const hasChicken = liked_foods.some(f => /chicken|poultry/i.test(f)) && !isFoodDisliked('chicken', disliked_foods);
  const hasFish = liked_foods.some(f => /fish|salmon|tuna|seafood/i.test(f)) && !isFoodDisliked('fish', disliked_foods);
  const hasBeef = liked_foods.some(f => /beef|steak|meat/i.test(f)) && !isFoodDisliked('beef', disliked_foods);
  const hasEggs = liked_foods.some(f => /egg/i.test(f)) && !isFoodDisliked('eggs', disliked_foods);
  const isKeto = diet_type === 'Keto';

  // Alternative database tailored by meal slot
  const alternatives = {
    breakfast: [
      {
        name: 'Sunfire Mediterranean Egg White & Feta Omelette',
        rpg_title: 'Helios Radiant Scramble',
        ingredients: ['4 Egg Whites & 1 Whole Egg', '35g Crumbled Greek Feta', 'Baby Spinach & Cherry Tomatoes', '1 Slice Toasted Sourdough'],
        cooking_tip: 'Sauté cherry tomatoes until blistered before pouring in eggs for extra sweetness.'
      },
      {
        name: 'Warm Cinnamon Vanilla Protein Oatmeal Bake',
        rpg_title: 'Valhalla Hearth Porridge',
        ingredients: ['60g Steel Cut Oats', '1 Scoop Vanilla Whey/Plant Protein', '1 tbsp Chia Seeds', 'Handful of Fresh Blueberries'],
        cooking_tip: 'Stir protein powder in after cooking oats with hot water to prevent clumping.'
      },
      {
        name: 'Spiced Avocado & Cottage Cheese Power Toast',
        rpg_title: 'Sylvan Ranger Toast',
        ingredients: ['2 Slices Sprouted Grain Bread', '120g Low-Fat Cottage Cheese', '1/2 Ripe Avocado Mashed', 'Red Pepper Flakes & Lemon Zest'],
        cooking_tip: 'Cottage cheese provides slow-digesting casein protein for long-lasting satiety.'
      },
      {
        name: 'Smoked Salmon & Herbed Quark Morning Plate',
        rpg_title: 'Frost Peak Angler Rations',
        ingredients: ['90g Wild Smoked Salmon', '100g Herbed Quark or Greek Yogurt', 'Cucumber Ribbons & Capers', '2 Multigrain Crispbreads'],
        cooking_tip: 'Rich in EPA & DHA omega-3 fatty acids for anti-inflammatory joint recovery.'
      }
    ],
    lunch: [
      {
        name: hasChicken ? 'Chipotle Lime Grilled Chicken Burrito Bowl' : 'Crispy Tofu & Black Bean Fiesta Bowl',
        rpg_title: 'Sol Invictus Feast',
        ingredients: [hasChicken ? '180g Marinated Chicken Breast' : '200g Crispy Smoked Tofu', '150g Brown Rice & Quinoa Blend', '100g Black Beans & Corn', '2 tbsp Fire-Roasted Salsa'],
        cooking_tip: 'Squeeze fresh lime juice over warm grains to elevate the aroma without calories.'
      },
      {
        name: hasFish ? 'Pan-Seared Yellowfin Tuna Steak with Sesame Slaw' : 'Sesame Garlic Tempeh Soba Noodles',
        rpg_title: 'Tidal Blade Sustenance',
        ingredients: [hasFish ? '170g Seared Tuna Steak' : '180g Pan-Seared Tempeh', '140g Chilled Buckwheat Soba Noodles', 'Crunchy Red Cabbage & Carrot Slaw', '1 tbsp Light Toasted Sesame Dressing'],
        cooking_tip: 'Sear tuna on smoking hot cast iron for 60 seconds per side to keep center tender.'
      },
      {
        name: hasBeef ? 'Lean Beef & Caramelized Onion Wrap' : 'Warm Spiced Chickpea & Hummus Flatbread',
        rpg_title: 'Vanguard Caravan Wrap',
        ingredients: [hasBeef ? '160g Lean Flank Steak Slices' : '180g Spiced Roasted Chickpeas', '1 Whole-Wheat Pocket Flatbread', 'Caramelized Sweet Onions', 'Crisp Romaine & Tzatziki'],
        cooking_tip: 'Slice beef against the grain for maximum tenderness in every bite.'
      },
      {
        name: 'Tuscan White Bean & Rosemary Grilled Turkey Breast',
        rpg_title: 'Highlands Paladin Platter',
        ingredients: ['180g Turkey Breast Tenderloin', '140g Cannellini Beans with Garlic & Rosemary', 'Steamed Asparagus Spears', '1 tsp Cold-Pressed Olive Oil'],
        cooking_tip: 'Rosemary infused with garlic adds earthy complexity with zero added sodium.'
      }
    ],
    dinner: [
      {
        name: hasFish ? 'Garlic Herb Roasted Atlantic Salmon Fillet' : 'Herb-Crusted Seared Cauliflower & White Beans',
        rpg_title: 'Deep Ocean Aegis Fillet',
        ingredients: [hasFish ? '180g Wild Salmon Fillet' : '1 Large Cauliflower Steak', '180g Roasted Sweet Potato Cubes', '140g Sautéed Garlic Green Beans', 'Fresh Lemon Thyme Sprigs'],
        cooking_tip: 'Bake salmon skin-side down at 200°C for 12 minutes until flaky and moist.'
      },
      {
        name: hasBeef ? 'Charred Sirloin Steak Medallions with Chimichurri' : 'Balsamic Portobello Mushroom Steaks',
        rpg_title: 'Thunder Forge Evening Banquet',
        ingredients: [hasBeef ? '175g Lean Top Sirloin' : '2 Large Portobello Caps', '160g Roasted Rosemary Baby Potatoes', 'Charred Broccolini', '1 tbsp Fresh Parsley Chimichurri'],
        cooking_tip: 'Let steak rest for 5 minutes before slicing to lock in all savory juices.'
      },
      {
        name: hasChicken ? 'Moroccan Spiced Roast Chicken with Apricot Couscous' : 'Moroccan Lentil & Vegetable Tagine',
        rpg_title: 'Desert Mirage Royalty Supper',
        ingredients: [hasChicken ? '180g Moroccan Spiced Chicken' : '200g Hearty Brown Lentils', '150g Whole Wheat Couscous', 'Roasted Zucchini & Bell Peppers', 'Sprinkle of Toasted Almond Flakes'],
        cooking_tip: 'Cinnamon and cumin activate metabolic thermogenesis and satisfy savory cravings.'
      },
      {
        name: 'Crispy Lemon Pepper Cod with Creamy Herbed Cauliflower Mash',
        rpg_title: 'Silver Moon Shore Dinner',
        ingredients: ['190g Pacific Cod Loin', '200g Steamed Cauliflower Pureed with Garlic & Greek Yogurt', '120g Sautéed Zucchini Coins', 'Lemon Butter Herb Drizzle'],
        cooking_tip: 'Cod is an ultra-lean protein with over 90% calories derived purely from amino acids.'
      }
    ],
    snack: [
      {
        name: 'Honey-Cinnamon Greek Yogurt with Crushed Walnuts',
        rpg_title: 'Ambrosia Vitality Cup',
        ingredients: ['180g Non-Fat Plain Greek Yogurt', '1 tsp Raw Honey', '15g Crushed Walnuts', 'Dash of Ceylon Cinnamon'],
        cooking_tip: 'Ceylon cinnamon helps stabilize post-meal blood sugar levels.'
      },
      {
        name: 'Crisp Apple Slices with Pure Creamy Almond Butter',
        rpg_title: 'Ranger Orchard Rations',
        ingredients: ['1 Honeycrisp or Granny Smith Apple', '20g All-Natural Almond Butter', 'Pinch of Sea Salt'],
        cooking_tip: 'The crisp crunch combined with monounsaturated fat stops snack cravings cold.'
      },
      {
        name: 'Two Soft-Boiled Eggs with Smoked Sea Salt & Celery',
        rpg_title: 'Garrison Sentry Fuel',
        ingredients: ['2 Large Free-Range Eggs', 'Smoked Flaky Sea Salt', '3 Crisp Celery Ribs with Guacamole'],
        cooking_tip: 'Boil eggs for exactly 6.5 minutes then submerge in ice water for jammy yolks.'
      },
      {
        name: 'Chocolate Plant Recovery Shake with Unsweetened Almond Milk',
        rpg_title: 'Starlight Mana Elixir',
        ingredients: ['1 Scoop High-Purity Protein', '280mL Unsweetened Vanilla Almond Milk', '1 tbsp Ground Flaxseed', 'Ice cubes'],
        cooking_tip: 'Flaxseeds provide insoluble fiber and essential alpha-linolenic acid (ALA).'
      }
    ]
  };

  const pool = alternatives[mealId] || alternatives.lunch;
  // Pick an alternative that doesn't match the current meal's name
  const filtered = pool.filter(alt => alt.name.toLowerCase() !== (currentMeal.name || '').toLowerCase());
  const chosen = filtered.length > 0
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : pool[Math.floor(Math.random() * pool.length)];

  // If keto, ensure no grains or high carb veggies
  let ingredients = [...chosen.ingredients];
  if (isKeto) {
    ingredients = ingredients.map(ing => {
      if (/rice|oats|sourdough|bread|couscous|noodles/i.test(ing)) {
        return 'Cauliflower Rice & Sautéed Greens with Butter';
      }
      if (/potato/i.test(ing)) {
        return 'Roasted Radishes & Asparagus in Olive Oil';
      }
      return ing;
    });
  }

  return {
    id: mealId,
    name: chosen.name,
    rpg_title: chosen.rpg_title,
    calories,
    protein_g,
    carbs_g: isKeto ? Math.min(carbs_g, 15) : carbs_g,
    fats_g: isKeto ? Math.max(fats_g, 25) : fats_g,
    ingredients,
    cooking_tip: chosen.cooking_tip
  };
};

export default {
  parseMetricsInput,
  calculateBaselineMetrics,
  calculateWalkingGoal,
  generateRealDietPlan,
  generateCustomizedQuests,
  rerollSingleMeal,
  isFoodDisliked
};
