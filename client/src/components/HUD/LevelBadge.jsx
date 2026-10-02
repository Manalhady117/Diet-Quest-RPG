import React from 'react';
import { PixelIcon } from '../Mascot/PixelMascot.jsx';
import { Flame, Sparkles, Award } from 'lucide-react';

export const LevelBadge = ({
  level = 1,
  totalXP = 0,
  streakCount = 5,
  streakMultiplier = 1.5
}) => {
  const currentLevelProgressXP = totalXP % 1000;
  const progressPct = Math.round((currentLevelProgressXP / 1000) * 100);
  const isBuffed = streakCount >= 5;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-2.5">
        {/* Level Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FACC15] to-[#FF7EB6] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center">
              <span className="font-pixel text-[8px] text-[#8B7CFF] uppercase leading-none">LVL</span>
              <span className="font-pixel text-xs text-[#1E293B] font-bold mt-0.5">{level}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[11px] uppercase text-[#1E293B] tracking-wider font-bold">
                Adventurer Rank
              </span>
              {isBuffed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FF7EB6]/15 text-[#e11d48] rounded-full text-[9px] font-pixel">
                  <Flame size={10} className="fill-[#FF7EB6]" />
                  1.5X STREAK
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] font-sans-app flex items-center gap-1">
              <Sparkles size={12} className="text-[#FACC15]" />
              <span>{totalXP.toLocaleString()} Total XP</span>
            </p>
          </div>
        </div>

        {/* Streak Counter */}
        <div className="bg-[#F0F4F9] border border-slate-200 px-3 py-1.5 rounded-2xl text-right">
          <div className="flex items-center gap-1 text-[#ea580c]">
            <Flame size={14} className="fill-[#ea580c]" />
            <span className="font-pixel text-[11px] font-bold">{streakCount} Days</span>
          </div>
          <span className="text-[9px] text-[#64748B] font-sans-app block">Active Streak</span>
        </div>
      </div>

      {/* Progress to next level bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono-app text-[#64748B]">
          <span>Level {level + 1} Progress</span>
          <span className="text-[#8B7CFF] font-semibold">{currentLevelProgressXP} / 1000 XP</span>
        </div>

        <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-[#FACC15] via-[#FF7EB6] to-[#8B7CFF] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelBadge;
