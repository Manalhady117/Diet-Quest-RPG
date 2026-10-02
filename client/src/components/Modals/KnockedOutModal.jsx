import React, { useState } from 'react';
import { PixelMascot } from '../Mascot/PixelMascot.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Shield, Sparkles, Footprints, Droplets, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const KnockedOutModal = ({ isOpen, onResurrect, isResurrecting = false }) => {
  const { t, isRTL } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('walk');

  if (!isOpen) return null;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#FF6B6B]/40 relative overflow-hidden space-y-5">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Status Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B] text-xs font-pixel">
            <HeartHandshake size={14} />
            <span>{t('resurrect.title')}</span>
          </div>

          <div className="flex justify-center py-2">
            <PixelMascot state="damage" size={88} />
          </div>

          <h3 className="font-pixel text-lg sm:text-xl text-[#1E293B]">
            {t('resurrect.subtitle')}
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] font-sans-app max-w-md mx-auto leading-relaxed">
            {t('resurrect.explanation')}
          </p>
        </div>

        {/* Resurrect Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
          {/* Option 1: 15-Minute Recovery Walk */}
          <div
            onClick={() => setSelectedMethod('walk')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedMethod === 'walk'
                ? 'bg-[#8B7CFF]/10 border-[#8B7CFF] shadow-md shadow-[#8B7CFF]/10'
                : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#8B7CFF]/20 text-[#8B7CFF] flex items-center justify-center mb-2.5">
                <Footprints size={20} />
              </div>
              <h4 className="font-pixel text-xs text-[#1E293B] mb-1">
                {t('resurrect.walk_title')}
              </h4>
              <p className="text-[11px] text-[#64748B] font-sans-app leading-snug">
                {t('resurrect.walk_desc')}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-pixel text-[#4ADE80]">
              <CheckCircle2 size={13} />
              <span>+100 HP RESTORE</span>
            </div>
          </div>

          {/* Option 2: Sacred Revitalizing Water */}
          <div
            onClick={() => setSelectedMethod('water')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedMethod === 'water'
                ? 'bg-[#38BDF8]/10 border-[#38BDF8] shadow-md shadow-[#38BDF8]/10'
                : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center mb-2.5">
                <Droplets size={20} />
              </div>
              <h4 className="font-pixel text-xs text-[#1E293B] mb-1">
                {t('resurrect.potion_title')}
              </h4>
              <p className="text-[11px] text-[#64748B] font-sans-app leading-snug">
                {t('resurrect.potion_desc')}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[10px] font-pixel text-[#4ADE80]">
              <CheckCircle2 size={13} />
              <span>+100 HP RESTORE</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 relative z-10">
          <button
            type="button"
            disabled={isResurrecting}
            onClick={() => onResurrect(selectedMethod === 'walk' ? 'recovery_walk' : 'sacred_water')}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-[#8B7CFF] to-[#FF7EB6] hover:brightness-105 active:scale-[0.99] text-white font-pixel text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-[#8B7CFF]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>
              {isResurrecting
                ? 'RESURRECTING...'
                : selectedMethod === 'walk'
                ? t('resurrect.walk_btn')
                : t('resurrect.potion_btn')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnockedOutModal;
