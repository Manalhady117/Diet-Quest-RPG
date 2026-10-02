import React from 'react';
import { Apple, Clock, Salad, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export const DietTypeScreen = ({ currentDiet, onSelectDiet, onNext, onBack }) => {
  const diets = [
    {
      id: 'Balanced',
      title: 'Balanced Nutrition',
      subtitle: 'Macro Equilibrium',
      desc: 'Standard healthy distribution of complex carbohydrates, lean proteins, and essential fats.',
      icon: Apple,
      color: '#10B981'
    },
    {
      id: 'Keto',
      title: 'Ketogenic Quest',
      subtitle: 'Fat-Adapted Burn',
      desc: 'High healthy fats, moderate protein, and ultra-low carbohydrates to enter ketone combustion.',
      icon: Sparkles,
      color: '#F59E0B'
    },
    {
      id: 'Intermittent Fasting',
      title: 'Intermittent Fasting',
      subtitle: '16:8 Window Protocol',
      desc: '16 hours of daily cellular autophagy and fat oxidation paired with an 8-hour nourishment window.',
      icon: Clock,
      color: '#8B5CF6'
    },
    {
      id: 'Vegetarian',
      title: 'Vegetarian Druid',
      subtitle: 'Plant-Powered Vitality',
      desc: '100% plant and dairy whole foods focusing on high-fiber density and clean energy.',
      icon: Salad,
      color: '#06B6D4'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-[10px] font-pixel text-[#64748B] mb-4">
          <span className="text-[#8B7CFF] font-bold">STEP 4: DIET TYPE</span>
          <span className="text-[#22C55E] font-bold">MACRO CALIBRATION</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-pixel text-base sm:text-lg text-[#0F172A] mb-1.5 font-bold">
            SELECT DIETARY PREFERENCE
          </h2>
          <p className="text-xs text-[#64748B] font-sans-app">
            Tailors daily meal verification rules and penalty immunities
          </p>
        </div>

        {/* Grid of 4 options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {diets.map((d) => {
            const Icon = d.icon;
            const isSelected = currentDiet === d.id;

            return (
              <div
                key={d.id}
                onClick={() => onSelectDiet(d.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-xs scale-[1.01]'
                    : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${d.color}15`, color: d.color }}
                    >
                      <Icon size={18} />
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-pixel text-[#8B7CFF] bg-[#8B7CFF]/15 px-1.5 py-0.5 rounded border border-[#8B7CFF]/30 font-bold">
                        CHOSEN
                      </span>
                    )}
                  </div>
                  <h3 className="font-pixel text-xs text-[#0F172A] font-bold">{d.title}</h3>
                  <span className="text-[10px] text-[#64748B] font-mono-app block mb-2">{d.subtitle}</span>
                  <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="py-3 px-4 border border-slate-200 hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] font-pixel text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold"
          >
            <ArrowLeft size={14} />
            <span>BACK</span>
          </button>

          <button
            onClick={onNext}
            className="flex-1 py-3.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs rounded-xl shadow-md shadow-[#8B7CFF]/25 font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONFIRM DIET & GENERATE AI PLAN</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietTypeScreen;
