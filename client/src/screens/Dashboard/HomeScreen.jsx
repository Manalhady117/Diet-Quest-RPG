import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import GamifiedReminder from '../../components/Notifications/GamifiedReminder.jsx';
import {
  Droplet,
  Footprints,
  Shield,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Plus,
  Activity,
  HeartPulse,
  ChevronDown,
  ChevronUp,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const HomeScreen = ({
  onNavigateToQuests,
  onNavigateToShop,
  onNavigateToDiet,
  onNavigateToCampaign,
  onNavigateToDaily,
  onNavigateToWeekly
}) => {
  const { user } = useAuth();
  const { dayProgress } = useUser();
  const { t, isRTL } = useLanguage();
  const {
    stats,
    inventory,
    quests,
    dietPlan,
    mascotState,
    logWater,
    logWalkBonus,
    completeQuest,
    claimQuest,
    updateQuestProgress,
    notify
  } = useGame();

  const [showSecondaryTelemetry, setShowSecondaryTelemetry] = useState(false);

  const [isDrinking, setIsDrinking] = useState(false);

  // Dynamic Calorie calculations from DB user metrics, diet plan, and global dayProgress
  const targetCalories = user?.metrics?.caloric_target || 1879;
  const currentDay = user?.currentActiveDay || user?.campaign?.current_day || 1;
  const daySchedule = (dietPlan?.week_schedule || user?.diet_plan?.week_schedule)?.find((s) => s.day === Number(currentDay));
  const activeMeals = daySchedule?.meals || dietPlan?.meals || user?.diet_plan?.meals || [];
  const claimedFromMeals = activeMeals
    .filter((m) => m.isClaimed || m.claimed || dayProgress?.claimedMealIds?.includes(m.id))
    .reduce((sum, m) => sum + (Number(m.calories) || Number(m.kcal) || 0), 0);
  const consumedCalories = Math.max(claimedFromMeals, dayProgress?.consumedCalories || 0);
  const calPercent = targetCalories > 0 ? Math.min(100, Math.round((consumedCalories / targetCalories) * 100)) : 0;

  // Dynamic Walking metrics from stats and quests
  const [morningWalkKm, setMorningWalkKm] = useState(0.0);
  const [eveningWalkKm, setEveningWalkKm] = useState(0.0);
  const [waterCups, setWaterCups] = useState(0);

  // Ensure state always starts at 0 unless explicitly returned from fresh DB records
  React.useEffect(() => {
    if (stats && stats.water_current_ml !== undefined) {
      setWaterCups(Math.max(0, Math.floor(stats.water_current_ml / 250)));
    } else {
      setWaterCups(0); // Strict default to 0
    }
  }, [stats?.water_current_ml]);

  React.useEffect(() => {
    const morningQuest = quests?.find(q => q.title?.toLowerCase().includes('morning walk'));
    const eveningQuest = quests?.find(q => q.title?.toLowerCase().includes('evening walk'));
    if (morningQuest && morningQuest.progress !== undefined) {
      setMorningWalkKm(Number(morningQuest.progress) || 0.0);
    } else {
      setMorningWalkKm(0.0); // Strict default to 0
    }
    if (eveningQuest && eveningQuest.progress !== undefined) {
      setEveningWalkKm(Number(eveningQuest.progress) || 0.0);
    } else {
      setEveningWalkKm(0.0); // Strict default to 0
    }
  }, [quests]);

  // Goal text mapping
  const goalKey = user?.user_goal === 'weight_loss'
    ? t('goal.weight_loss')
    : user?.user_goal === 'weight_gain'
    ? t('goal.weight_gain')
    : t('goal.weight_maintenance');

  // Water Tracker: 8 cups target from real DB stats
  const currentML = waterCups * 250;
  const currentCups = waterCups;

  const handleCupClick = async (cupIndex) => {
    if (cupIndex < currentCups && currentCups < 8) {
      notify(`Cup ${cupIndex + 1} already consumed!`, 'info');
      return;
    }
    if (isDrinking) return;
    setIsDrinking(true);
    try {
      await logWater(250);
      if (cupIndex >= 7) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrinking(false);
    }
  };

  const handleWalkLog = async (type) => {
    if (type === 'morning') {
      const morningQuest = quests?.find(q => q.title?.toLowerCase().includes('morning walk'));
      if (morningQuest) {
        try {
          await updateQuestProgress(morningQuest.id, 0.5, true);
        } catch (e) {}
      }
      const prev = morningWalkKm;
      const nextVal = +(prev + 0.5).toFixed(1);
      setMorningWalkKm(nextVal);

      // Over-achievement bonus: if walking steps exceed target (> 3.0 km), reward +20 Coins / +50 XP per extra 1.0 km
      if (nextVal > 3.0 && Math.floor(nextVal - 3.0) > Math.floor(prev - 3.0)) {
        if (typeof logWalkBonus === 'function') {
          await logWalkBonus(1.0);
        } else {
          notify('Bonus Earned! 🎉 You surpassed your daily goal!', 'success');
        }
      } else {
        notify('Morning walk progress logged! +15 XP', 'success');
      }
    } else {
      const eveningQuest = quests?.find(q => q.title?.toLowerCase().includes('evening walk'));
      if (eveningQuest) {
        try {
          await updateQuestProgress(eveningQuest.id, 0.5, true);
        } catch (e) {}
      }
      const prev = eveningWalkKm;
      const nextVal = +(prev + 0.5).toFixed(1);
      setEveningWalkKm(nextVal);

      // Over-achievement bonus: if walking steps exceed target (> 3.0 km), reward +20 Coins / +50 XP per extra 1.0 km
      if (nextVal > 3.0 && Math.floor(nextVal - 3.0) > Math.floor(prev - 3.0)) {
        if (typeof logWalkBonus === 'function') {
          await logWalkBonus(1.0);
        } else {
          notify('Bonus Earned! 🎉 You surpassed your daily goal!', 'success');
        }
      } else {
        notify('Evening walk progress logged! +15 XP', 'success');
      }
    }
  };

  // Render exactly 3 active quest cards for today's active quests
  const activeQuests = quests.slice(0, 3);

  return (
    <div className="p-4 space-y-3 max-w-5xl mx-auto animate-in fade-in select-none">
      {/* Gamified Push Reminder */}
      <GamifiedReminder
        onAction={(tab) => {
          if (tab === 'diet' && onNavigateToDiet) onNavigateToDiet();
          if (tab === 'quests' && onNavigateToQuests) onNavigateToQuests();
          if (tab === 'campaign' && onNavigateToCampaign) onNavigateToCampaign();
        }}
      />

      {/* 1. TOP BANNER: Mascot & Goal (Hero Character Card) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        {/* Left Column (90px): Mascot Avatar Box */}
        <div className="w-[90px] h-[90px] rounded-xl bg-[#8B7CFF]/10 border border-[#8B7CFF]/20 flex items-center justify-center shrink-0">
          <div className="w-[80px] h-[80px] flex items-center justify-center">
            <PixelMascot state={mascotState || 'idle'} size={64} />
          </div>
        </div>

        {/* Right Column: Target Metrics & Progress */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-between py-1">
          {/* Row 1: Target Goal Tag & Character Level */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#3B82F6]/15 text-[#3B82F6] font-pixel truncate">
              {goalKey}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-pixel font-bold px-2 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF]">
                Lvl {stats?.level || 4}
              </span>
              <span className="text-[11px] font-mono-app font-bold text-[#1E293B]">
                {stats?.hp_current || 100}/{stats?.hp_max || 100} HP
              </span>
            </div>
          </div>

          {/* Row 2: Calorie Progress Bar (1,200 / 1,792 kcal) */}
          <div className="calories-tracker space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono-app">
              <span className="text-[#64748B] font-medium">{t('cal.label')}:</span>
              <span className="font-bold text-[#1E293B]">
                {consumedCalories.toLocaleString()} / {targetCalories.toLocaleString()} kcal
              </span>
            </div>

            {/* 10px High Progress Bar */}
            <div className="h-[10px] w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
              <div
                className="h-full bg-gradient-to-r from-[#8B7CFF] to-[#3B82F6] rounded-full transition-all duration-500"
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: 2-Column Grid (12px gap, ~155px card height) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Card: 💧 Water Tracker */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm h-[160px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">💧</span>
              <h3 className="font-pixel text-[14px] text-[#1E293B] font-bold truncate">
                {t('water.title')}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`font-mono-app text-xs font-bold px-2 py-0.5 rounded-md ${
                currentCups > 8
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'text-[#3B82F6] bg-[#3B82F6]/10'
              }`}>
                {currentCups} / 8 Cups {currentCups > 8 ? '🎉' : ''}
              </span>
              {currentCups >= 8 && (
                <button
                  type="button"
                  onClick={() => handleCupClick(currentCups)}
                  disabled={isDrinking}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all cursor-pointer shadow-xs shrink-0"
                  title="Drink extra water (+5 Coins bonus!)"
                >
                  +1 Cup (+5 🪙)
                </button>
              )}
            </div>
          </div>

          {/* 4x2 Grid of 8 Cups (24x24px each) */}
          <div className="grid grid-cols-4 gap-2.5 my-auto justify-items-center">
            {Array.from({ length: 8 }, (_, i) => {
              const isFilled = i < currentCups;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCupClick(i)}
                  disabled={isDrinking}
                  title={`Cup ${i + 1} (+10 XP)`}
                  className={`w-6 h-6 w-[24px] h-[24px] rounded-md flex items-center justify-center transition-all cursor-pointer ${
                    isFilled
                      ? 'bg-[#38BDF8] text-white shadow-xs scale-105'
                      : 'bg-[#F1F5F9] text-slate-400 hover:bg-[#38BDF8]/20 border border-slate-200'
                  }`}
                >
                  <Droplet size={13} className={isFilled ? 'fill-white' : ''} />
                </button>
              );
            })}
          </div>

          {/* Bottom XP hint */}
          <div className="flex items-center justify-between text-[11px] text-[#64748B] font-sans-app pt-1 border-t border-slate-100">
            <span>+10 XP per cup</span>
            <span className="text-[#3B82F6] font-mono-app font-semibold">
              {(currentCups * 250)} / 2000 mL
            </span>
          </div>
        </div>

        {/* Right Card: 🏃 Movement Tracker (Split Walking Quest) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm h-[160px] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏃</span>
              <h3 className="font-pixel text-[14px] text-[#1E293B] font-bold truncate">
                {t('movement.title')}
              </h3>
            </div>
            <span className="text-[11px] font-pixel text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded-md font-bold">
              3.0 km Target
            </span>
          </div>

          <div className="space-y-2 my-auto">
            {/* Morning Walk Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono-app">
                <span className="text-[#64748B]">{t('movement.morning')}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1E293B]">{morningWalkKm} / 3.0 km</span>
                  <button
                    type="button"
                    onClick={() => handleWalkLog('morning')}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-[#8B7CFF] hover:text-white transition-colors cursor-pointer text-[#64748B]"
                  >
                    +0.5
                  </button>
                </div>
              </div>
              <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div
                  className="h-full bg-[#4ADE80] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (morningWalkKm / 3.0) * 100)}%` }}
                />
              </div>
            </div>

            {/* Evening Walk Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono-app">
                <span className="text-[#64748B]">{t('movement.evening')}</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1E293B]">{eveningWalkKm} / 3.0 km</span>
                  <button
                    type="button"
                    onClick={() => handleWalkLog('evening')}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-[#8B7CFF] hover:text-white transition-colors cursor-pointer text-[#64748B]"
                  >
                    +0.5
                  </button>
                </div>
              </div>
              <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                <div
                  className="h-full bg-[#38BDF8] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (eveningWalkKm / 3.0) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#64748B] font-sans-app pt-1 border-t border-slate-100 truncate">
            {t('notify.steps')}
          </div>
        </div>
      </div>

      {/* 2.5 COLLAPSIBLE CARD: Secondary Stats & Character Buffs */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowSecondaryTelemetry(!showSecondaryTelemetry)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-sans-app font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-[#8B7CFF]" />
            <span>Character Vitals & Active Buffs</span>
            <span className="text-[10px] text-slate-400 font-mono-app font-normal">
              (BPM, Energy Core, Inventory Items)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#8B7CFF] font-pixel">
            <span>{showSecondaryTelemetry ? 'COLLAPSE' : 'EXPAND'}</span>
            {showSecondaryTelemetry ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </button>

        {showSecondaryTelemetry && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-3 bg-[#F8FAFC]/50 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-sans-app">
              {/* Heart Rate BPM */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-pixel text-slate-500 mb-1 flex items-center gap-1">
                  <HeartPulse size={12} className="text-red-500" /> RESTING BPM
                </div>
                <div className="font-mono-app text-sm font-bold text-slate-900">
                  {stats?.bpm_current || 74} <span className="text-[10px] font-normal text-slate-500">bpm</span>
                </div>
              </div>

              {/* Energy Core Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-pixel text-slate-500 mb-1 flex items-center gap-1">
                  <Sparkles size={12} className="text-cyan-500" /> ENERGY CORE
                </div>
                <div className="font-mono-app text-sm font-bold text-cyan-700">
                  {stats?.energy_bar || 50}%
                </div>
              </div>

              {/* Aegis Shield Buff */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-pixel text-slate-500 mb-1 flex items-center gap-1">
                  <Shield size={12} className="text-emerald-500" /> AEGIS SHIELD
                </div>
                <div className="font-mono-app text-xs font-bold text-emerald-700">
                  {stats?.active_shield_until ? 'ACTIVE (Protected)' : `${inventory?.shields || 0} Ready`}
                </div>
              </div>

              {/* Speed Potions & Passes */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="text-[10px] font-pixel text-slate-500 mb-1 flex items-center gap-1">
                  <Package size={12} className="text-purple-500" /> POTIONS & PASSES
                </div>
                <div className="font-mono-app text-xs font-bold text-purple-700">
                  {inventory?.speedPotions || 0} Potions • {inventory?.cheatMealPasses || 0} Passes
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM SECTION: Quick Quest Log (Today's Active Quests) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-pixel text-[16px] text-[#1E293B] font-bold">
            {t('hud.todays_active_quests')}
          </h2>
          {onNavigateToQuests && (
            <button
              type="button"
              onClick={onNavigateToQuests}
              className="text-xs font-pixel text-[#8B7CFF] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>{t('hud.view_all_quests')}</span>
              <ChevronRight size={13} />
            </button>
          )}
        </div>

        {/* Exactly 3 active quest cards (Height: ~80px each, compact layout) */}
        <div className="space-y-2">
          {activeQuests.map((quest) => {
            const isCompleted = quest.completed || quest.claimed;
            const progress = quest.progress || 0;
            const max = quest.maxProgress || 1;
            const pct = Math.min(100, Math.round((progress / max) * 100));

            return (
              <div
                key={quest.id}
                className="bg-white border border-[#E2E8F0] hover:border-[#8B7CFF]/40 transition-all rounded-2xl p-3 shadow-sm h-[80px] flex items-center justify-between gap-3"
              >
                {/* Left: Quest Type & Title */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-pixel font-bold px-2 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] uppercase shrink-0">
                      {quest.type || 'MAIN'}
                    </span>
                    <span className="text-xs font-mono-app font-bold text-[#b45309] shrink-0">
                      +{quest.baseXP || 150} XP
                    </span>
                  </div>

                  <h4 className="font-pixel text-xs text-[#1E293B] font-bold truncate">
                    {quest.title}
                  </h4>

                  {/* 8px Compact Progress Bar */}
                  <div className="h-1.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-slate-200 mt-1.5 max-w-[280px]">
                    <div
                      className="h-full bg-[#8B7CFF] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Right: Action Button */}
                <div className="shrink-0 flex items-center">
                  {quest.claimed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-pixel text-[#16a34a] font-bold px-3 py-1.5 bg-[#4ADE80]/15 rounded-xl border border-[#4ADE80]/30">
                      <CheckCircle2 size={13} />
                      <span>{t('action.claimed')}</span>
                    </span>
                  ) : quest.completed ? (
                    <button
                      type="button"
                      onClick={() => claimQuest(quest.id)}
                      className="h-8 px-3 rounded-xl bg-[#4ADE80] hover:bg-[#38c168] text-[#064e3b] font-pixel text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                    >
                      {t('action.claim_xp', { xp: quest.baseXP || 150 })}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => completeQuest(quest.id)}
                      className="h-8 px-3 rounded-xl bg-[#8B7CFF] hover:bg-[#7866f5] text-white font-pixel text-[11px] font-bold cursor-pointer transition-all shadow-xs"
                    >
                      {t('action.mark_complete')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
