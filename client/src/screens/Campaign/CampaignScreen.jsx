import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import DailyAnalytics from '../Analytics/DailyAnalytics.jsx';
import WeeklyAnalytics from '../Analytics/WeeklyAnalytics.jsx';
import { BarChart3, TrendingUp, Calendar, Shield } from 'lucide-react';

export const CampaignScreen = ({ onOpenDiet, initialView = 'daily' }) => {
  const { t, isRTL } = useLanguage();
  const [activeView, setActiveView] = useState(initialView); // 'daily' | 'weekly'

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Dual-View Switcher Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-base sm:text-lg text-[#1E293B] flex items-center gap-2">
            <span>{t('nav.campaign')}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/15 text-[#8B7CFF] font-pixel">
              {activeView === 'daily' ? t('action.view_daily') : t('action.view_weekly')}
            </span>
          </h2>
          <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
            {activeView === 'daily' ? t('daily.subtitle') : t('weekly.subtitle')}
          </p>
        </div>

        {/* Segmented View Control */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#F0F4F9] border border-slate-200 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveView('daily')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-pixel text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'daily'
                ? 'bg-white text-[#8B7CFF] shadow-sm shadow-[#8B7CFF]/20 font-bold border border-[#8B7CFF]/20'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <BarChart3 size={15} />
            <span>{t('action.view_daily')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('weekly')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl font-pixel text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'weekly'
                ? 'bg-white text-[#8B7CFF] shadow-sm shadow-[#8B7CFF]/20 font-bold border border-[#8B7CFF]/20'
                : 'text-[#64748B] hover:text-[#1E293B]'
            }`}
          >
            <TrendingUp size={15} />
            <span>{t('action.view_weekly')}</span>
          </button>
        </div>
      </div>

      {/* Render Active Analytics View */}
      {activeView === 'daily' ? (
        <DailyAnalytics
          onOpenDiet={onOpenDiet}
          onOpenWeekly={() => setActiveView('weekly')}
        />
      ) : (
        <WeeklyAnalytics
          onOpenDaily={() => setActiveView('daily')}
          onOpenDiet={onOpenDiet}
        />
      )}
    </div>
  );
};

export default CampaignScreen;
