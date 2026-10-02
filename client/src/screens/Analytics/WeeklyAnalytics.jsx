import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  TrendingUp,
  Lock,
  Unlock,
  Scale,
  Award,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  X,
  Target
} from 'lucide-react';

export const WeeklyAnalytics = ({ onOpenDaily, onOpenDiet }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const { recordWeighIn } = useGame();

  const [isWeighInOpen, setIsWeighInOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const campaign = user?.campaign || {
    current_day: 1,
    current_week: 1,
    starting_weight_kg: 76.5,
    target_weight_kg: 70.0,
    current_weight_kg: 74.8,
    week_unlocked: 1,
    weight_history: []
  };

  const currentWeek = campaign.current_week || 1;
  const currentDay = campaign.current_day || 1;
  const unlockedWeek = campaign.week_unlocked || 1;
  const parseKg = (val, fallback = 70) => {
    if (!val) return fallback;
    const n = Number(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(n) || n <= 0 ? fallback : n;
  };

  const startingWeight = parseKg(campaign.starting_weight_kg || user?.metrics?.weight_kg || user?.weight_kg, 75);
  const currentWeight = parseKg(campaign.current_weight_kg || user?.weight_kg, startingWeight);
  const targetWeight = parseKg(campaign.target_weight_kg || user?.metrics?.target_weight_kg, startingWeight > 10 ? startingWeight - 5 : 65);
  const weightDelta = (currentWeight - startingWeight).toFixed(1);
  const targetCalories = user?.metrics?.caloric_target || 2000;

  // Four-week progression timeline
  const weeksData = [
    {
      weekNumber: 1,
      title: 'Week 1: Foundation Forge',
      status: 'active',
      isLocked: false,
      adherence: 94,
      avgCalories: targetCalories,
      totalXP: 2850,
      startWeight: startingWeight,
      endWeight: currentWeek === 1 ? currentWeight : +(startingWeight - 0.9).toFixed(1),
      note: 'Foundational habit building and initial metabolism stabilization.'
    },
    {
      weekNumber: 2,
      title: 'Week 2: Crucible of Discipline',
      status: unlockedWeek >= 2 ? (currentWeek === 2 ? 'active' : 'completed') : 'locked',
      isLocked: unlockedWeek < 2,
      adherence: unlockedWeek >= 2 ? 91 : 0,
      avgCalories: unlockedWeek >= 2 ? targetCalories : 0,
      totalXP: unlockedWeek >= 2 ? 3100 : 0,
      startWeight: +(startingWeight - 0.9).toFixed(1),
      endWeight: +(startingWeight - 1.7).toFixed(1),
      note: 'Requires weigh-in verification at Day 7 of Week 1 to unlock.'
    },
    {
      weekNumber: 3,
      title: 'Week 3: Peak Performance',
      status: unlockedWeek >= 3 ? (currentWeek === 3 ? 'active' : 'completed') : 'locked',
      isLocked: unlockedWeek < 3,
      adherence: unlockedWeek >= 3 ? 95 : 0,
      avgCalories: unlockedWeek >= 3 ? targetCalories : 0,
      totalXP: unlockedWeek >= 3 ? 3400 : 0,
      startWeight: +(startingWeight - 1.7).toFixed(1),
      endWeight: +(startingWeight - 2.5).toFixed(1),
      note: 'Enhanced high-protein menus and expanded step challenges.'
    },
    {
      weekNumber: 4,
      title: 'Week 4: Champion Mastery',
      status: unlockedWeek >= 4 ? (currentWeek === 4 ? 'active' : 'completed') : 'locked',
      isLocked: unlockedWeek < 4,
      adherence: unlockedWeek >= 4 ? 98 : 0,
      avgCalories: unlockedWeek >= 4 ? targetCalories : 0,
      totalXP: unlockedWeek >= 4 ? 4000 : 0,
      startWeight: +(startingWeight - 2.5).toFixed(1),
      endWeight: targetWeight,
      note: 'Grand finale week achieving target goal milestone and victory rewards.'
    }
  ];

  const selectedWeek = weeksData[selectedWeekIndex] || weeksData[0];

  const handleWeighInSubmit = async (e) => {
    e.preventDefault();
    if (!weightInput || isNaN(weightInput)) return;

    setIsSubmitting(true);
    try {
      await recordWeighIn(parseFloat(weightInput), noteInput);
      setIsWeighInOpen(false);
      setWeightInput('');
      setNoteInput('');
    } catch (err) {
      console.error('Weigh-in failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-[#8B7CFF]/15 text-[#8B7CFF]">
              <TrendingUp size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-pixel text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] font-bold">
                  CAMPAIGN ANALYTICS
                </span>
                <span className="font-pixel text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-[#FACC15]/20 text-[#b45309]">
                  WEEK {currentWeek} ACTIVE • UNLOCKED: {unlockedWeek}
                </span>
              </div>
              <h2 className="font-pixel text-base sm:text-lg text-[#1E293B] mt-1.5 font-bold">
                {t('weekly.title')}
              </h2>
              <p className="text-xs text-[#64748B] font-sans-app mt-0.5 max-w-xl">
                {t('weekly.subtitle')}
              </p>
            </div>
          </div>

          {/* Weigh-in trigger button */}
          <button
            type="button"
            onClick={() => setIsWeighInOpen(true)}
            className="self-start md:self-auto px-5 py-3 bg-[#FACC15] hover:brightness-105 text-[#1E293B] rounded-2xl font-pixel text-xs font-bold flex items-center gap-2 shadow-md shadow-[#FACC15]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Scale size={16} />
            <span>{t('weekly.weigh_in_btn')}</span>
          </button>
        </div>
      </div>

      {/* Goal & Weight Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-pixel text-[#64748B]">{t('weekly.starting_weight')}</span>
            <Target size={14} className="text-[#64748B]" />
          </div>
          <div className="font-mono-app text-xl sm:text-2xl font-bold text-[#1E293B] mt-2">
            {startingWeight} <span className="text-xs text-[#64748B]">kg</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-pixel text-[#0284c7] font-bold">{t('weekly.current_weight')}</span>
            <Scale size={14} className="text-[#38BDF8]" />
          </div>
          <div className="font-mono-app text-xl sm:text-2xl font-bold text-[#1E293B] mt-2">
            {currentWeight} <span className="text-xs text-[#64748B]">kg</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-pixel text-[#16a34a] font-bold">{t('weekly.target_weight')}</span>
            <Award size={14} className="text-[#4ADE80]" />
          </div>
          <div className="font-mono-app text-xl sm:text-2xl font-bold text-[#1E293B] mt-2">
            {targetWeight} <span className="text-xs text-[#64748B]">kg</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-pixel text-[#b45309] font-bold">{t('weekly.weight_delta')}</span>
            <TrendingUp size={14} className="text-[#FACC15]" />
          </div>
          <div className="font-mono-app text-xl sm:text-2xl font-bold text-[#ea580c] mt-2">
            {weightDelta > 0 ? `+${weightDelta}` : weightDelta} <span className="text-xs text-[#64748B]">kg</span>
          </div>
        </div>
      </div>

      {/* Week-by-Week Comparison Analytical Bar Graph */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h3 className="font-pixel text-sm text-[#1E293B] flex items-center gap-2 font-bold">
              <TrendingUp size={16} className="text-[#8B7CFF]" />
              <span>Consecutive Weekly Performance Graph</span>
            </h3>
            <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
              Comparing adherence percentages and weight progression across 7-day blocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-pixel text-[#b45309] bg-[#FACC15]/20 px-3 py-1 rounded-full">
              {t('weekly.lock_desc').slice(0, 48)}...
            </span>
          </div>
        </div>

        {/* 4 Weekly Comparison Bar Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {weeksData.map((w, index) => {
            const isSelected = selectedWeekIndex === index;
            const barHeightPct = w.isLocked ? 15 : w.adherence;

            return (
              <button
                key={w.weekNumber}
                type="button"
                onClick={() => setSelectedWeekIndex(index)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                  isSelected
                    ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-md shadow-[#8B7CFF]/15 scale-102'
                    : w.isLocked
                    ? 'border-slate-200 bg-slate-50 opacity-75'
                    : 'border-slate-200 bg-[#F0F4F9]/60 hover:bg-slate-100'
                }`}
              >
                {/* Week Header */}
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-[#1E293B] font-bold">WEEK {w.weekNumber}</span>
                  {w.isLocked ? (
                    <span className="p-1.5 rounded-full bg-slate-200 text-slate-500">
                      <Lock size={14} />
                    </span>
                  ) : (
                    <span className="p-1.5 rounded-full bg-[#4ADE80]/20 text-[#16a34a]">
                      <Unlock size={14} />
                    </span>
                  )}
                </div>

                {/* Analytical Bar Graphic */}
                <div className="h-44 bg-slate-100 rounded-2xl p-2 border border-slate-200 my-4 flex flex-col justify-end relative overflow-hidden">
                  {w.isLocked ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-2">
                      <Lock size={24} className="text-slate-400 mb-2" />
                      <span className="font-pixel text-[9px] text-[#FF6B6B] leading-tight">
                        WEEK {w.weekNumber} LOCKED
                      </span>
                      <span className="text-[10px] text-[#64748B] font-sans-app mt-1">
                        Weigh-in required
                      </span>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className="w-full bg-gradient-to-t from-[#8B7CFF] to-[#FF7EB6] rounded-xl transition-all duration-500 relative flex flex-col items-center justify-start pt-2"
                      >
                        <span className="font-mono-app text-xs font-bold text-white shadow-sm">
                          {w.adherence}%
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Week Stats Footer */}
                <div className="space-y-1 text-xs font-mono-app">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Score:</span>
                    <span className="text-[#1E293B] font-bold">{w.isLocked ? '🔒 Locked' : `${w.adherence}%`}</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Weight:</span>
                    <span className="text-[#1E293B] font-bold">{w.isLocked ? '—' : `${w.endWeight} kg`}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Week Deep-Dive Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${selectedWeek.isLocked ? 'bg-slate-100 text-slate-500' : 'bg-[#8B7CFF]/15 text-[#8B7CFF]'}`}>
              {selectedWeek.isLocked ? <Lock size={22} /> : <CheckCircle2 size={22} />}
            </div>
            <div>
              <h3 className="font-pixel text-sm text-[#1E293B] font-bold">
                {selectedWeek.title}
              </h3>
              <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
                {selectedWeek.note}
              </p>
            </div>
          </div>

          {selectedWeek.isLocked && (
            <button
              type="button"
              onClick={() => setIsWeighInOpen(true)}
              className="px-4 py-2.5 bg-[#8B7CFF] hover:brightness-105 text-white rounded-2xl font-pixel text-xs font-bold transition-all shadow-md shadow-[#8B7CFF]/20 cursor-pointer flex items-center gap-2"
            >
              <Scale size={14} />
              <span>UNLOCK VIA WEIGH-IN</span>
            </button>
          )}
        </div>

        {/* 3 Metrics in Inspector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#F0F4F9] rounded-2xl p-4 border border-slate-200">
            <span className="text-[10px] font-pixel text-[#64748B] block">ADHERENCE RATE</span>
            <span className="font-pixel text-xl text-[#1E293B] block mt-1">
              {selectedWeek.isLocked ? '0%' : `${selectedWeek.adherence}%`}
            </span>
            <span className="text-[11px] text-[#16a34a] font-sans-app mt-1 block">
              {selectedWeek.isLocked ? 'Pending cycle' : 'Consistent adherence'}
            </span>
          </div>

          <div className="bg-[#F0F4F9] rounded-2xl p-4 border border-slate-200">
            <span className="text-[10px] font-pixel text-[#64748B] block">DAILY AVG CALORIES</span>
            <span className="font-pixel text-xl text-[#1E293B] block mt-1">
              {selectedWeek.isLocked ? '—' : `${selectedWeek.avgCalories} kcal`}
            </span>
            <span className="text-[11px] text-[#0284c7] font-sans-app mt-1 block">
              Optimal metabolic bracket
            </span>
          </div>

          <div className="bg-[#F0F4F9] rounded-2xl p-4 border border-slate-200">
            <span className="text-[10px] font-pixel text-[#64748B] block">TOTAL XP EARNED</span>
            <span className="font-pixel text-xl text-[#8B7CFF] block mt-1">
              {selectedWeek.isLocked ? '0 XP' : `+${selectedWeek.totalXP} XP`}
            </span>
            <span className="text-[11px] text-[#b45309] font-sans-app mt-1 block">
              Contributed to Adventurer Level
            </span>
          </div>
        </div>
      </div>

      {/* Weigh-in Measurement Modal */}
      {isWeighInOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setIsWeighInOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#1E293B] rounded-xl hover:bg-slate-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#FACC15]/20 text-[#b45309] rounded-2xl">
                <Scale size={24} />
              </div>
              <div>
                <h3 className="font-pixel text-sm text-[#1E293B] font-bold">
                  {t('weekly.modal_title')}
                </h3>
                <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
                  Unlocks next 7-day meal plan and updates caloric calculations.
                </p>
              </div>
            </div>

            <form onSubmit={handleWeighInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-pixel text-[#1E293B] mb-1.5">
                  NEW BODY WEIGHT (KG)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="250"
                    required
                    placeholder="e.g. 74.2"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F0F4F9] border border-slate-200 rounded-2xl text-[#1E293B] font-mono-app text-sm focus:outline-none focus:border-[#8B7CFF] transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono-app text-[#64748B]">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-pixel text-[#1E293B] mb-1.5">
                  WEEKLY ADVENTURE NOTES (OPTIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Felt great energy on walking quests, enjoyed dinner meals..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F0F4F9] border border-slate-200 rounded-2xl text-[#1E293B] text-xs font-sans-app focus:outline-none focus:border-[#8B7CFF] transition-all resize-none"
                />
              </div>

              <div className="p-3.5 bg-[#8B7CFF]/10 rounded-2xl border border-[#8B7CFF]/20 text-xs text-[#8B7CFF] flex items-center gap-2">
                <Sparkles size={16} className="shrink-0" />
                <span>Weighing in awards <strong>+350 Milestone XP</strong> and recalculates your meal targets!</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWeighInOpen(false)}
                  className="flex-1 py-3 bg-[#F0F4F9] hover:bg-slate-200 text-[#1E293B] font-pixel text-xs rounded-2xl transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !weightInput}
                  className="flex-1 py-3 bg-[#8B7CFF] hover:brightness-105 text-white font-pixel text-xs font-bold rounded-2xl shadow-lg shadow-[#8B7CFF]/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'SAVING...' : 'CONFIRM & UNLOCK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAnalytics;
