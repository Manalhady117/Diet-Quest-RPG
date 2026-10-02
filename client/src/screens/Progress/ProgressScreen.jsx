import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGame } from '../../context/GameContext.jsx';
import {
  Trophy,
  Lock,
  Unlock,
  Scale,
  Calendar,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';

export const ProgressScreen = ({ onNavigateToMeals }) => {
  const { user } = useAuth();
  const { recordWeighIn, stats, notify } = useGame();

  const campaign = user?.campaign || {
    current_day: 1,
    current_week: 1,
    starting_weight_kg: 75,
    target_weight_kg: user?.user_goal === 'weight_loss' ? 70 : 80,
    current_weight_kg: 75,
    weight_history: [],
    week_unlocked: 1,
    needs_weigh_in: false,
    daily_logs: []
  };

  const startingWeight = campaign.starting_weight_kg || 75;
  const currentWeight = campaign.current_weight_kg || startingWeight;
  const targetWeight = campaign.target_weight_kg || (user?.user_goal === 'weight_loss' ? 70 : 80);
  const currentDay = campaign.current_day || 1;
  const currentWeek = campaign.current_week || 1;
  const unlockedWeek = campaign.week_unlocked || 1;
  const isWeekLocked = unlockedWeek <= currentWeek; // Week 2 is locked until weekly weigh-in
  const isWeighInDue = currentDay >= 7 || campaign.needs_weigh_in;

  // Weigh-in form state
  const [weightInput, setWeightInput] = useState(currentWeight.toString());
  const [weighInNote, setWeighInNote] = useState('');
  const [isSubmittingWeighIn, setIsSubmittingWeighIn] = useState(false);
  const [showWeighInModal, setShowWeighInModal] = useState(isWeighInDue);

  // Calculate weight delta
  const weightChange = currentWeight - startingWeight;
  const isWeightLoss = user?.user_goal === 'weight_loss';

  const handleWeighInSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput);
    if (!parsed || parsed <= 20 || parsed >= 300) {
      notify('Please enter a valid weight between 20kg and 300kg.', 'danger');
      return;
    }

    setIsSubmittingWeighIn(true);
    try {
      await recordWeighIn(parsed, weighInNote);
      setShowWeighInModal(false);
      setWeighInNote('');
    } catch (err) {
      // Error handled in GameContext
    } finally {
      setIsSubmittingWeighIn(false);
    }
  };

  // Progress percentage towards goal
  const totalGoalDelta = Math.abs(startingWeight - targetWeight);
  const currentProgressDelta = Math.abs(startingWeight - currentWeight);
  const progressPercent = totalGoalDelta > 0
    ? Math.min(100, Math.round((currentProgressDelta / totalGoalDelta) * 100))
    : 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Campaign Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 rounded-xl text-[#8B7CFF] shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-pixel text-base sm:text-lg text-[#0F172A] font-bold">
                  CAMPAIGN & WEIGHT PROGRESSION
                </h1>
                <span className="font-pixel text-[10px] px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 font-bold">
                  WEEK {currentWeek}
                </span>
                <span className="font-pixel text-[10px] px-2.5 py-0.5 rounded-full bg-[#4ADE80]/20 text-[#16a34a] border border-[#4ADE80]/40 font-bold">
                  DAY {currentDay} OF 7
                </span>
              </div>
              <p className="text-xs text-[#64748B] font-sans-app mt-1">
                Conquer each 7-day nutritional campaign cycle. Complete all 7 days and submit your Weekly Weigh-In to unlock the upcoming week.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowWeighInModal(true)}
              className="px-3.5 py-2.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-[#8B7CFF]/25 cursor-pointer"
            >
              <Scale size={14} />
              <span>{isWeighInDue ? 'LOG WEEKLY WEIGH-IN' : 'RECORD WEIGH-IN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Goal & Weight Metrics Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Starting Weight */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-pixel mb-2 font-bold">
            <span>STARTING BASELINE</span>
            <Calendar size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-app text-3xl font-bold text-[#0F172A]">
              {startingWeight}
            </span>
            <span className="text-xs font-mono-app text-[#64748B]">kg</span>
          </div>
          <p className="text-[11px] text-[#64748B] font-sans-app mt-2">
            Initial character physical measurement
          </p>
        </div>

        {/* Current Weight */}
        <div className="bg-white border border-[#8B7CFF]/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8B7CFF] text-xs font-pixel mb-2 font-bold">
            <span>CURRENT WEIGHT</span>
            <Scale size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-app text-3xl font-bold text-[#8B7CFF]">
              {currentWeight}
            </span>
            <span className="text-xs font-mono-app text-[#64748B]">kg</span>
            {weightChange !== 0 && (
              <span
                className={`ml-2 text-xs font-mono-app font-bold flex items-center gap-0.5 ${
                  (isWeightLoss && weightChange < 0) || (!isWeightLoss && weightChange > 0)
                    ? 'text-[#16a34a]'
                    : 'text-[#ef4444]'
                }`}
              >
                {weightChange < 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
                {weightChange > 0 ? `+${weightChange.toFixed(1)}` : weightChange.toFixed(1)} kg
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748B] font-sans-app mt-2">
            {campaign.weight_history?.length > 0
              ? `Last updated ${new Date(campaign.weight_history[campaign.weight_history.length - 1].date).toLocaleDateString()}`
              : 'Logged during initial setup'}
          </p>
        </div>

        {/* Target Goal Weight */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-[#22C55E] text-xs font-pixel mb-2 font-bold">
            <span>TARGET WEIGHT</span>
            <Trophy size={15} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono-app text-3xl font-bold text-[#0F172A]">
              {targetWeight}
            </span>
            <span className="text-xs font-mono-app text-[#64748B]">kg</span>
            <span className="text-[10px] font-pixel uppercase px-2 py-0.5 rounded bg-[#4ADE80]/15 text-[#16a34a] border border-[#4ADE80]/30 ml-2 font-bold">
              {user?.user_goal?.replace('_', ' ') || 'GOAL'}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-sans-app mt-2">
            {isWeightLoss ? 'Weight Loss Deficit Quest' : 'Hypertrophy Mass Quest'}
          </p>
        </div>
      </div>

      {/* Campaign Day Progress Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#8B7CFF]" />
            <span className="font-pixel text-xs text-[#0F172A] font-bold">
              WEEK {currentWeek} CYCLE PROGRESS
            </span>
          </div>
          <span className="font-mono-app text-xs font-bold text-[#8B7CFF]">
            Day {currentDay} of 7 Completed ({Math.round(((currentDay - 1) / 7) * 100)}%)
          </span>
        </div>

        {/* 7-Segment Progress Bar */}
        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
            const isCompleted = dayNum < currentDay;
            const isCurrent = dayNum === currentDay;

            return (
              <div key={dayNum} className="space-y-1 text-center">
                <div
                  className={`h-3 rounded-full transition-all ${
                    isCompleted
                      ? 'bg-[#22C55E]'
                      : isCurrent
                      ? 'bg-[#8B7CFF] animate-pulse'
                      : 'bg-[#F1F5F9] border border-slate-200'
                  }`}
                />
                <span
                  className={`font-pixel text-[9px] block ${
                    isCompleted
                      ? 'text-[#16a34a] font-bold'
                      : isCurrent
                      ? 'text-[#8B7CFF] font-bold'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  Day {dayNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Weigh-In Lock System Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Week 1 Status */}
        <div className="bg-white border border-[#4ADE80]/40 rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#4ADE80]/15 text-[#16a34a]">
                <Unlock size={16} />
              </span>
              <h3 className="font-pixel text-xs text-[#0F172A] font-bold">WEEK 1 PLAN UNLOCKED</h3>
            </div>
            <span className="font-pixel text-[9px] px-2 py-0.5 rounded bg-[#4ADE80]/15 text-[#16a34a] border border-[#4ADE80]/30 font-bold">
              ACTIVE CAMPAIGN
            </span>
          </div>

          <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
            Your Week 1 schedule features 7 unique daily meal varieties and split walking shifts.
          </p>

          <div className="pt-2">
            <button
              onClick={onNavigateToMeals}
              className="w-full py-2.5 px-4 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-[#8B7CFF] hover:text-[#7C3AED] font-pixel text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-bold"
            >
              <span>VIEW WEEK 1 MEALS & QUESTS</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Week 2 Status: Lock System */}
        <div
          className={`border rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden ${
            unlockedWeek >= 2
              ? 'bg-white border-[#4ADE80]/40'
              : 'bg-[#F8FAFC] border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-lg ${
                  unlockedWeek >= 2
                    ? 'bg-[#4ADE80]/15 text-[#16a34a]'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                {unlockedWeek >= 2 ? <Unlock size={16} /> : <Lock size={16} />}
              </span>
              <h3 className="font-pixel text-xs text-[#0F172A] font-bold">
                {unlockedWeek >= 2 ? 'WEEK 2 PLAN UNLOCKED' : 'WEEK 2 PLAN LOCKED 🔒'}
              </h3>
            </div>
            <span
              className={`font-pixel text-[9px] px-2 py-0.5 rounded font-bold ${
                unlockedWeek >= 2
                  ? 'bg-[#4ADE80]/15 text-[#16a34a] border border-[#4ADE80]/30'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              {unlockedWeek >= 2 ? 'UNLOCKED' : 'WEIGH-IN REQUIRED'}
            </span>
          </div>

          <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
            {unlockedWeek >= 2
              ? 'Congratulations! You unlocked Week 2 and received fresh meal varieties and progression XP!'
              : 'Complete Day 7 and record your weekly weigh-in to calculate metabolic adaptation and unlock Week 2 meal variety and workout progressions.'}
          </p>

          <div className="pt-2">
            {unlockedWeek >= 2 ? (
              <button
                onClick={onNavigateToMeals}
                className="w-full py-2.5 px-4 bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#16a34a] font-pixel text-[10px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer font-bold"
              >
                <span>WEEK 2 ACCESS GRANTED</span>
                <CheckCircle2 size={13} />
              </button>
            ) : (
              <button
                onClick={() => setShowWeighInModal(true)}
                className="w-full py-2.5 px-4 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8B7CFF]/25 cursor-pointer"
              >
                <Scale size={13} />
                <span>{isWeighInDue ? 'UNLOCK WEEK 2 VIA WEIGH-IN' : 'LOG WEIGH-IN EARLY'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weigh-In History Log */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-[#8B7CFF]" />
            <h3 className="font-pixel text-xs text-[#0F172A] font-bold">WEIGH-IN LOG HISTORY</h3>
          </div>
          <span className="text-[10px] font-mono-app text-[#64748B]">
            {campaign.weight_history?.length || 0} entries recorded
          </span>
        </div>

        {campaign.weight_history && campaign.weight_history.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {campaign.weight_history.map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs font-mono-app">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#F1F5F9] border border-slate-200 flex items-center justify-center text-[10px] font-pixel text-[#8B7CFF] font-bold">
                    W{log.week || idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-[#0F172A]">{log.weight_kg} kg</span>
                    {log.note && (
                      <p className="text-[11px] text-[#64748B] font-sans-app">{log.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right text-[#64748B] text-[11px]">
                  {new Date(log.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#F8FAFC] rounded-xl border border-slate-200 text-center space-y-2">
            <Scale size={24} className="mx-auto text-[#94A3B8]" />
            <p className="text-xs text-[#64748B] font-sans-app">
              No weekly weigh-ins recorded yet. Complete Day 7 to log your first milestone weigh-in!
            </p>
          </div>
        )}
      </div>

      {/* Interactive Weekly Weigh-In Modal */}
      {showWeighInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#8B7CFF]/15 text-[#8B7CFF]">
                  <Scale size={18} />
                </div>
                <h3 className="font-pixel text-xs sm:text-sm text-[#0F172A] font-bold">
                  WEEKLY MILESTONE WEIGH-IN
                </h3>
              </div>
              <button
                onClick={() => setShowWeighInModal(false)}
                className="text-[#64748B] hover:text-[#0F172A] cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
              Logging your weekly weigh-in registers your campaign progress, awards{' '}
              <span className="text-[#8B7CFF] font-bold">+300 Milestone XP</span>, and unlocks the next week's AI meal variety!
            </p>

            <form onSubmit={handleWeighInSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-pixel text-[#64748B] mb-1.5 uppercase font-bold">
                  Current Weight (KG)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 focus:border-[#8B7CFF] rounded-xl text-lg font-mono-app font-bold text-[#0F172A] focus:outline-none"
                    placeholder="e.g. 74.5"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono-app text-xs text-[#64748B]">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-pixel text-[#64748B] mb-1.5 uppercase font-bold">
                  Weekly Reflection / Notes (Optional)
                </label>
                <textarea
                  value={weighInNote}
                  onChange={(e) => setWeighInNote(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-200 focus:border-[#8B7CFF] rounded-xl text-xs font-sans-app text-[#0F172A] focus:outline-none resize-none"
                  placeholder="e.g., Felt energetic this week, hit all evening walking shifts!"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWeighInModal(false)}
                  className="px-4 py-2 bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 rounded-xl font-pixel text-[10px] text-[#64748B] cursor-pointer"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingWeighIn}
                  className="px-5 py-2.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-[11px] font-bold rounded-xl shadow-md shadow-[#8B7CFF]/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>{isSubmittingWeighIn ? 'SAVING...' : 'CONFIRM & UNLOCK NEXT WEEK'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressScreen;
