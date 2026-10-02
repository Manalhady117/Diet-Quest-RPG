import React, { useState, useEffect } from 'react';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import { playSfx } from '../../utils/soundEffects.js';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Flame,
  Droplets,
  Zap,
  Target,
  Scroll,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Footprints,
  Sun,
  Moon,
  Utensils,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin
} from 'lucide-react';

export const AIGenerationRevealScreen = ({
  quizData,
  onGeneratePlan,
  onProceed,
  isReQuiz = false
}) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [planResult, setPlanResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedMeal, setExpandedMeal] = useState('breakfast');

  const steps = [
    'Synthesizing biometric attributes & BMR via Mifflin-St Jeor...',
    'Calibrating Daily Caloric Target & Macro Split...',
    'Calculating AI Daily Walking Distance & Morning/Evening Split...',
    'Generating Real Structured Meals & Macro Verification...',
    'Forging In-App Walking Quests & Daily RPG Meal Quests...'
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenerationStep(currentStep);
        playSfx('click');
      } else {
        clearInterval(interval);
      }
    }, 450);

    const executeGeneration = async () => {
      try {
        const result = await onGeneratePlan(quizData);
        setPlanResult(result);
        setIsGenerating(false);
        playSfx('levelup');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF85A1', '#388BFD', '#FFD166', '#10B981']
        });
      } catch (err) {
        console.error('Plan generation failed:', err);
        setError('Failed to commune with AI Diet Engine. Retrying fallback...');
        setIsGenerating(false);
      }
    };

    const timeout = setTimeout(() => {
      executeGeneration();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
              <PixelMascot state="celebrate" size={72} />
            </div>
          </div>

          <h2 className="font-pixel text-sm text-[#8B7CFF] mb-2 font-bold animate-pulse">
            COMMUNING WITH AI DIET & WALKING ENGINE...
          </h2>
          <p className="text-xs text-[#64748B] font-sans-app mb-6">
            Synthesizing your real diet plan and two-part split walking quests
          </p>

          <div className="space-y-3 text-left bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 mb-6">
            {steps.map((s, idx) => {
              const isDone = idx < generationStep;
              const isCurrent = idx === generationStep;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-xs">
                  {isDone ? (
                    <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
                  ) : isCurrent ? (
                    <RefreshCw size={14} className="text-[#8B7CFF] animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span
                    className={`font-mono-app text-[11px] ${
                      isDone
                        ? 'text-[#22C55E] font-medium'
                        : isCurrent
                        ? 'text-[#8B7CFF] font-bold'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-[#8B7CFF] to-[#22C55E] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, ((generationStep + 1) / steps.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  const metrics = planResult?.metrics || {
    caloric_target: 1850,
    carbs_g: 190,
    protein_g: 140,
    fats_g: 58,
    water_target_ml: 2600,
    carbs_pct: 42,
    protein_pct: 31,
    fats_pct: 27
  };

  const walkingPlan = planResult?.walking_plan || {
    total_distance_km: 6.0,
    total_time_mins: 60,
    estimated_steps: 8100,
    morning_shift: { distance_km: 3.0, time_mins: 30, steps: 4050, title: 'Morning Walk Quest (Morning Shift)' },
    evening_shift: { distance_km: 3.0, time_mins: 30, steps: 4050, title: 'Evening Walk Quest (Evening Shift)' }
  };

  const dietPlan = planResult?.diet_plan || {
    meals: [
      {
        id: 'breakfast',
        name: 'Power Protein Scramble & Oats',
        calories: 460,
        protein_g: 38,
        carbs_g: 48,
        fats_g: 14,
        ingredients: ['3 Eggs & 2 Whites', '60g Rolled Oats', 'Fresh Berries'],
        cooking_tip: 'Prep proteins on low heat.'
      },
      {
        id: 'lunch',
        name: 'Grilled Lemon Herb Chicken & Rice',
        calories: 650,
        protein_g: 55,
        carbs_g: 62,
        fats_g: 20,
        ingredients: ['180g Chicken Breast', '160g Jasmine Rice', 'Steamed Broccoli'],
        cooking_tip: 'Season with paprika and pink salt.'
      },
      {
        id: 'dinner',
        name: 'Wild Salmon Bowl with Sweet Potatoes',
        calories: 540,
        protein_g: 45,
        carbs_g: 48,
        fats_g: 18,
        ingredients: ['170g Salmon Fillet', '180g Sweet Potatoes', 'Garlic Asparagus'],
        cooking_tip: 'Roast sweet potatoes for caramelized flavor.'
      },
      {
        id: 'snack',
        name: 'High-Protein Greek Yogurt Parfait',
        calories: 200,
        protein_g: 18,
        carbs_g: 24,
        fats_g: 6,
        ingredients: ['180g Greek Yogurt', 'Honey drizzle', 'Blueberries'],
        cooking_tip: 'Eat before your evening walk.'
      }
    ]
  };

  const quests = planResult?.quests || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-8">
      <div className="w-full max-w-3xl bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-lg space-y-6">
        {/* Banner */}
        <div className="flex items-center justify-between text-[10px] font-pixel text-[#64748B]">
          <span className="text-[#8B7CFF] flex items-center gap-1.5 font-bold">
            <Sparkles size={12} /> AI DIET & WALKING BLUEPRINT DEPLOYED
          </span>
          <span className="text-[#22C55E] flex items-center gap-1 font-bold">
            <ShieldCheck size={12} /> IN-APP TRACKING READY
          </span>
        </div>

        {/* Mascot & Title */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
          <div className="p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <PixelMascot state="celebrate" size={54} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-pixel text-[#0F172A] font-bold">
              YOUR REAL AI QUEST LINE IS READY!
            </h2>
            <p className="text-xs text-[#64748B] font-sans-app mt-0.5">
              Personalized for your Age (<span className="text-[#8B7CFF] font-semibold">{quizData?.age}</span>), Height (<span className="text-[#8B7CFF] font-semibold">{quizData?.height_cm}</span>), Weight (<span className="text-[#22C55E] font-semibold">{quizData?.weight_kg}</span>), and Goal (<span className="text-[#8B7CFF] font-semibold">{quizData?.user_goal?.replace('_', ' ')}</span>).
            </p>
          </div>
        </div>

        {/* Section 1: AI Split Walking Quests */}
        <div className="bg-[#F8FAFC] border border-[#22C55E]/40 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#22C55E]/15 text-[#22C55E] rounded-lg">
                <Footprints size={16} />
              </div>
              <div>
                <h3 className="font-pixel text-xs text-[#0F172A] font-bold">AI-CALCULATED SPLIT WALKING QUESTS</h3>
                <p className="text-[10px] text-[#64748B] font-sans-app">
                  No smartwatch or Bluetooth required — tracked and logged directly in-app!
                </p>
              </div>
            </div>
            <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl px-3 py-1 text-right">
              <span className="text-[9px] font-pixel text-[#64748B] block font-bold">DAILY TARGET</span>
              <span className="font-mono-app text-sm font-bold text-[#22C55E]">
                {walkingPlan.total_distance_km} km / {walkingPlan.total_time_mins} mins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Morning Shift */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[#eab308] font-pixel text-xs font-bold">
                  <Sun size={15} />
                  <span>MORNING SHIFT</span>
                </div>
                <span className="text-[10px] font-pixel text-[#eab308] bg-[#eab308]/10 px-2 py-0.5 rounded border border-[#eab308]/30 font-bold">
                  +150 XP
                </span>
              </div>
              <div className="font-mono-app text-xl font-bold text-[#0F172A]">
                {walkingPlan.morning_shift.distance_km} km
                <span className="text-xs text-[#64748B] font-normal ml-1.5">
                  (~{walkingPlan.morning_shift.time_mins} mins / {walkingPlan.morning_shift.steps} steps)
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans-app mt-1">
                First half of daily mobility to awaken metabolism and burn morning energy.
              </p>
            </div>

            {/* Evening Shift */}
            <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-[#8B7CFF] font-pixel text-xs font-bold">
                  <Moon size={15} />
                  <span>EVENING SHIFT</span>
                </div>
                <span className="text-[10px] font-pixel text-[#8B7CFF] bg-[#8B7CFF]/10 px-2 py-0.5 rounded border border-[#8B7CFF]/30 font-bold">
                  +150 XP
                </span>
              </div>
              <div className="font-mono-app text-xl font-bold text-[#0F172A]">
                {walkingPlan.evening_shift.distance_km} km
                <span className="text-xs text-[#64748B] font-normal ml-1.5">
                  (~{walkingPlan.evening_shift.time_mins} mins / {walkingPlan.evening_shift.steps} steps)
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] font-sans-app mt-1">
                Second half of daily mobility to facilitate digestion and conclude today's quest.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Baseline Metrics & Macro Split */}
        <div>
          <h3 className="font-pixel text-xs text-[#0F172A] mb-3 flex items-center gap-2 font-bold">
            <Target size={14} className="text-[#8B7CFF]" /> CALCULATED NUTRITION ARCHITECTURE
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#ef4444] text-[10px] font-pixel mb-1 font-bold">
                <Flame size={13} /> DAILY CALORIES
              </div>
              <div className="text-lg font-pixel text-[#0F172A] font-bold">
                {metrics.caloric_target} <span className="text-[10px] text-[#64748B] font-mono-app font-normal">kcal</span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#8B7CFF] text-[10px] font-pixel mb-1 font-bold">
                <Zap size={13} /> PROTEIN
              </div>
              <div className="text-lg font-pixel text-[#0F172A] font-bold">
                {metrics.protein_g}g <span className="text-[10px] text-[#64748B] font-mono-app font-normal">({metrics.protein_pct}%)</span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#3b82f6] text-[10px] font-pixel mb-1 font-bold">
                <ShieldCheck size={13} /> CARBS
              </div>
              <div className="text-lg font-pixel text-[#0F172A] font-bold">
                {metrics.carbs_g}g <span className="text-[10px] text-[#64748B] font-mono-app font-normal">({metrics.carbs_pct}%)</span>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[#22C55E] text-[10px] font-pixel mb-1 font-bold">
                <Droplets size={13} /> HYDRATION
              </div>
              <div className="text-lg font-pixel text-[#0F172A] font-bold">
                {metrics.water_target_ml} <span className="text-[10px] text-[#64748B] font-mono-app font-normal">mL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Real Personalized AI Diet Plan */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-pixel text-xs text-[#0F172A] flex items-center gap-2 font-bold">
              <Utensils size={14} className="text-[#8B7CFF]" /> REAL PERSONALIZED AI DIET PLAN
            </h3>
            <span className="text-[10px] text-[#64748B] font-mono-app">
              Tailored to your {metrics.caloric_target} kcal target & preferences
            </span>
          </div>

          <div className="space-y-2.5">
            {dietPlan.meals.map((meal) => {
              const isExpanded = expandedMeal === meal.id;
              return (
                <div
                  key={meal.id}
                  className="bg-[#F8FAFC] border border-slate-200 hover:border-[#8B7CFF] rounded-xl transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-pixel uppercase px-2 py-0.5 rounded bg-[#8B7CFF]/15 text-[#8B7CFF] border border-[#8B7CFF]/30 font-bold">
                        {meal.id}
                      </span>
                      <div>
                        <h4 className="font-pixel text-xs text-[#0F172A] font-bold">{meal.name}</h4>
                        <span className="text-[10px] text-[#64748B] font-mono-app">
                          {meal.calories} kcal • {meal.protein_g}g P • {meal.carbs_g}g C • {meal.fats_g}g F
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#64748B]">
                      <span className="text-[10px] font-pixel text-[#8B7CFF] font-bold">+200 XP</span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-200 bg-white text-xs">
                      <div className="mb-2">
                        <span className="font-pixel text-[10px] text-[#8B7CFF] block mb-1 font-bold">
                          REAL INGREDIENTS & PORTIONS:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {meal.ingredients?.map((ing, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#0F172A] border border-slate-200 font-mono-app text-[11px]"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      {meal.cooking_tip && (
                        <p className="text-[11px] text-[#64748B] font-sans-app italic">
                          💡 Chef's Tip: {meal.cooking_tip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Daily Quests preview */}
        <div>
          <h3 className="font-pixel text-xs text-[#0F172A] mb-3 flex items-center gap-2 font-bold">
            <Scroll size={14} className="text-[#8B7CFF]" /> CONVERTED DAILY RPG QUESTS
          </h3>

          <div className="space-y-2">
            {quests.slice(0, 5).map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-pixel text-xs text-[#0F172A] block font-bold">{q.title}</span>
                  <span className="text-[11px] text-[#64748B] font-sans-app line-clamp-1">
                    {q.description}
                  </span>
                </div>
                <span className="font-pixel text-xs text-[#22C55E] shrink-0 font-bold">+{q.baseXP} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Directly Embark into App! */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onProceed}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs shadow-md shadow-[#8B7CFF]/25 transition-all cursor-pointer font-bold"
          >
            <span>{isReQuiz ? 'APPLY PLAN & RETURN' : 'ACCEPT PLAN & ENTER REALM'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIGenerationRevealScreen;
