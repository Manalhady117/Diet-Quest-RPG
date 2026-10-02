import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGame } from '../../context/GameContext.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PixelMascot } from '../Mascot/PixelMascot.jsx';
import { Settings } from 'lucide-react';

export const AppHeader = ({ onOpenStore, onOpenSettings }) => {
  const { user } = useAuth();
  const { stats } = useGame();
  const { coins: userCoins } = useUser();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const handleToggleLang = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const currentLevel = stats?.level || 1;
  const currentHp = stats?.hp_current !== undefined ? stats.hp_current : 100;
  const maxHp = stats?.hp_max || 100;
  const currentCoins = stats?.coins !== undefined ? Number(stats.coins) : (userCoins !== undefined ? Number(userCoins) : 200);

  return (
    <header className="top-header h-16 h-[64px] bg-white border-b border-[#E2E8F0] sticky top-0 z-50 px-4 select-none">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-2">
        {/* Zone 1: Left Edge (Mini-Profile Avatar + Stacked Info Box) */}
        <div className="flex items-center gap-2.5 min-w-[120px] sm:min-w-[150px]">
          {/* Avatar Circle (36x36px) */}
          <div className="w-9 h-9 w-[36px] h-[36px] rounded-full bg-[#8B7CFF]/15 border border-[#8B7CFF]/30 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <PixelMascot state="idle" size={28} />
          </div>

          {/* Stacked Info Box */}
          <div className="flex flex-col justify-center overflow-hidden">
            {/* Line 1: Username (Bold 14px, #1E293B) */}
            <span className="text-[14px] font-bold text-[#1E293B] leading-tight truncate max-w-[90px] sm:max-w-[120px]">
              {user?.name || 'Hero'}
            </span>

            {/* Line 2: Level Badge (Lvl 1, #8B7CFF, 11px font, rounded pill) + Compact HP */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-pixel font-bold text-[#8B7CFF] bg-[#8B7CFF]/15 px-1.5 py-0.5 rounded-full leading-none">
                {t('header.level', { level: currentLevel })}
              </span>
              <span className="text-[10px] font-mono-app font-semibold text-[#64748B] hidden sm:inline leading-none">
                {currentHp}/{maxHp} HP
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Center Section (App Logo DIET QUEST with soft glow effect) */}
        <div className="flex items-center justify-center text-center">
          <h1 className="font-pixel text-[16px] sm:text-[18px] font-bold tracking-[1px] text-[#0F172A] drop-shadow-[0_2px_10px_rgba(139,124,255,0.3)] whitespace-nowrap">
            {t('header.logo')}
          </h1>
        </div>

        {/* Zone 3: Right Edge (Gold Counter Pill + Language Switcher) */}
        <div className="flex items-center justify-end gap-2 min-w-[120px] sm:min-w-[150px]">
          {/* Gold Counter Pill (12px bold text, #FACC15 fill/badge, 6px padding) */}
          <button
            type="button"
            onClick={onOpenStore}
            className="coins-badge flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FACC15]/20 hover:bg-[#FACC15]/30 border border-[#FACC15]/40 text-[#1E293B] font-mono-app text-[12px] font-bold cursor-pointer transition-all shadow-xs"
            title="Open Loot Store & Armory"
          >
            <span className="coin-icon text-[13px]">🪙</span>
            <span className="coin-amount truncate max-w-[60px] sm:max-w-[80px]">{currentCoins.toLocaleString()}</span>
          </button>

          {/* Language Switcher Button: 🌐 AR / EN (12px text, #F1F5F9 background, 8px rounded borders) */}
          <button
            type="button"
            onClick={handleToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] bg-[#F1F5F9] hover:bg-slate-200 border border-slate-200 text-[#1E293B] font-mono-app text-[12px] font-bold cursor-pointer transition-all shadow-xs"
            title="Toggle Language (English / العربية)"
          >
            <span>🌐</span>
            <span>{language === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Quick Settings Icon */}
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="hidden sm:flex items-center justify-center p-1.5 rounded-[8px] bg-[#F1F5F9] hover:bg-slate-200 border border-slate-200 text-[#64748B] hover:text-[#1E293B] transition-all cursor-pointer"
              title={t('nav.settings')}
            >
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
