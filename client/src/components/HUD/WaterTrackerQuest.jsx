import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Droplets, Sparkles, CheckCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const WaterTrackerQuest = () => {
  const { stats, logWater, notify } = useGame();
  const { t, isRTL } = useLanguage();
  const [isDrinking, setIsDrinking] = useState(false);

  // Each cup is 250 mL, target is 8 cups (2,000 mL)
  const currentML = stats?.water_current_ml || 0;
  const currentCups = Math.min(8, Math.floor(currentML / 250));
  const isComplete = currentCups >= 8;

  const handleCupClick = async (cupIndex) => {
    if (cupIndex < currentCups) {
      // Cup already drunk
      notify(`Cup ${cupIndex + 1} already consumed!`, 'info');
      return;
    }
    if (isDrinking) return;

    setIsDrinking(true);
    try {
      await logWater(250);
      if (cupIndex === 7) {
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

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 relative overflow-hidden space-y-4">
      {/* Background Soft Sky Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center font-bold">
            <Droplets size={22} className="animate-bounce" />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm text-[#1E293B] flex items-center gap-2">
              <span>{t('water.title')}</span>
              {isComplete && (
                <span className="px-2 py-0.5 rounded-full bg-[#4ADE80]/15 text-[#15803d] text-[10px] font-pixel">
                  100% COMPLETE
                </span>
              )}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#64748B] font-sans-app">
              {t('water.subtitle')}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-pixel text-xs sm:text-sm text-[#38BDF8] font-bold">
            {currentCups} / 8
          </span>
          <p className="text-[10px] text-[#64748B] font-sans-app">
            {currentML} mL
          </p>
        </div>
      </div>

      {/* 8-Cup Interactive Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 relative z-10 pt-1">
        {[...Array(8)].map((_, i) => {
          const isFilled = i < currentCups;
          const isNext = i === currentCups;

          return (
            <button
              key={i}
              type="button"
              disabled={isDrinking || isFilled}
              onClick={() => handleCupClick(i)}
              title={isFilled ? `Cup ${i + 1} Drank` : t('water.cup_tooltip', { index: i + 1 })}
              className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                isFilled
                  ? 'bg-gradient-to-b from-[#38BDF8]/20 to-[#38BDF8]/30 border-[#38BDF8] shadow-sm shadow-[#38BDF8]/20 scale-[0.98]'
                  : isNext
                  ? 'bg-white border-[#38BDF8] shadow-md shadow-[#38BDF8]/15 hover:scale-105 animate-pulse'
                  : 'bg-[#F8FAFC] border-slate-200 hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/5'
              }`}
            >
              {/* Cup Visual */}
              <div className="relative w-8 h-10 flex items-end justify-center">
                {/* Cup outline shape */}
                <div
                  className={`w-7 rounded-b-lg border-2 transition-all relative overflow-hidden ${
                    isFilled
                      ? 'h-9 border-[#0284c7] bg-[#38BDF8]'
                      : 'h-9 border-slate-300 bg-slate-100 group-hover:border-[#38BDF8]'
                  }`}
                >
                  {/* Water fill animation */}
                  {isFilled && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0284c7] to-[#38BDF8] opacity-90 flex items-center justify-center">
                      <Sparkles size={11} className="text-white animate-spin opacity-80" />
                    </div>
                  )}
                </div>
              </div>

              {/* Label & Status */}
              <div className="mt-2 text-center">
                <span
                  className={`font-pixel text-[10px] block ${
                    isFilled ? 'text-[#0284c7] font-bold' : 'text-[#64748B]'
                  }`}
                >
                  {isFilled ? '✓ 250ml' : `+10 XP`}
                </span>
                <span className="text-[9px] text-[#94A3B8] font-sans-app">
                  #{i + 1}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Banner or Progress Hint */}
      <div className="pt-1">
        {isComplete ? (
          <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#15803d] text-xs font-pixel">
            <Award size={16} className="shrink-0" />
            <span>{t('water.full_hydration')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-[#64748B] font-sans-app bg-[#F8FAFC] px-3.5 py-2 rounded-2xl border border-slate-100">
            <span>{t('water.logged_cups', { count: currentCups })}</span>
            <button
              type="button"
              disabled={isDrinking}
              onClick={() => handleCupClick(currentCups)}
              className="inline-flex items-center gap-1 text-[11px] font-pixel text-[#38BDF8] hover:text-[#0284c7] font-bold cursor-pointer"
            >
              <Droplets size={13} />
              <span>{t('water.quick_drink')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterTrackerQuest;
