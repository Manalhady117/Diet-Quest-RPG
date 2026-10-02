import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Sparkles, X, ChevronRight, Bell, Shield, Flame, Droplets, Utensils } from 'lucide-react';

export const GamifiedReminder = ({ onAction, activeTab }) => {
  const { t, isRTL } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const reminders = [
    {
      id: 'fuel',
      icon: Utensils,
      textKey: 'notify.fuel',
      color: '#8B7CFF',
      bgColor: 'bg-[#8B7CFF]/10',
      borderColor: 'border-[#8B7CFF]/30',
      targetTab: 'diet'
    },
    {
      id: 'steps',
      icon: Flame,
      textKey: 'notify.steps',
      color: '#FF7EB6',
      bgColor: 'bg-[#FF7EB6]/10',
      borderColor: 'border-[#FF7EB6]/30',
      targetTab: 'quests'
    },
    {
      id: 'water',
      icon: Droplets,
      textKey: 'notify.water',
      color: '#38BDF8',
      bgColor: 'bg-[#38BDF8]/10',
      borderColor: 'border-[#38BDF8]/30',
      targetTab: 'hud'
    },
    {
      id: 'streak',
      icon: Sparkles,
      textKey: 'notify.streak',
      color: '#FACC15',
      bgColor: 'bg-[#FACC15]/10',
      borderColor: 'border-[#FACC15]/30',
      targetTab: 'campaign'
    }
  ];

  // Rotate reminder every 14 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reminders.length);
    }, 14000);
    return () => clearInterval(timer);
  }, [reminders.length]);

  if (!isVisible) return null;

  const current = reminders[currentIndex];
  const Icon = current.icon;

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full transition-all duration-300 animate-in fade-in slide-in-from-top-2"
    >
      <div
        className={`flex items-center justify-between p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-white border ${current.borderColor} shadow-sm relative overflow-hidden`}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl ${current.bgColor} flex items-center justify-center shrink-0`}
            style={{ color: current.color }}
          >
            <Icon size={16} />
          </div>

          <p className="text-xs sm:text-[13px] font-sans-app text-[#1E293B] truncate">
            {t(current.textKey)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-2">
          {onAction && (
            <button
              type="button"
              onClick={() => onAction(current.targetTab)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1E293B] text-[11px] font-pixel transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{t('notify.action')}</span>
              <ChevronRight size={12} className={isRTL ? 'rotate-180' : ''} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label={t('notify.dismiss')}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamifiedReminder;
