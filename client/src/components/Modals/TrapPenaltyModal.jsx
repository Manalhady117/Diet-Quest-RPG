import React from 'react';
import { PixelMascot } from '../Mascot/PixelMascot.jsx';
import { AlertTriangle, Footprints, X } from 'lucide-react';

export const TrapPenaltyModal = ({ isOpen, onClose, xpDeducted = 300, onAcceptRecovery }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-2xl text-center overflow-hidden">
        {/* Background danger glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#FF5252]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-[#94A3B8] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Warning Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-full text-[#dc2626] text-xs font-pixel mb-3 font-bold">
          <AlertTriangle size={13} />
          <span>TRAP TRIGGERED!</span>
        </div>

        {/* Damaged Mascot Visual */}
        <div className="my-2 flex justify-center scale-110">
          <div className="p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <PixelMascot state="damage" size={85} />
          </div>
        </div>

        <h3 className="font-pixel text-sm text-[#dc2626] font-bold mt-2 mb-2 leading-relaxed">
          UNPLANNED FAST FOOD TRAP!
        </h3>

        {/* Penalty Stat Box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 my-3">
          <span className="font-pixel text-sm text-[#dc2626] font-bold block mb-1">
            -{xpDeducted} XP PENALTY
          </span>
          <p className="text-xs text-[#64748B] font-sans-app">
            Greasy unapproved calories damaged your stamina and triggered a negative debuff!
          </p>
        </div>

        {/* Mandatory Recovery Quest Directive */}
        <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-xl p-3 mb-5 text-left flex items-start gap-2.5">
          <div className="p-2 bg-[#4ADE80]/20 rounded-lg text-[#22C55E] shrink-0 mt-0.5">
            <Footprints size={18} />
          </div>
          <div>
            <span className="font-pixel text-[10px] text-[#22C55E] font-bold uppercase block">
              MANDATORY RECOVERY QUEST DEPLOYED
            </span>
            <p className="text-xs text-[#0F172A] font-sans-app mt-0.5">
              Walk briskly for <strong>20 minutes</strong> to purge the debuff and restore your hero's honor!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (onAcceptRecovery) onAcceptRecovery();
            onClose();
          }}
          className="w-full py-3.5 px-4 bg-[#FF5252] hover:bg-[#DC2626] text-white font-pixel text-xs rounded-xl shadow-md shadow-[#FF5252]/25 font-bold transition-transform active:scale-95 cursor-pointer"
        >
          ACCEPT RECOVERY QUEST & RESUME
        </button>
      </div>
    </div>
  );
};

export default TrapPenaltyModal;
