import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  BatteryCharging,
  Zap,
  Calendar,
  Flame,
  Award,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const DailyAnalytics = ({ onOpenDiet, onOpenWeekly }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const { stats, finishDay } = useGame();

  const [selectedDayIndex, setSelectedDayIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const campaign = user?.campaign || {
    current_day: 1,
    current_week: 1,
    daily_logs: []
  };

  const currentDay = campaign.current_day || 1;
  const currentWeek = campaign.current_week || 1;
  const dailyLogs = campaign.daily_logs || [];
  const targetCalories = user?.metrics?.caloric_target || 0;

  // Generate 7-day calendar dates synced with real system calendar
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
  const startOfWeek = new Date(today);
  // Shift to current campaign's relative week
  startOfWeek.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Monday start

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const dayNum = i + 1;

    // Check if we have a recorded log for this day
    const daySchedule = user?.diet_plan?.week_schedule?.find((s) => s.day === dayNum);
    const dayMeals = daySchedule?.meals || (dayNum === currentDay ? (user?.diet_plan?.meals || []) : []);
    const claimedToday = dayMeals
      .filter((m) => m.isClaimed || m.claimed)
      .reduce((acc, m) => acc + (Number(m.calories) || 0), 0);

    const log = dailyLogs.find((l) => l.day === dayNum) || (dayNum === currentDay ? {
      calories_consumed: claimedToday,
      xp_earned: stats?.xp_total || 0,
      hp_end: stats?.hp_current || 100,
      adherence: targetCalories > 0 ? Math.min(100, Math.round((claimedToday / targetCalories) * 100)) : 0
    } : null);

    const isPast = dayNum < currentDay;
    const isCurrent = dayNum === currentDay;
    const isFuture = dayNum > currentDay;

    // Battery percentage calculation (adherence / score)
    const batteryLevel = log ? (log.adherence ?? (targetCalories > 0 ? Math.min(100, Math.round(((log.calories_consumed || 0) / targetCalories) * 100)) : 0)) : (isPast ? 85 : isCurrent && targetCalories > 0 ? Math.min(100, Math.round((claimedToday / targetCalories) * 100)) : 0);

    return {
      dayNum,
      date: dayDate,
      dateStr: dayDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      weekdayShort: dayDate.toLocaleDateString(undefined, { weekday: 'short' }),
      dateNum: dayDate.getDate(),
      log,
      isPast,
      isCurrent,
      isFuture,
      batteryLevel
    };
  });

  const activeIndex = selectedDayIndex !== null ? selectedDayIndex : (currentDay - 1);
  const activeSelected = weekDays[Math.min(6, Math.max(0, activeIndex))] || weekDays[0];

  const handleCompleteDay = async () => {
    setIsSubmitting(true);
    try {
      await finishDay();
    } catch (err) {
      console.error('Failed to complete day:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 bg-[#4ADE80]/15 text-[#16a34a] rounded-2xl flex items-center justify-center">
              <BatteryCharging size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF]">
                  WEEK {currentWeek} • DAY {currentDay} OF 7
                </span>
              </div>
              <h2 className="font-pixel text-base sm:text-lg text-[#1E293B] mt-1.5">
                {t('daily.title')}
              </h2>
              <p className="text-xs text-[#64748B] font-sans-app mt-0.5 max-w-xl">
                {t('daily.subtitle')}
              </p>
            </div>
          </div>

          {/* Quick complete day button right in header */}
          <button
            type="button"
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="self-start md:self-auto px-5 py-3 bg-[#4ADE80] hover:brightness-105 text-[#064e3b] rounded-2xl font-pixel text-xs font-bold flex items-center gap-2 shadow-md shadow-[#4ADE80]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? t('action.completing_day') : t('action.complete_day')}</span>
          </button>
        </div>
      </div>

      {/* Battery Usage & Day-by-Day Bar Chart */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-pixel text-sm text-[#1E293B] flex items-center gap-2 font-bold">
              <Zap size={16} className="text-[#FACC15]" />
              <span>{t('daily.adherence')}</span>
            </h3>
            <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
              Synced with calendar days. Click any cell to inspect biometric telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans-app">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#4ADE80]" />
              <span className="text-[#64748B] text-[11px]">&gt;90% Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FACC15]" />
              <span className="text-[#64748B] text-[11px]">75-89% Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-[#64748B] text-[11px]">Upcoming</span>
            </div>
          </div>
        </div>

        {/* 7-Day Battery Columns (Height: 240px Container) */}
        <div className="h-[240px] grid grid-cols-7 gap-1.5 sm:gap-3 mt-4 items-end">
          {weekDays.map((d, index) => {
            const isSelected = activeSelected.dayNum === d.dayNum;
            const barColor = d.batteryLevel >= 90 ? 'bg-[#4ADE80]' : d.batteryLevel >= 75 ? 'bg-[#FACC15]' : 'bg-[#FF6B6B]';
            const textColor = d.batteryLevel >= 90 ? 'text-[#16a34a]' : d.batteryLevel >= 75 ? 'text-[#b45309]' : 'text-[#e11d48]';

            return (
              <button
                key={d.dayNum}
                type="button"
                onClick={() => setSelectedDayIndex(index)}
                className={`h-full flex flex-col justify-between items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-xs'
                    : d.isCurrent
                    ? 'border-[#FACC15] bg-[#FACC15]/5'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100'
                }`}
              >
                {/* 1. Day Header */}
                <div className="flex flex-col items-center">
                  <span className="font-pixel text-[9px] text-[#64748B] uppercase leading-tight">
                    {d.weekdayShort}
                  </span>
                  <span className="font-mono-app text-[11px] font-bold text-[#1E293B] leading-tight">
                    {d.dateNum}
                  </span>
                </div>

                {/* 2. Percentage Text strictly ABOVE battery bar */}
                <span className={`font-mono-app text-[11px] sm:text-xs font-bold my-1 ${d.batteryLevel > 0 ? textColor : 'text-slate-400'}`}>
                  {d.batteryLevel > 0 ? `${d.batteryLevel}%` : '—'}
                </span>

                {/* 3. Battery Cell Graphic */}
                <div className="w-full h-[120px] bg-white rounded-xl p-1 border border-[#E2E8F0] flex flex-col justify-end relative overflow-hidden">
                  {/* Battery Terminal Cap */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-slate-300 rounded-b-xs" />

                  {/* Charge Fill Bar */}
                  {d.batteryLevel > 0 ? (
                    <div
                      style={{ height: `${d.batteryLevel}%` }}
                      className={`w-full rounded-lg ${barColor} transition-all duration-500 relative flex items-center justify-center`}
                    >
                      {d.isCurrent && (
                        <Zap size={12} className="text-white animate-bounce" />
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="font-pixel text-[7px] text-slate-400">LOCK</span>
                    </div>
                  )}
                </div>

                {/* 4. Day Status Tag */}
                <div className="h-4 flex items-center justify-center">
                  {d.isCurrent && (
                    <span className="font-pixel text-[8px] uppercase px-1.5 py-0.2 rounded-full bg-[#FACC15]/20 text-[#b45309] font-bold">
                      TODAY
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Drill-down Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Daily Score & XP */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[10px] text-[#16a34a] uppercase tracking-wider font-bold">
                {t('daily.score')}
              </span>
              <Award size={18} className="text-[#4ADE80]" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-pixel text-2xl sm:text-3xl text-[#1E293B]">
                {activeSelected.batteryLevel}%
              </span>
              <span className="text-xs text-[#16a34a] font-sans-app font-bold">
                {activeSelected.batteryLevel >= 90 ? 'Mastery Tier' : 'Adept Tier'}
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-sans-app mt-2">
              Day {activeSelected.dayNum} ({activeSelected.dateStr}) telemetry assessment.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono-app">
            <span className="text-[#64748B]">{t('daily.xp_earned')}:</span>
            <span className="text-[#8B7CFF] font-bold">+{activeSelected.log?.xp_earned ?? (stats?.xp_total || 0)} XP</span>
          </div>
        </div>

        {/* Metric 2: Caloric Accuracy */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[10px] text-[#0284c7] uppercase tracking-wider font-bold">
                {t('daily.calories_logged')}
              </span>
              <Flame size={18} className="text-[#38BDF8]" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-pixel text-2xl sm:text-3xl text-[#1E293B]">
                {activeSelected.log?.calories_consumed || 0}
              </span>
              <span className="text-xs text-[#64748B] font-sans-app">
                / {targetCalories} kcal
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 overflow-hidden border border-slate-200">
              <div
                style={{ width: `${targetCalories > 0 ? Math.min(100, Math.round(((activeSelected.log?.calories_consumed || 0) / targetCalories) * 100)) : 0}%` }}
                className="bg-[#38BDF8] h-full rounded-full transition-all"
              />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans-app">
            <span className="text-[#64748B]">Streak Bonus:</span>
            <span className="text-[#16a34a] font-mono-app font-bold">
              {stats.streak_multiplier || 1.2}x Active
            </span>
          </div>
        </div>

        {/* Metric 3: HP & Shield Protection */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[10px] text-[#e11d48] uppercase tracking-wider font-bold">
                SURVIVAL & SHIELDS
              </span>
              <ShieldCheck size={18} className="text-[#FF7EB6]" />
            </div>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-pixel text-2xl sm:text-3xl text-[#1E293B]">
                {stats.hp_current} / {stats.hp_max}
              </span>
              <span className="text-xs text-[#16a34a] font-sans-app font-bold">
                HP Healthy
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-sans-app mt-2">
              Aegis Shield active: protects against fast food traps & penalties.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans-app">
            <span className="text-[#64748B]">Hydration Level:</span>
            <span className="text-[#0284c7] font-mono-app font-bold">
              {stats.water_current_ml || 0} / {stats.water_target_ml || 2500} mL
            </span>
          </div>
        </div>
      </div>

      {/* Completion CTA Banner */}
      <div className="bg-white border-2 border-[#4ADE80]/30 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#16a34a]" />
            <h3 className="font-pixel text-sm sm:text-base text-[#1E293B]">
              {t('daily.complete_banner_title')}
            </h3>
          </div>
          <p className="text-xs text-[#64748B] font-sans-app max-w-xl">
            {t('daily.complete_banner_desc')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {onOpenDiet && (
            <button
              type="button"
              onClick={onOpenDiet}
              className="h-[52px] px-5 bg-[#F0F4F9] hover:bg-slate-200 border border-slate-200 text-[#1E293B] rounded-xl font-pixel text-xs transition-all cursor-pointer font-bold"
            >
              {t('nav.diet')}
            </button>
          )}

          <button
            type="button"
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="h-[52px] flex-1 md:flex-initial px-8 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-xl font-pixel text-xs sm:text-sm font-bold shadow-md shadow-[#22C55E]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide"
          >
            <Sparkles size={16} />
            <span>{isSubmitting ? t('action.completing_day') : t('action.complete_day_btn')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyAnalytics;
