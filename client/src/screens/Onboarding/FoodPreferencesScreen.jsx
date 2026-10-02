import React, { useState } from 'react';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import {
  Heart,
  Ban,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  AlertTriangle,
  Globe,
  Utensils
} from 'lucide-react';

export const FoodPreferencesScreen = ({
  initialLikes = ['Chicken', 'Rice', 'Vegetables'],
  initialDislikes = ['None'],
  initialCuisines = ['Egyptian', 'Mediterranean'],
  onSavePreferences,
  onNext,
  onBack
}) => {
  const [wizardPhase, setWizardPhase] = useState(1); // 1: Cuisines (Ranked) | 2: Disliked/Allergies | 3: Liked Ingredients
  const [rankedCuisines, setRankedCuisines] = useState(initialCuisines);
  const [dislikedFoods, setDislikedFoods] = useState(initialDislikes);
  const [likedFoods, setLikedFoods] = useState(initialLikes);

  const cuisineOptions = [
    {
      id: 'Egyptian',
      name: 'Egyptian Cuisine',
      flag: '🇪🇬',
      dishes: 'Koshary, Molokhia, Grilled Kofta, Shorbat Ads, Hawawshi',
      desc: 'Authentic spiced lentils, baladi grills & traditional stews'
    },
    {
      id: 'Middle Eastern',
      name: 'Middle Eastern',
      flag: '🧆',
      dishes: 'Shish Tawook, Chicken Shawarma, Hummus & Tabbouleh',
      desc: 'Sumac, zaatar, grilled skewers & aromatic flatbreads'
    },
    {
      id: 'Mediterranean',
      name: 'Mediterranean',
      flag: '🥗',
      dishes: 'Greek Lemon Herb Chicken, Wild Salmon, Quinoa & Tzatziki',
      desc: 'Heart-healthy extra virgin olive oil, herbs & fresh fish'
    },
    {
      id: 'Asian',
      name: 'Asian Fusion',
      flag: '🥢',
      dishes: 'Teriyaki Chicken Bowls, Soba Noodle Stir-fry, Steamed Seabass',
      desc: 'Ginger, garlic, soy, sesame & antioxidant greens'
    },
    {
      id: 'Italian',
      name: 'Italian Trattoria',
      flag: '🍝',
      dishes: 'Whole-wheat Penne Pomodoro, Tuscan Chicken, Caprese',
      desc: 'Ripe tomatoes, fresh basil, garlic & rustic grains'
    },
    {
      id: 'Mexican',
      name: 'Mexican / Latin',
      flag: '🌮',
      dishes: 'Grilled Chicken Fajita Bowls, Black Bean & Corn Fiesta',
      desc: 'Chili lime, cilantro, fire-roasted salsas & avocado'
    }
  ];

  const dislikedOptions = [
    { id: 'Seafood', label: 'Seafood & Fish', icon: '🦞', desc: 'Fish, shrimp, tuna, shellfish' },
    { id: 'Eggs', label: 'Eggs', icon: '🥚', desc: 'Whole eggs & omelettes' },
    { id: 'Lactose', label: 'Dairy / Lactose', icon: '🧀', desc: 'Milk, cheese, yogurt, whey' },
    { id: 'Gluten', label: 'Gluten & Wheat', icon: '🌾', desc: 'Wheat flour, pasta, bread' },
    { id: 'Nuts', label: 'Peanuts & Tree Nuts', icon: '🥜', desc: 'Almonds, walnuts, peanuts' },
    { id: 'Red Meat', label: 'Red Meat', icon: '🥩', desc: 'Beef, steak, lamb, veal' },
    { id: 'Spicy Food', label: 'Hot & Spicy Food', icon: '🌶️', desc: 'Chili peppers, hot sauce' },
    { id: 'None', label: 'None (No Restrictions)', icon: '✨', desc: 'All healthy foods welcomed' }
  ];

  const likedOptions = [
    { id: 'Chicken', label: 'Chicken Breast & Poultry', icon: '🍗', desc: 'Lean protein power' },
    { id: 'Fish', label: 'Wild Fish & Seafood', icon: '🐟', desc: 'Omega-3 rich recovery' },
    { id: 'Beef', label: 'Lean Beef & Steak', icon: '🥩', desc: 'Iron & creatine booster' },
    { id: 'Eggs', label: 'Eggs & Whites', icon: '🍳', desc: 'Bioavailable amino acids' },
    { id: 'Oats', label: 'Steel-Cut Oats', icon: '🥣', desc: 'Slow-burning complex carbs' },
    { id: 'Rice', label: 'Basmati & Brown Rice', icon: '🍚', desc: 'Clean low-FODMAP fuel' },
    { id: 'Dairy', label: 'Greek Yogurt & Cheese', icon: '🥛', desc: 'Casein & calcium strength' },
    { id: 'Vegetables', label: 'Cruciferous Greens', icon: '🥦', desc: 'Micronutrients & fiber' },
    { id: 'Fruits', label: 'Berries & Apples', icon: '🍎', desc: 'Natural vitamins & energy' }
  ];

  // Toggle cuisine rank
  const toggleCuisine = (cuisineId) => {
    setRankedCuisines((prev) => {
      if (prev.includes(cuisineId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((c) => c !== cuisineId);
      } else {
        return [...prev, cuisineId];
      }
    });
  };

  const toggleDisliked = (item) => {
    setDislikedFoods((prev) => {
      if (item === 'None') return ['None'];
      const filtered = prev.filter((x) => x !== 'None');
      if (filtered.includes(item)) {
        const next = filtered.filter((x) => x !== item);
        return next.length === 0 ? ['None'] : next;
      } else {
        return [...filtered, item];
      }
    });
  };

  const toggleLiked = (item) => {
    setLikedFoods((prev) => {
      if (prev.includes(item)) {
        if (prev.length === 1) return prev;
        return prev.filter((x) => x !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleContinue = () => {
    if (wizardPhase === 1) {
      setWizardPhase(2);
    } else if (wizardPhase === 2) {
      setWizardPhase(3);
    } else {
      onSavePreferences({
        favorite_cuisines: rankedCuisines,
        disliked_foods: dislikedFoods,
        allergies: dislikedFoods,
        liked_foods: likedFoods
      });
      onNext();
    }
  };

  const handleBack = () => {
    if (wizardPhase === 3) {
      setWizardPhase(2);
    } else if (wizardPhase === 2) {
      setWizardPhase(1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 selection:bg-[#8B7CFF]/20 select-none">
      <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-[10px] font-pixel text-slate-500 mb-3">
          <span className="text-[#8B7CFF] font-bold">
            PHASE 1: ONBOARDING WIZARD (STEP 2 OF 3)
          </span>
          <span className="text-emerald-600 font-bold">
            SUB-STAGE {wizardPhase} OF 3
          </span>
        </div>

        {/* Wizard Sub-Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-5">
          <div
            className="bg-[#8B7CFF] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(wizardPhase / 3) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 shrink-0">
            <PixelMascot state="idle" size={54} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-pixel text-slate-900 font-bold">
              {wizardPhase === 1 && "1. FAVORITE CUISINES & CULTURAL TASTES"}
              {wizardPhase === 2 && "2. DISLIKED INGREDIENTS & ALLERGIES"}
              {wizardPhase === 3 && "3. PREFERRED PROTEIN & CARB SOURCES"}
            </h2>
            <p className="text-xs text-slate-500 font-sans-app mt-0.5 leading-relaxed">
              {wizardPhase === 1 && "Rank your favorite culinary styles! Gemini AI crafts healthy Egyptian & global recipes matching your exact calorie goals."}
              {wizardPhase === 2 && "Strictly exclude anything you dislike or cannot eat. Our engine has a zero-tolerance filter for these items."}
              {wizardPhase === 3 && "Select your go-to staples so our AI prioritizes them in your customized 7-day meal schedules."}
            </p>
          </div>
        </div>

        {/* PHASE 1: FAVORITE CUISINES (RANKED) */}
        {wizardPhase === 1 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-sans-app font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Globe size={15} className="text-[#8B7CFF]" />
                Select & Rank Cuisines (Click in order of preference)
              </span>
              <span className="text-[11px] font-mono-app text-[#8B7CFF] font-bold">
                {rankedCuisines.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cuisineOptions.map((c) => {
                const rankIndex = rankedCuisines.indexOf(c.id);
                const isSelected = rankIndex !== -1;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCuisine(c.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start justify-between ${
                      isSelected
                        ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl pt-0.5">{c.flag}</span>
                      <div>
                        <div className="font-pixel text-xs text-slate-900 font-bold flex items-center gap-1.5">
                          <span>{c.name}</span>
                          {c.id === 'Egyptian' && (
                            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-pixel rounded">
                              LOCAL SPECIALTY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-600 font-sans-app mt-0.5 font-medium">
                          {c.dishes}
                        </div>
                        <div className="text-[9px] text-slate-400 font-sans-app mt-0.5">
                          {c.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-0.5 bg-[#8B7CFF] text-white text-[10px] font-pixel font-bold rounded-lg shrink-0">
                        #{rankIndex + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PHASE 2: DISLIKED FOODS / ALLERGIES */}
        {wizardPhase === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-sans-app font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Ban size={15} className="text-red-500" />
                Select Strictly Excluded Foods
              </span>
              <span className="text-[11px] font-mono-app text-red-500 font-bold">
                {dislikedFoods.includes('None') ? 'No Restrictions' : `${dislikedFoods.length} Excluded`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dislikedOptions.map((opt) => {
                const isSelected = dislikedFoods.includes(opt.id);
                const isNone = opt.id === 'None';

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleDisliked(opt.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isNone
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                          : 'border-red-400 bg-red-50/40 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{opt.icon}</span>
                      <div>
                        <div className="font-pixel text-[11px] text-slate-900 font-bold">
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans-app">
                          {opt.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className={`p-1 rounded-lg ${isNone ? 'text-emerald-700 bg-emerald-100' : 'text-red-600 bg-red-100'}`}>
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Strict Guarantee:</strong> Excluded items are permanently omitted from AI meal generation, instant rerolls, and shopping lists.
              </span>
            </div>
          </div>
        )}

        {/* PHASE 3: LIKED STAPLE FOODS */}
        {wizardPhase === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-sans-app font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Heart size={15} className="text-pink-500" />
                Select Foods You Love
              </span>
              <span className="text-[11px] font-mono-app text-[#8B7CFF] font-bold">
                {likedFoods.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {likedOptions.map((opt) => {
                const isSelected = likedFoods.includes(opt.id);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleLiked(opt.id)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-[#8B7CFF] bg-[#8B7CFF]/10 shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{opt.icon}</span>
                      <div>
                        <div className="font-pixel text-[11px] text-slate-900 font-bold">{opt.label}</div>
                        <div className="text-[9px] text-slate-500 font-sans-app">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[#8B7CFF] bg-[#8B7CFF]/20 p-1 rounded-md">
                        <Check size={12} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-pixel text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer font-bold"
          >
            <ArrowLeft size={13} />
            <span>BACK</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs shadow-md shadow-[#8B7CFF]/25 font-bold transition-all cursor-pointer active:scale-95"
          >
            <span>{wizardPhase === 3 ? "COMPLETE & PROCEED" : "NEXT STAGE"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodPreferencesScreen;
