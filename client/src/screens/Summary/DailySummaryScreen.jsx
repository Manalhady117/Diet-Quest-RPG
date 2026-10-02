import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Trophy,
  Flame,
  Heart,
  Zap,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Lock,
  Scale
} from 'lucide-react';

export const DailySummaryScreen = ({ summaryData, onClose, onNavigateToProgress, onNavigateToMeals }) => {
  const { user } = useAuth();
  const { stats, closeDailySummary } = useGame();
  const { t, isRTL } = useLanguage();

  const handleStartNextDay = () => {
    if (onClose) {
      onClose();
    } else {
      closeDailySummary();
    }
    if (summaryData?.needsWeighIn && onNavigateToProgress) {
      onNavigateToProgress();
    } else if (onNavigateToMeals) {
      onNavigateToMeals();
    }
  };

  const dayNumber = summaryData?.completedDayNumber || user?.campaign?.current_day || 1;
  const nextDay = summaryData?.nextDayNumber || (dayNumber >= 7 ? 1 : dayNumber + 1);
  const xpEarned = summaryData?.xpEarnedToday || 350;
  const streak = summaryData?.streak_count || stats.streak_count || 1;
  const hpCurrent = summaryData?.hp_current || stats.hp_current || 100;
  const hpMax = stats.hp_max || 100;
  const needsWeighIn = summaryData?.needsWeighIn || dayNumber >= 7;

  const targetCals = summaryData?.targetCalories || 2150;
  const consumedCals = summaryData?.totalCaloriesConsumed || 2050;
  const targetProtein = summaryData?.targetProtein_g || 160;
  const consumedProtein = summaryData?.totalProtein_g || 155;
  const targetCarbs = summaryData?.targetCarbs_g || 210;
  const consumedCarbs = summaryData?.totalCarbs_g || 195;
  const targetFats = summaryData?.targetFats_g || 65;
  const consumedFats = summaryData?.totalFats_g || 60;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-6 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#8B7CFF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Celebration Banner */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4ADE80]/15 text-[#16a34a] text-[10px] font-pixel mb-1 font-bold">
            <Sparkles size={13} />
            <span>DAILY VICTORY ATTAINED</span>
          </div>

          <h2 className="font-pixel text-lg sm:text-xl text-[#1E293B] font-bold">
            DAY {dayNumber} OF 7 CONQUERED!
          </h2>

          <div className="flex justify-center py-2">
            <PixelMascot state="celebrate" size={100} />
          </div>

          <p className="text-xs text-[#64748B] font-sans-app max-w-sm mx-auto">
            You successfully navigated today's meal quests and activity objectives! Here is your daily performance summary:
          </p>
        </div>

        {/* Top Highlight Badges: XP Earned, Streak, HP */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center">
          {/* XP Gained */}
          <div className="bg-[#F0F4F9] border border-slate-200 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-[#8B7CFF] text-[10px] font-pixel mb-1 font-bold">
              <Award size={13} />
              <span>EARNED</span>
            </div>
            <div className="font-mono-app text-lg sm:text-xl font-bold text-[#8B7CFF]">
              +{xpEarned}
            </div>
            <span className="text-[9px] text-[#64748B] font-mono-app">XP Points</span>
          </div>

          {/* Current Streak */}
          <div className="bg-[#F0F4F9] border border-slate-200 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-[#ea580c] text-[10px] font-pixel mb-1 font-bold">
              <Flame size={13} className="fill-[#ea580c]" />
              <span>STREAK</span>
            </div>
            <div className="font-mono-app text-lg sm:text-xl font-bold text-[#ea580c]">
              {streak} Days
            </div>
            <span className="text-[9px] text-[#64748B] font-mono-app">Flame Active</span>
          </div>

          {/* HP Status */}
          <div className="bg-[#F0F4F9] border border-slate-200 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-[#16a34a] text-[10px] font-pixel mb-1 font-bold">
              <Heart size={13} className="fill-[#16a34a]/30" />
              <span>STAMINA</span>
            </div>
            <div className="font-mono-app text-lg sm:text-xl font-bold text-[#16a34a]">
              {hpCurrent}/{hpMax}
            </div>
            <span className="text-[9px] text-[#64748B] font-mono-app">HP Health</span>
          </div>
        </div>

        {/* Nutrition & Macros Consumed vs Target */}
        <div className="bg-[#F0F4F9] border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-pixel text-xs text-[#1E293B] font-bold">DAILY NUTRITION SCORE</span>
            <span className="font-mono-app text-xs text-[#8B7CFF] font-bold">
              {consumedCals} / {targetCals} kcal
            </span>
          </div>

          {/* Macro Progress Bars */}
          <div className="space-y-2.5 pt-1">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-[10px] font-mono-app mb-1">
                <span className="text-[#FF7EB6] font-bold">Protein Intake</span>
                <span className="text-[#64748B]">
                  {consumedProtein}g / {targetProtein}g ({Math.round((consumedProtein / targetProtein) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF7EB6] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-[10px] font-mono-app mb-1">
                <span className="text-[#38BDF8] font-bold">Carbohydrates</span>
                <span className="text-[#64748B]">
                  {consumedCarbs}g / {targetCarbs}g ({Math.round((consumedCarbs / targetCarbs) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#38BDF8] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-[10px] font-mono-app mb-1">
                <span className="text-[#4ADE80] font-bold">Essential Fats</span>
                <span className="text-[#64748B]">
                  {consumedFats}g / {targetFats}g ({Math.round((consumedFats / targetFats) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4ADE80] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (consumedFats / targetFats) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Weigh-In Gate Notice if Day 7 Completed */}
        {needsWeighIn && (
          <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-2xl p-4 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-[#e11d48] text-xs font-pixel font-bold">
              <Lock size={15} />
              <span>WEEK 2 PLAN LOCKED 🔒</span>
            </div>
            <p className="text-xs text-[#64748B] font-sans-app">
              You finished Day 7! Register your weekly weigh-in on the Campaign screen to unlock Week 2's fresh meal varieties!
            </p>
          </div>
        )}

        {/* Action Button: Start Next Day */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleStartNextDay}
            className="w-full py-3.5 px-6 bg-[#4ADE80] hover:brightness-105 text-[#064e3b] font-pixel text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-[#4ADE80]/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{needsWeighIn ? 'GO TO WEEKLY WEIGH-IN GATE' : `START NEXT DAY (DAY ${nextDay})`}</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onClose || closeDailySummary}
            className="w-full py-2 text-center text-xs text-[#64748B] hover:text-[#1E293B] font-mono-app transition-colors cursor-pointer"
          >
            Close summary & stay on current view
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailySummaryScreen;
