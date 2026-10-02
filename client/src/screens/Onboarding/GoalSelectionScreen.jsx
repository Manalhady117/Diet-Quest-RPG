import React from 'react';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import { Target, Flame, Dumbbell, Scale, ArrowRight, ArrowLeft } from 'lucide-react';

export const GoalSelectionScreen = ({ currentGoal, onSelectGoal, onNext, onBack }) => {
  const goals = [
    {
      id: 'weight_loss',
      title: 'Weight Loss',
      mode: 'Caloric Deficit Mode',
      desc: 'Primary focus on portion control, fat burn pacing, and intermittent fasting boss battles.',
      targetWater: '3.0 Liters',
      targetSteps: '8,000 Steps',
      icon: Flame,
      color: '#FF5252',
      borderClass: 'border-[#FF5252]'
    },
    {
      id: 'weight_gain',
      title: 'Weight Gain',
      mode: 'Caloric Surplus Mode',
      desc: 'Primary focus on 5 dense meals/snacks, high-protein density, and heavy resistance training.',
      targetWater: '2.5 Liters',
      targetSteps: '8,000 Steps',
      icon: Dumbbell,
      color: '#388BFD',
      borderClass: 'border-[#388BFD]'
    },
    {
      id: 'weight_maintenance',
      title: 'Weight Maintenance',
      mode: 'Equilibrium Mode',
      desc: 'Primary focus on exact caloric equilibrium (±5%), daily 10k step thresholds, and sugar elimination.',
      targetWater: '2.5 Liters',
      targetSteps: '10,000 Steps',
      icon: Scale,
      color: '#FFD166',
      borderClass: 'border-[#FFD166]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-lg">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-[10px] font-pixel text-[#64748B] mb-4">
          <span className="text-[#8B7CFF] font-bold">STEP 3: FITNESS GOAL</span>
          <span className="text-[#22C55E] font-bold">CALORIC ARCHETYPE</span>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="font-pixel text-base sm:text-lg text-[#0F172A] mb-1.5 font-bold">
            CHOOSE YOUR PRIMARY FITNESS GOAL
          </h2>
          <p className="text-xs text-[#64748B] font-sans-app">
            Your quests, caloric formulas, and boss battles adapt dynamically to this choice
          </p>
        </div>

        {/* Goal options */}
        <div className="space-y-3 mb-6">
          {goals.map((g) => {
            const Icon = g.icon;
            const isSelected = currentGoal === g.id;

            return (
              <div
                key={g.id}
                onClick={() => onSelectGoal(g.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-xs scale-[1.01]'
                    : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="p-2.5 rounded-xl shrink-0 mt-0.5"
                    style={{ backgroundColor: `${g.color}15`, color: g.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-pixel text-xs text-[#0F172A] font-bold">{g.title}</h3>
                      <span
                        className="text-[9px] font-pixel px-2 py-0.5 rounded-md border font-bold"
                        style={{
                          color: g.color,
                          borderColor: `${g.color}30`,
                          backgroundColor: `${g.color}10`
                        }}
                      >
                        {g.mode}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] font-sans-app mt-1 mb-2 leading-relaxed">
                      {g.desc}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-mono-app text-[#64748B]">
                      <span>💧 Goal: <strong className="text-[#0F172A]">{g.targetWater}</strong></span>
                      <span>👣 Goal: <strong className="text-[#0F172A]">{g.targetSteps}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-4">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-xs font-pixel text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-all cursor-pointer font-bold"
            >
              <ArrowLeft size={13} />
              <span>BACK</span>
            </button>
          ) : <div />}

          <button
            onClick={onNext}
            className="flex-1 py-3.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs rounded-xl shadow-md shadow-[#8B7CFF]/25 font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONFIRM GOAL & PROCEED</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalSelectionScreen;
