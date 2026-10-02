import React from 'react';
import { PixelIcon } from '../Mascot/PixelMascot.jsx';
import { Shield, AlertCircle } from 'lucide-react';

export const HealthBar = ({ hp = 100, maxHp = 100, activeShieldUntil = null, isFainted = false }) => {
  const percentage = Math.max(0, Math.min(100, Math.round((hp / maxHp) * 100)));
  const isShielded = activeShieldUntil && new Date(activeShieldUntil) > new Date();

  // Color dynamics: vibrant Mint Green (#4ADE80) when healthy, orange when medium, Coral Red (#FF6B6B) when low
  const barColor = percentage > 50 ? 'bg-[#4ADE80]' : percentage > 25 ? 'bg-[#F59E0B]' : 'bg-[#FF6B6B]';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#FF6B6B]/15 rounded-2xl flex items-center justify-center text-[#FF6B6B]">
            <PixelIcon name="heart" size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[11px] uppercase text-[#1E293B] tracking-wider font-bold">Health Points</span>
              {isShielded && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4ADE80]/15 text-[#15803d] rounded-full text-[9px] font-pixel">
                  <Shield size={10} /> SHIELD
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] font-sans-app">Starts 100 HP every dawn</p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-pixel text-xs text-[#1E293B] font-bold">
            {hp} <span className="text-[#94A3B8] text-[10px]">/ {maxHp} HP</span>
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
        {/* Fill */}
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          {/* Scanline shine overlay */}
          <div className="absolute inset-0 bg-white/30 rounded-full" />
        </div>

        {/* Shielded glowing border effect */}
        {isShielded && (
          <div className="absolute inset-0 border-2 border-[#4ADE80] rounded-full animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Status Warning if critical */}
      {percentage <= 25 && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#FF6B6B] font-medium animate-pulse">
          <AlertCircle size={13} />
          <span>Critical HP! Drink water or complete a recovery walk to heal.</span>
        </div>
      )}
    </div>
  );
};

export default HealthBar;
