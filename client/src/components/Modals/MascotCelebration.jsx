import React, { useEffect } from 'react';
import { PixelMascot } from '../Mascot/PixelMascot.jsx';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, X } from 'lucide-react';

export const MascotCelebration = ({ isOpen, onClose, message, bonusXP = 200 }) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-2xl text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#8B7CFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#4ADE80]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Floating Stars Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B7CFF]/10 border border-[#8B7CFF]/30 rounded-full text-[#8B7CFF] text-xs font-pixel mb-3 font-bold">
          <Sparkles size={13} />
          <span>GOAL ACHIEVED!</span>
          <Sparkles size={13} />
        </div>

        {/* Animated Celebrating Mascot */}
        <div className="my-3 flex justify-center scale-110">
          <div className="p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <PixelMascot state="celebrate" size={90} />
          </div>
        </div>

        {/* Victory Headline */}
        <h3 className="font-pixel text-base text-[#0F172A] font-bold mt-2 mb-2 leading-relaxed">
          WALKING MILESTONE UNLOCKED!
        </h3>

        {/* Randomized encouraging text */}
        <p className="text-xs sm:text-sm text-[#64748B] font-sans-app bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 my-3 leading-relaxed">
          {message || 'You did it! Your feet walked a massive distance today! 🌟 Your character grew stronger!'}
        </p>

        {/* XP Loot Banner */}
        <div className="flex items-center justify-center gap-2 p-2.5 bg-[#4ADE80]/15 border border-[#4ADE80]/40 rounded-xl mb-5">
          <Trophy size={18} className="text-[#22C55E]" />
          <span className="font-pixel text-xs text-[#22C55E] font-bold">
            +{bonusXP} XP ADDED & ENERGY 100%
          </span>
        </div>

        {/* Claim / Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8B7CFF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-pixel text-xs rounded-xl shadow-md shadow-[#8B7CFF]/25 font-bold transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CLAIM REWARD & KEEP WALKING!</span>
        </button>
      </div>
    </div>
  );
};

export default MascotCelebration;
