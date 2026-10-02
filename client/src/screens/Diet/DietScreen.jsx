import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getDefaultDaySchedule } from '../../utils/mealRerollGenerator.js';
import sounds from '../../utils/soundEffects.js';
import {
  Utensils,
  Dices,
  CheckCircle2,
  Settings,
  Sparkles,
  Info,
  ChefHat,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DietScreen = ({ onOpenQuiz }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const {
    dayProgress,
    setDayProgress,
    claimMealHandler: globalClaimMealHandler,
    addCoins,
    resetDayProgress
  } = useUser();
  const {
    dietPlan,
    quests,
    stats,
    rerollMeal,
    claimMealReward,
    completeQuest,
    claimQuest,
    advanceToNextDay,
    finishDay,
    notify
  } = useGame();

  const currentActiveDay = user?.currentActiveDay || user?.campaign?.current_day || 1;
  const [selectedDay, setSelectedDay] = useState(currentActiveDay);
  const [rerollingMealId, setRerollingMealId] = useState(null);
  const [localMealsOverride, setLocalMealsOverride] = useState({});
  const [expandedMealIds, setExpandedMealIds] = useState({});
  const [isAdvancingDay, setIsAdvancingDay] = useState(false);

  // Sequential Day Unlocking Logic: Disable day selection tabs for future days
  const isDayLocked = (dayNumber) => dayNumber > currentActiveDay;

  // Keep selectedDay within unlocked range
  React.useEffect(() => {
    if (selectedDay > currentActiveDay) {
      setSelectedDay(currentActiveDay);
    }
  }, [currentActiveDay]);

  const toggleRecipe = (mealId) => {
    setExpandedMealIds((prev) => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  // Retrieve current day meals from diet plan or fallback generator
  const getDayMeals = () => {
    if (localMealsOverride[selectedDay]?.length) {
      return localMealsOverride[selectedDay];
    }
    if (dietPlan?.week_schedule && Array.isArray(dietPlan.week_schedule)) {
      const match = dietPlan.week_schedule.find((s) => s.day === Number(selectedDay));
      if (match?.meals?.length) return match.meals;
    }
    if (dietPlan?.[selectedDay]?.meals?.length) {
      return dietPlan[selectedDay].meals;
    }
    if (user?.diet_plan?.week_schedule && Array.isArray(user?.diet_plan?.week_schedule)) {
      const match = user.diet_plan.week_schedule.find((s) => s.day === Number(selectedDay));
      if (match?.meals?.length) return match.meals;
    }
    return getDefaultDaySchedule(selectedDay, isRTL).meals;
  };

  const activeMeals = getDayMeals();

  // Dynamic Calorie and Day Progress Synchronization
  const targetCalories = user?.metrics?.caloric_target || 1879;
  const claimedMealIds = [
    ...(dayProgress?.claimedMealIds || []),
    ...activeMeals.filter((m) => m.isClaimed || m.claimed).map((m) => m.id)
  ];
  const uniqueClaimedMealIds = Array.from(new Set(claimedMealIds));

  // Check if meals on current day are claimed
  const claimedCount = activeMeals.filter(
    (m) =>
      m.isClaimed ||
      m.claimed ||
      uniqueClaimedMealIds.includes(m.id) ||
      quests.some((q) => (q.relatedMealId === m.id || q.id === `quest_${m.id}`) && q.isClaimed)
  ).length || (selectedDay === currentActiveDay ? (dayProgress?.claimedCount || 0) : 0);

  const consumedCalories =
    activeMeals
      .filter((m) => m.isClaimed || m.claimed || uniqueClaimedMealIds.includes(m.id))
      .reduce((sum, m) => sum + (Number(m.calories) || Number(m.kcal) || 0), 0) ||
    (selectedDay === currentActiveDay ? (dayProgress?.consumedCalories || 0) : 0);

  const allMealsClaimed = activeMeals.length > 0 && claimedCount === activeMeals.length;

  const handleCompleteAndNextDay = async () => {
    if (isAdvancingDay) return;
    setIsAdvancingDay(true);
    try {
      sounds?.playLevelUp?.();
      const completedMealIds = activeMeals
        .filter((m) => m.isClaimed || m.claimed || uniqueClaimedMealIds.includes(m.id) || quests.some((q) => (q.relatedMealId === m.id || q.id === `quest_${m.id}`) && q.isClaimed))
        .map((m) => m.id);

      if (typeof advanceToNextDay === 'function') {
        await advanceToNextDay();
      } else if (typeof finishDay === 'function') {
        await finishDay(completedMealIds, `Completed Day ${currentActiveDay}`);
      }

      if (typeof resetDayProgress === 'function') {
        resetDayProgress();
      }

      const nextDayNum = Math.min(7, currentActiveDay + 1);
      setSelectedDay(nextDayNum);
      setLocalMealsOverride({});

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.error('[DietScreen] Next day error:', err);
      notify('Failed to advance day. Please try again.', 'danger');
    } finally {
      setIsAdvancingDay(false);
    }
  };

  // Macro Totals derived dynamically from active meals
  const totalCalories = activeMeals.reduce((acc, m) => acc + (Number(m.calories) || 0), 0) || 1792;
  const totalProtein = activeMeals.reduce((acc, m) => acc + (Number(m.protein_g) || 0), 0) || 132;
  const totalCarbs = activeMeals.reduce((acc, m) => acc + (Number(m.carbs_g) || 0), 0) || 204;
  const totalFats = activeMeals.reduce((acc, m) => acc + (Number(m.fats_g) || 0), 0) || 50;

  const handleRerollMeal = async (mealId) => {
    try {
      if (typeof sounds?.playEquipClick === 'function') {
        sounds.playEquipClick();
      } else if (typeof sounds?.playClick === 'function') {
        sounds.playClick();
      }
    } catch (e) {}

    setRerollingMealId(mealId);
    try {
      const res = await rerollMeal(selectedDay, mealId);
      if (res?.newMeal) {
        setLocalMealsOverride((prev) => {
          const currentMeals = prev[selectedDay] || getDayMeals();
          return {
            ...prev,
            [selectedDay]: currentMeals.map((m) => (m.id === mealId ? res.newMeal : m))
          };
        });
      }
    } catch (err) {
      console.warn('[DietScreen] Reroll fallback handled:', err);
    } finally {
      setRerollingMealId(null);
    }
  };

  const getMealQuest = (mealId) => {
    return quests.find(
      (q) =>
        q.relatedMealId === mealId ||
        q.id === `quest_${mealId}` ||
        q.title?.toLowerCase().includes(mealId.toLowerCase())
    );
  };

  const handleClaimMeal = async (mealId, mealKcal, mealType) => {
    try {
      try {
        if (typeof sounds?.playClaimReward === 'function') {
          sounds.playClaimReward();
        } else if (typeof sounds?.playClick === 'function') {
          sounds.playClick();
        }
      } catch (e) {}

      const targetMeal = activeMeals.find((m) => m.id === mealId);
      const rawKcal = mealKcal || targetMeal?.calories || targetMeal?.kcal || 450;
      const numericKcal = typeof rawKcal === 'string'
        ? parseInt(rawKcal.replace(/[^0-9]/g, ''), 10)
        : Number(rawKcal) || 0;

      // 1. Dispatch to global progress state
      if (typeof globalClaimMealHandler === 'function') {
        globalClaimMealHandler(mealId, numericKcal, mealType || targetMeal?.category);
      } else if (typeof setDayProgress === 'function') {
        setDayProgress((prev) => {
          if (prev.claimedMealIds.includes(mealId)) return prev;
          const updatedClaimedIds = [...prev.claimedMealIds, mealId];
          const updatedConsumedCalories = prev.consumedCalories + (numericKcal || 0);
          const updatedMealsCount = updatedClaimedIds.length;
          return {
            ...prev,
            claimedMealIds: updatedClaimedIds,
            consumedCalories: updatedConsumedCalories,
            claimedCount: updatedMealsCount
          };
        });
      }

      // 2. Reward user with coins (+10 🪙 per meal)
      if (typeof addCoins === 'function') {
        addCoins(10);
      }

      // Immediately lock meal state locally
      setLocalMealsOverride((prev) => {
        const currentMeals = prev[selectedDay] || getDayMeals();
        return {
          ...prev,
          [selectedDay]: currentMeals.map((m) => (m.id === mealId ? { ...m, isClaimed: true, claimed: true } : m))
        };
      });

      if (typeof claimMealReward === 'function') {
        await claimMealReward(mealId, selectedDay);
      }

      const q = getMealQuest(mealId);
      if (q) {
        if (!q.completed && typeof completeQuest === 'function') await completeQuest(q.id);
        if (typeof claimQuest === 'function') await claimQuest(q.id);
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const categoryNames = {
    breakfast: t('diet.breakfast'),
    lunch: t('diet.lunch'),
    dinner: t('diet.dinner'),
    snack: t('diet.snack')
  };

  return (
    <div className="p-4 space-y-3 max-w-5xl mx-auto animate-in fade-in select-none">
      {/* 1. TOP CONTROL BAR: Day Selector Carousel + Edit Preferences Button */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-sm h-[64px] flex items-center justify-between gap-3">
        {/* 7 Horizontal Pill Buttons (Day 1 through Day 7, 60px wide each) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-1">
          {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
            const isLocked = isDayLocked(dayNum);
            const isSelected = selectedDay === dayNum;
            const isCurrent = currentActiveDay === dayNum;

            return (
              <button
                key={dayNum}
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) {
                    notify(`Day ${dayNum} is locked! Complete Day ${currentActiveDay} and advance to unlock.`, 'warning');
                    return;
                  }
                  setSelectedDay(dayNum);
                }}
                className={`h-[40px] w-[60px] min-w-[60px] rounded-xl flex flex-col items-center justify-center transition-all border text-center ${
                  isLocked
                    ? 'bg-slate-100/90 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-[#8B7CFF] border-[#8B7CFF] text-white shadow-xs font-bold cursor-pointer'
                    : isCurrent
                    ? 'bg-[#F0F4F9] border-[#8B7CFF] text-[#8B7CFF] font-semibold hover:bg-slate-200 cursor-pointer'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100 cursor-pointer'
                }`}
                title={isLocked ? `Day ${dayNum} is locked. Complete Day ${currentActiveDay} to unlock.` : undefined}
              >
                <span className="text-[9px] font-mono-app uppercase flex items-center justify-center gap-0.5 leading-none opacity-80">
                  {isLocked && <span className="text-[8px]">🔒</span>}
                  D{dayNum}
                </span>
                <span className="font-sans-app text-[11px] font-bold block leading-none mt-0.5">
                  {isRTL ? `يوم ${dayNum}` : `Day ${dayNum}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Edit Preferences ⚙️ Button */}
        {onOpenQuiz && (
          <button
            type="button"
            onClick={onOpenQuiz}
            className="h-[40px] px-3 bg-[#F8FAFC] hover:bg-slate-200 border border-[#E2E8F0] text-[#1E293B] rounded-xl font-sans-app text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 font-semibold"
            title="Edit Food Preferences & Macro Targets"
          >
            <Settings size={14} className="text-[#8B7CFF]" />
            <span className="hidden sm:inline">{t('diet.edit_preferences')}</span>
            <span className="sm:hidden">⚙️</span>
          </button>
        )}
      </div>

      {/* Top HUD Calories Bar Component */}
      <div className="calories-tracker bg-white border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-app">
          <span className="font-bold text-[#1E293B]">
            Calories: {consumedCalories.toLocaleString()} / {targetCalories.toLocaleString()} kcal
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {targetCalories > 0 ? Math.min(100, Math.round((consumedCalories / targetCalories) * 100)) : 0}% Consumed
          </span>
        </div>
        <div className="w-full bg-[#F1F5F9] h-3 rounded-full overflow-hidden border border-[#E2E8F0]">
          <progress
            value={consumedCalories}
            max={targetCalories}
            className="w-full h-full block [&::-webkit-progress-bar]:bg-[#F1F5F9] [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-[#8B7CFF] [&::-webkit-progress-value]:to-[#3B82F6] [&::-moz-progress-bar]:bg-[#3B82F6]"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      {/* Quest Progression Counter */}
      <div className="quest-progression bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
            {allMealsClaimed ? '🎉' : '⚡'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans-app text-sm font-bold text-slate-800">
                Day {currentActiveDay} Quest Progression
              </span>
              <span className="badge text-[10px] font-mono-app px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {claimedCount}/4 Meals
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans-app mt-0.5">
              {allMealsClaimed
                ? `All meals logged! Advance to Day ${currentActiveDay + 1} to unlock new meal quests and reset daily water & walking.`
                : `Claim meals, or complete Day ${currentActiveDay} to advance to Day ${currentActiveDay + 1}.`}
            </p>
          </div>
        </div>

        {selectedDay === currentActiveDay && currentActiveDay < 7 && (
          <button
            type="button"
            onClick={handleCompleteAndNextDay}
            disabled={isAdvancingDay}
            className="h-[42px] px-5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl font-sans-app text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <CheckCircle2 size={16} />
            <span>{isAdvancingDay ? 'Advancing Day...' : 'Complete Day & Go to Next Day ➡️'}</span>
          </button>
        )}
      </div>

      {/* 2. MACROS OVERVIEW BAR (Height: 54px, 4-Column Grid) */}
      <div className="h-[54px] grid grid-cols-4 gap-2">
        {/* Calories */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2 flex flex-col items-center justify-center text-center overflow-hidden">
          <span className="text-[10px] font-sans-app font-medium text-[#64748B] block truncate leading-tight">
            {t('diet.calories').toUpperCase()}
          </span>
          <span className="text-xs sm:text-sm font-mono-app font-bold text-[#ea580c] leading-tight">
            {totalCalories.toLocaleString()}
          </span>
        </div>

        {/* Protein */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2 flex flex-col items-center justify-center text-center overflow-hidden">
          <span className="text-[10px] font-sans-app font-medium text-[#64748B] block truncate leading-tight">
            {t('diet.protein').toUpperCase()}
          </span>
          <span className="text-xs sm:text-sm font-mono-app font-bold text-[#db2777] leading-tight">
            {totalProtein}g
          </span>
        </div>

        {/* Carbs */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2 flex flex-col items-center justify-center text-center overflow-hidden">
          <span className="text-[10px] font-sans-app font-medium text-[#64748B] block truncate leading-tight">
            {t('diet.carbs').toUpperCase()}
          </span>
          <span className="text-xs sm:text-sm font-mono-app font-bold text-[#0284c7] leading-tight">
            {totalCarbs}g
          </span>
        </div>

        {/* Fats */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2 flex flex-col items-center justify-center text-center overflow-hidden">
          <span className="text-[10px] font-sans-app font-medium text-[#64748B] block truncate leading-tight">
            {t('diet.fats').toUpperCase()}
          </span>
          <span className="text-xs sm:text-sm font-mono-app font-bold text-[#16a34a] leading-tight">
            {totalFats}g
          </span>
        </div>
      </div>

      {/* Calorie Surplus Penalty Warning Alert */}
      {totalCalories > (user?.metrics?.caloric_target || 2200) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-red-700 font-sans-app">
          <AlertTriangle size={16} className="text-red-600 shrink-0" />
          <span>
            <strong>Caloric Surplus Hazard:</strong> Logged calories ({totalCalories} kcal) exceed your daily target ({user?.metrics?.caloric_target || 2000} kcal). Finishing day in surplus will trigger an HP / XP overage penalty!
          </span>
        </div>
      )}

      {/* 3. MEAL CARDS LAYOUT: Clean 2x2 Grid with Expandable Recipe / Cooking Method Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeMeals.map((meal) => {
          const associatedQuest = getMealQuest(meal.id);
          const isClaimed = Boolean(meal.isClaimed || meal.claimed || associatedQuest?.claimed);
          const categoryLabel = (categoryNames[meal.id] || meal.category || meal.id).toUpperCase();
          const displayName = (isRTL && meal.name_ar) ? meal.name_ar : meal.name;
          const isExpanded = !!expandedMealIds[meal.id];

          // Formulate default recipe steps if not explicitly provided
          const steps = Array.isArray(meal.recipe_steps) && meal.recipe_steps.length > 0
            ? meal.recipe_steps
            : [
                `Preheat cooking skillet or baking dish over medium heat with a light coat of olive oil spray.`,
                `Season ${displayName} with aromatic spices (cumin, paprika, pinch of sea salt, black pepper, and minced garlic).`,
                `Sauté or grill for 8-12 minutes until cooked to temperature, locking in savory juices.`,
                `Plate with grains or fresh salad and finish with a squeeze of fresh lemon.`
              ];

          const ingredients = Array.isArray(meal.ingredients) && meal.ingredients.length > 0
            ? meal.ingredients
            : ['Fresh lean protein', 'Complex carbs & grains', 'Seasonal vegetables'];

          return (
            <div
              key={meal.id}
              className={`bg-white border transition-all rounded-2xl p-4 shadow-sm flex flex-col justify-between ${
                isClaimed ? 'border-emerald-300/80 bg-emerald-50/20' : 'border-[#E2E8F0] hover:border-[#8B7CFF]/40'
              }`}
            >
              <div>
                {/* Top Row: Category Label (#3B82F6) | REROLL 🎲 Button (28px high) */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-sans-app font-bold text-[#3B82F6] tracking-wide uppercase truncate">
                    {categoryLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRerollMeal(meal.id)}
                    disabled={rerollingMealId === meal.id || isClaimed}
                    className={`h-[28px] px-2.5 rounded-lg border text-[11px] font-sans-app flex items-center gap-1.5 transition-all font-bold shrink-0 shadow-2xs ${
                      isClaimed
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                        : 'bg-[#F8FAFC] hover:bg-slate-200 border-[#E2E8F0] text-[#b45309] cursor-pointer'
                    }`}
                    title={isClaimed ? 'Meal is already logged. Swapping is locked.' : t('diet.reroll_tooltip')}
                  >
                    <Dices size={13} className={rerollingMealId === meal.id ? 'animate-spin' : ''} />
                    <span>{rerollingMealId === meal.id ? '...' : 'Reroll 🎲'}</span>
                  </button>
                </div>

                {/* Middle Title: Recipe Name */}
                <h3
                  className="font-sans-app text-[15px] font-semibold text-[#0F172A] leading-snug my-2"
                  style={{ fontWeight: 600, fontSize: '15px' }}
                >
                  {displayName}
                </h3>

                {/* Body: Macros Split Pill Badges */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono-app font-bold my-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-[#FF7EB6]/15 text-[#db2777]">
                    {meal.protein_g}g {t('diet.protein')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#38BDF8]/15 text-[#0284c7]">
                    {meal.carbs_g}g {t('diet.carbs')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#FACC15]/20 text-[#b45309]">
                    {meal.fats_g}g {t('diet.fats')}
                  </span>
                  <span className="text-[#64748B] text-[10px] ml-auto font-normal">
                    {meal.calories} {t('diet.calories')}
                  </span>
                </div>

                {/* Expandable Recipe / Cooking Method Toggle */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleRecipe(meal.id)}
                    className="w-full flex items-center justify-between text-xs font-sans-app font-semibold text-[#8B7CFF] hover:text-[#7C3AED] transition-colors py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <ChefHat size={14} />
                      <span>Recipe & Preparation Method</span>
                    </span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {/* Expanded Recipe & Cooking Method Drawer */}
                  {isExpanded && (
                    <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs font-sans-app animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-app">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-amber-500" />
                          <span>Prep: {meal.prep_time_mins || 12}m • Cook: {meal.cook_time_mins || 18}m</span>
                        </span>
                        <span className="text-emerald-700 font-semibold">Chef Approved</span>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <div className="font-bold text-[11px] text-slate-700 uppercase mb-1">
                          Key Ingredients:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] text-slate-700 font-medium"
                            >
                              • {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Step-by-Step Cooking Instructions */}
                      <div>
                        <div className="font-bold text-[11px] text-slate-700 uppercase mb-1">
                          Cooking Method:
                        </div>
                        <ol className="space-y-1 text-[11px] text-slate-600 list-decimal list-inside leading-relaxed">
                          {steps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Cooking Tip */}
                      {meal.cooking_tip && (
                        <div className="p-2 bg-purple-50 border border-purple-100 rounded-lg text-[10px] text-purple-900 leading-snug">
                          <strong>💡 Chef Tip:</strong> {meal.cooking_tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: CLAIM action button with Coins reward */}
              <div className="mt-3">
                <button
                  type="button"
                  disabled={isClaimed}
                  onClick={() => !isClaimed && handleClaimMeal(meal.id, meal.calories || meal.kcal, meal.category)}
                  className={`h-[38px] w-full rounded-xl font-sans-app text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                    isClaimed
                      ? 'bg-gray-300 text-gray-700 border border-gray-400 cursor-not-allowed select-none'
                      : 'bg-[#4ADE80] hover:bg-[#38c168] text-[#064e3b] cursor-pointer'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-700" />
                      <span>CLAIMED ✔️</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>CLAIM MEAL (+10 🪙)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DietScreen;
