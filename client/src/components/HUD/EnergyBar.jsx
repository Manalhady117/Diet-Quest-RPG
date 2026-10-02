import React from 'react';
import { PixelIcon } from '../Mascot/PixelMascot.jsx';
import { Droplet, Footprints, Zap } from 'lucide-react';

export const EnergyBar = ({
  energy = 0,
  waterCurrent = 0,
  waterTarget = 3000,
  stepsCurrent = 0,
  stepsTarget = 8000
}) => {
  const waterPct = Math.min(100, Math.round((waterCurrent / (waterTarget || 3000)) * 100));
  const stepsPct = Math.min(100, Math.round((stepsCurrent / (stepsTarget || 8000)) * 100));

  const waterContribution = Math.round((waterPct / 100) * 50);
  const stepsContribution = Math.round((stepsPct / 100) * 50);
  const calculatedTotal = Math.min(100, waterContribution + stepsContribution);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#38BDF8]/15 rounded-2xl flex items-center justify-center text-[#0284c7]">
            <Zap size={18} className="fill-[#38BDF8]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[11px] uppercase text-[#1E293B] tracking-wider font-bold">Energy Core</span>
              <span className="text-[9px] bg-[#38BDF8]/15 text-[#0284c7] px-2 py-0.5 rounded-full font-pixel">
                50% Water + 50% Steps
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans-app">Dynamic habit momentum</p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-pixel text-xs text-[#0284c7] font-bold">
            {energy || calculatedTotal}% <span className="text-[#94A3B8] text-[10px]">PWR</span>
          </span>
        </div>
      </div>

      {/* Main Energy Bar */}
      <div className="relative h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5 mb-3">
        <div
          className="h-full bg-gradient-to-r from-[#38BDF8] to-[#8B7CFF] rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${energy || calculatedTotal}%` }}
        >
          <div className="absolute inset-0 bg-white/30 rounded-full" />
        </div>
      </div>

      {/* Breakdown Dual Sub-meters */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
        {/* Water component */}
        <div className="bg-[#F0F4F9] rounded-2xl p-2.5 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#0284c7]">
            <Droplet size={13} className="fill-[#38BDF8]" />
            <span className="font-medium">Hydration</span>
          </div>
          <span className="font-mono-app text-[#1E293B] text-[10px] font-semibold">
            {waterCurrent} <span className="text-[#94A3B8]">/{waterTarget}ml</span>
          </span>
        </div>

        {/* Steps component */}
        <div className="bg-[#F0F4F9] rounded-2xl p-2.5 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#16a34a]">
            <Footprints size={13} />
            <span className="font-medium">Walking</span>
          </div>
          <span className="font-mono-app text-[#1E293B] text-[10px] font-semibold">
            {stepsCurrent.toLocaleString()} <span className="text-[#94A3B8]">/{stepsTarget.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnergyBar;
