import React, { useState } from 'react';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import { User, Ruler, Weight, ArrowRight, Sparkles, Shield, Activity } from 'lucide-react';

export const PhysicalMetricsScreen = ({
  currentAge = '26-35',
  currentHeight = '171-180cm',
  currentWeight = '71-85kg',
  onSaveMetrics,
  onNext,
  onBack,
  isReQuiz = false
}) => {
  const [age, setAge] = useState(currentAge);
  const [height, setHeight] = useState(currentHeight);
  const [weight, setWeight] = useState(currentWeight);
  const [customWeightInput, setCustomWeightInput] = useState(
    !['Under 55kg', '55-70kg', '71-85kg', '86kg+'].includes(currentWeight) ? currentWeight : ''
  );
  const [isCustomWeight, setIsCustomWeight] = useState(
    !['Under 55kg', '55-70kg', '71-85kg', '86kg+'].includes(currentWeight)
  );

  const ageRanges = [
    { id: 'Under 18', label: 'Under 18', desc: 'Youthful Adventurer' },
    { id: '18-25', label: '18-25', desc: 'Rising Warrior' },
    { id: '26-35', label: '26-35', desc: 'Prime Knight' },
    { id: '36+', label: '36+', desc: 'Veteran Champion' }
  ];

  const heightRanges = [
    { id: 'Under 160cm', label: 'Under 160cm', desc: 'Swift & Agile' },
    { id: '160-170cm', label: '160-170cm', desc: 'Balanced Stature' },
    { id: '171-180cm', label: '171-180cm', desc: 'Standard Knight' },
    { id: '181cm+', label: '181cm+', desc: 'Colossal Vanguard' }
  ];

  const weightBands = [
    { id: 'Under 55kg', label: 'Under 55 kg', desc: 'Featherweight Class' },
    { id: '55-70kg', label: '55 - 70 kg', desc: 'Cruiserweight Class' },
    { id: '71-85kg', label: '71 - 85 kg', desc: 'Heavyweight Class' },
    { id: '86kg+', label: '86+ kg', desc: 'Titan Stature' }
  ];

  const handleSelectWeightBand = (bandId) => {
    setIsCustomWeight(false);
    setWeight(bandId);
  };

  const handleCustomWeightChange = (e) => {
    const val = e.target.value;
    setCustomWeightInput(val);
    if (val && !isNaN(parseFloat(val))) {
      setIsCustomWeight(true);
      setWeight(`${val}kg`);
    }
  };

  const handleContinue = () => {
    const finalWeight = isCustomWeight && customWeightInput ? `${customWeightInput}kg` : weight;
    onSaveMetrics({
      age,
      height_cm: height,
      weight_kg: finalWeight
    });
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-lg">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-[10px] font-pixel text-[#64748B] mb-4">
          <span className="text-[#8B7CFF] font-bold">PHASE 1: ONBOARDING QUIZ (STEP 1 OF 3)</span>
          <span className="text-[#22C55E] font-bold">PHYSICAL METRICS & AGE</span>
        </div>

        {/* Mascot Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <PixelMascot state="idle" size={54} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-pixel text-[#0F172A] font-bold">
              CALIBRATE ADVENTURER STATS
            </h2>
            <p className="text-xs text-[#64748B] font-sans-app mt-1 leading-relaxed">
              Provide your physical attributes so our AI Diet Engine can calculate your precise BMR, Caloric Target, and Water Goal.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Age */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <User size={16} className="text-[#8B7CFF]" />
              <label className="font-pixel text-[11px] text-[#0F172A] font-bold">
                1. AGE BRACKET <span className="text-[#64748B] text-[10px] font-mono-app font-normal">(Select Range)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ageRanges.map((a) => {
                const active = age === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAge(a.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#8B7CFF] bg-[#8B7CFF]/10 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-pixel text-xs text-[#0F172A] font-bold">{a.label}</div>
                    <div className="text-[10px] text-[#64748B] font-sans-app mt-0.5">{a.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Height */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Ruler size={16} className="text-[#8B7CFF]" />
              <label className="font-pixel text-[11px] text-[#0F172A] font-bold">
                2. HEIGHT <span className="text-[#64748B] text-[10px] font-mono-app font-normal">(Select Range)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {heightRanges.map((h) => {
                const active = height === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setHeight(h.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#8B7CFF] bg-[#8B7CFF]/10 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-pixel text-xs text-[#0F172A] font-bold">{h.label}</div>
                    <div className="text-[10px] text-[#64748B] font-sans-app mt-0.5">{h.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Weight */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Weight size={16} className="text-[#22C55E]" />
              <label className="font-pixel text-[11px] text-[#0F172A] font-bold">
                3. WEIGHT <span className="text-[#64748B] text-[10px] font-mono-app font-normal">(Select Band or Enter Exact kg)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
              {weightBands.map((w) => {
                const active = !isCustomWeight && weight === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectWeightBand(w.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#22C55E] bg-[#22C55E]/10 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="font-pixel text-xs text-[#0F172A] font-bold">{w.label}</div>
                    <div className="text-[10px] text-[#64748B] font-sans-app mt-0.5">{w.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Weight Input */}
            <div className={`p-3 rounded-xl border-2 transition-all ${
              isCustomWeight
                ? 'border-[#22C55E] bg-[#22C55E]/10'
                : 'border-slate-200 bg-[#F8FAFC]'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#64748B] font-sans-app">Or enter exact number:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="30"
                    max="250"
                    placeholder="e.g. 74"
                    value={customWeightInput}
                    onChange={handleCustomWeightChange}
                    onFocus={() => setIsCustomWeight(true)}
                    className="w-24 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] font-mono-app outline-none focus:border-[#22C55E]"
                  />
                  <span className="font-pixel text-[10px] text-[#22C55E] font-bold">KG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-pixel text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-all cursor-pointer font-bold"
            >
              BACK
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs shadow-md shadow-[#8B7CFF]/25 font-bold transition-all cursor-pointer"
          >
            <span>NEXT: FOOD PREFERENCES</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhysicalMetricsScreen;
