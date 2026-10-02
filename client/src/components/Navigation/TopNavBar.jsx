import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const TopNavBar = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'hud', label: t('nav.hud') || 'HUD 🏰' },
    { id: 'diet', label: t('nav.diet') || 'DIET PLAN 🍽️' },
    { id: 'pet', label: t('nav.pet') || 'PET & WARDROBE 🐾' },
    { id: 'chat', label: t('nav.chat') || 'AI CHAT 💬' }
  ];

  return (
    <nav className="h-12 h-[48px] bg-white/90 backdrop-blur-xs border-b border-[#E2E8F0] sticky top-16 top-[64px] z-40 px-4 select-none">
      <div className="max-w-7xl mx-auto h-full flex items-center">
        {/* 4 Equal-Width Columns Grid */}
        <div className="grid grid-cols-4 w-full gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`h-10 h-[40px] rounded-[12px] rounded-xl flex items-center justify-center transition-all cursor-pointer px-1 sm:px-2 font-pixel text-[11px] sm:text-[13px] whitespace-nowrap overflow-hidden text-ellipsis ${
                  isActive
                    ? 'bg-[#8B7CFF] text-[#FFFFFF] font-bold shadow-sm shadow-[#8B7CFF]/30'
                    : 'bg-transparent text-[#64748B] font-medium hover:text-[#1E293B] hover:bg-[#F0F4F9]'
                }`}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
