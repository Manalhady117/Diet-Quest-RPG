import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import QuestCard from '../../components/Cards/QuestCard.jsx';
import { RefreshCw, Swords } from 'lucide-react';
import questService from '../../services/questService.js';

export const QuestsScreen = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { quests, stats, completeQuest, claimQuest, updateQuestProgress, loadGameData, notify } = useGame();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'main' | 'side' | 'recovery'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredQuests = quests.filter((q) => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  const handleResetQuests = async () => {
    setIsRefreshing(true);
    try {
      const res = await questService.resetDailyQuests();
      if (res.success) {
        notify('Fresh quest line generated for today!', 'success');
        await loadGameData();
      }
    } catch (err) {
      notify('Could not reset quests', 'danger');
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalEarnedXP = quests
    .filter((q) => q.claimed)
    .reduce((sum, q) => sum + Math.round(q.baseXP * (stats.streak_multiplier || 1)), 0);

  const totalPotentialXP = quests
    .reduce((sum, q) => sum + Math.round(q.baseXP * (stats.streak_multiplier || 1)), 0);

  return (
    <div className="p-4 space-y-3 max-w-5xl mx-auto animate-in fade-in select-none">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-pixel text-[16px] text-[#1E293B] font-bold">
              {t('quests.title')}
            </h1>
            <span className="text-[10px] font-pixel font-bold px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] uppercase">
              {user?.user_goal?.replace('_', ' ') || 'WEIGHT LOSS'}
            </span>
          </div>
          <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
            {t('quests.subtitle')}
          </p>
        </div>

        {/* Stats summary & Reset button */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-right">
            <span className="text-[9px] font-pixel text-[#64748B] block leading-tight">XP BOUNTY</span>
            <span className="font-mono-app text-xs text-[#8B7CFF] font-bold">
              {totalEarnedXP} <span className="text-slate-400">/ {totalPotentialXP} XP</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetQuests}
            disabled={isRefreshing}
            className="p-2.5 bg-[#F8FAFC] hover:bg-slate-200 border border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            title="Reset Daily Quests"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. Top Filter Bar: Horizontal pill buttons (ALL, MAIN, SIDE, RECOVERY) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E2E8F0] rounded-2xl overflow-x-auto shadow-sm">
        {[
          { id: 'all', label: t('quests.all') },
          { id: 'main', label: 'MAIN' },
          { id: 'side', label: 'SIDE' },
          { id: 'recovery', label: 'RECOVERY' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-pixel text-[11px] transition-all whitespace-nowrap cursor-pointer ${
              filterType === tab.id
                ? 'bg-[#8B7CFF] text-white shadow-xs font-bold'
                : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Quest List (Strict 2-Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            streakMultiplier={stats.streak_multiplier || 1.0}
            onComplete={completeQuest}
            onClaim={claimQuest}
            onProgress={updateQuestProgress}
          />
        ))}
      </div>

      {filteredQuests.length === 0 && (
        <div className="text-center py-12 bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
          <p className="font-pixel text-xs text-[#64748B]">NO QUESTS FOUND IN THIS CATEGORY</p>
        </div>
      )}
    </div>
  );
};

export default QuestsScreen;
