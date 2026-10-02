import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { CheckCircle2, Swords, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

export const QuestCard = ({ quest, streakMultiplier = 1.0, onComplete, onClaim, onProgress, onUpdateProgress }) => {
  const { id, title, description, type, baseXP = 150, progress = 0, maxProgress = 1, unit, completed, claimed } = quest;
  const { t } = useLanguage();

  const earnedXP = Math.round(baseXP * streakMultiplier);

  // Type styling
  const getTypeBadge = () => {
    switch (type) {
      case 'boss':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] text-[9px] font-pixel font-bold uppercase truncate">
            <Swords size={10} /> BOSS
          </span>
        );
      case 'side':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#0284c7] text-[9px] font-pixel font-bold uppercase truncate">
            SIDE QUEST
          </span>
        );
      case 'recovery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#4ADE80]/15 text-[#15803d] text-[9px] font-pixel font-bold uppercase truncate">
            <ShieldAlert size={10} /> RECOVERY
          </span>
        );
      case 'main':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FACC15]/20 text-[#b45309] text-[9px] font-pixel font-bold uppercase truncate">
            MAIN QUEST
          </span>
        );
    }
  };

  const pct = Math.min(100, Math.round((progress / (maxProgress || 1)) * 100));

  return (
    <div className="bg-white border border-[#E2E8F0] hover:border-[#8B7CFF]/40 transition-all rounded-2xl p-4 shadow-sm h-[190px] flex flex-col justify-between select-none">
      {/* 1. Top Row: Quest Type Badge (Top-Left) | XP Reward Badge +150 XP (Top-Right) */}
      <div className="flex items-center justify-between gap-2">
        {getTypeBadge()}

        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[10px] font-mono-app font-bold text-[#b45309] shrink-0">
          <Trophy size={11} className="text-[#FACC15]" />
          <span>+{earnedXP} XP</span>
        </div>
      </div>

      {/* 2. Title: Bold 14px (Strict 2-line max, line-clamp-2) */}
      <h3 className="font-pixel text-[14px] text-[#1E293B] font-bold line-clamp-2 leading-tight my-auto">
        {title}
      </h3>

      {/* 3. Description: Regular 12px (#64748B, 2-line max, line-clamp-2) */}
      <p className="text-[12px] text-[#64748B] font-sans-app line-clamp-2 leading-relaxed">
        {description}
      </p>

      {/* 4. Progress Bar: Fixed 8px height */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] font-mono-app text-[#64748B]">
          <span>Progress</span>
          <span className="font-bold text-[#1E293B]">
            {progress} / {maxProgress} {unit || ''}
          </span>
        </div>
        <div className="h-[8px] w-full bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
          <div
            className={`h-full ${
              type === 'boss' ? 'bg-[#8B7CFF]' : type === 'recovery' ? 'bg-[#4ADE80]' : 'bg-[#38BDF8]'
            } rounded-full transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 5. Bottom Action: MARK COMPLETE Button (Height: 36px, or Claim XP if completed) */}
      <div>
        {claimed ? (
          <div className="h-[36px] w-full rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#16a34a] font-pixel text-[11px] font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 size={14} />
            <span>{t('action.claimed')}</span>
          </div>
        ) : completed ? (
          <button
            type="button"
            onClick={() => onClaim && onClaim(id)}
            className="h-[36px] w-full rounded-xl bg-[#4ADE80] hover:bg-[#38c168] text-[#064e3b] font-pixel text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles size={13} />
            <span>{t('action.claim_xp', { xp: earnedXP })}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onComplete && onComplete(id)}
            className="h-[36px] w-full rounded-xl bg-[#8B7CFF] hover:bg-[#7866f5] text-white font-pixel text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            {t('action.mark_complete')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
