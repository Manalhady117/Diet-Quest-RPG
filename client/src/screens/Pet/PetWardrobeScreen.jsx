import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePet } from '../../context/PetContext.jsx';
import { InteractivePet, PET_CATALOG } from '../../components/Pet/InteractivePet.jsx';
import {
  Sparkles,
  ShoppingBag,
  Shirt,
  Award,
  Heart,
  Apple,
  Hand,
  MessageSquare,
  Coins,
  Check,
  Lock,
  Star,
  Flame,
  Droplet,
  Footprints,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PET_QUOTES = [
  "Water is life! Have you sipped your crystal vitality water today?",
  "That grilled chicken and salad looked epic, human!",
  "Walking quests keep our HP meter locked at 100%! Let's hit the trail!",
  "I smelled that Egyptian Koshary! The brown lentils provide pure plant protein power!",
  "A true adventurer never falls for caloric trap fast food!",
  "Rest days recharge our stamina bar for the next citadel raid!",
  "You're looking stronger every day! Keep up the momentum!"
];

export const PetWardrobeScreen = () => {
  const { stats, buyPetItem, equipPetItem, interactPet, claimBadge, notify } = useGame();
  const { user } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('wardrobe'); // 'wardrobe' | 'scout_board'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'hats' | 'glasses' | 'outfits' | 'backgrounds'
  const [speech, setSpeech] = useState(PET_QUOTES[0]);
  const [isInteracting, setIsInteracting] = useState(false);

  // Extract current pet configuration
  const pet = stats?.pet_customization || {
    name: 'Pip',
    stage: 'baby',
    equipped_hat: null,
    equipped_glasses: null,
    equipped_outfit: null,
    equipped_background: 'bg_cozy_guild',
    unlocked_items: ['bg_cozy_guild'],
    happiness: 50,
    hunger: 50
  };

  const { petStats, feedPet } = usePet();
  const coins = stats?.coins !== undefined ? Number(stats.coins) : 200;
  const level = stats?.level || 1;
  const unlocked = pet.unlocked_items || ['bg_cozy_guild'];

  // Current Nourishment value allowing up to 100%
  const currentNourishment = pet.nourishment !== undefined
    ? pet.nourishment
    : (petStats?.nourishment !== undefined
        ? petStats.nourishment
        : Math.min(100, Math.max(0, 100 - (pet.hunger !== undefined ? pet.hunger : 20))));

  const handleFeedFruit = async () => {
    if (currentNourishment < 100) {
      if (typeof feedPet === 'function') {
        feedPet(10);
      }
    }
    await handleInteraction('feed');
  };

  // Handle My Talking Tom interactive actions
  const handleInteraction = async (action) => {
    if (isInteracting) return;
    setIsInteracting(true);
    try {
      if (action === 'talk') {
        const nextQuote = PET_QUOTES[Math.floor(Math.random() * PET_QUOTES.length)];
        setSpeech(nextQuote);
      } else {
        const res = await interactPet(action);
        if (action === 'feed') {
          setSpeech("Munch munch! Delicious crisp apple! +15 XP! 🍏");
        } else if (action === 'play') {
          setSpeech("High five! Energy bar surging! Let's conquer the realm! 🐾");
        } else {
          setSpeech("Purrrr... You're the best companion ever! 💕");
        }
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsInteracting(false);
    }
  };

  // Compile shop inventory items by category
  const allItems = [
    ...PET_CATALOG.hats.map(i => ({ ...i, category: 'hats', slot: 'hat' })),
    ...PET_CATALOG.glasses.map(i => ({ ...i, category: 'glasses', slot: 'glasses' })),
    ...PET_CATALOG.outfits.map(i => ({ ...i, category: 'outfits', slot: 'outfit' })),
    ...PET_CATALOG.backgrounds.map(i => ({ ...i, category: 'backgrounds', slot: 'background' }))
  ];

  const filteredItems = selectedCategory === 'all'
    ? allItems
    : allItems.filter(i => i.category === selectedCategory);

  // Handle cosmetic item buy / equip
  const handleItemAction = async (item) => {
    const isUnlocked = unlocked.includes(item.id);
    const isEquipped =
      pet[`equipped_${item.slot}`] === item.id ||
      (item.slot === 'background' && pet.equipped_background === item.id);

    if (!isUnlocked) {
      // Purchase item
      if (coins < item.cost) {
        notify(`Need ${item.cost} coins! You have ${coins} coins. Complete quests or earn scout badges!`, 'warning');
        return;
      }
      try {
        await buyPetItem(item.id, item.cost, item.slot);
      } catch (e) {}
    } else {
      // Toggle equip/unequip
      try {
        await equipPetItem(item.slot, isEquipped ? null : item.id);
      } catch (e) {}
    }
  };

  const scoutBadges = stats?.scout_badges || [];

  return (
    <div className="p-4 space-y-4 max-w-5xl mx-auto animate-in fade-in select-none">
      {/* 1. Header Navigation Switcher: Pet Wardrobe vs Hall of Honor */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-2.5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('wardrobe')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-pixel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'wardrobe'
                ? 'bg-[#8B7CFF] text-white shadow-sm shadow-[#8B7CFF]/25'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shirt size={15} />
            <span>PET & WARDROBE</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('scout_board')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-pixel font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'scout_board'
                ? 'bg-[#8B7CFF] text-white shadow-sm shadow-[#8B7CFF]/25'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award size={15} />
            <span>HALL OF HONOR (BADGES)</span>
          </button>
        </div>

        {/* Coins Wallet Counter */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          <Coins size={16} className="text-amber-500 fill-amber-400" />
          <span className="font-pixel text-xs text-amber-900 font-bold">
            {coins.toLocaleString()} COINS
          </span>
        </div>
      </div>

      {activeSubTab === 'wardrobe' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Interactive My Talking Tom Pet Stage Showcase */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-sm">
              <InteractivePet
                stage={pet.stage || 'baby'}
                level={level}
                equipped={{
                  hat: pet.equipped_hat,
                  glasses: pet.equipped_glasses,
                  outfit: pet.equipped_outfit,
                  background: pet.equipped_background || 'bg_cozy_guild'
                }}
                speechText={speech}
                happiness={pet.happiness || 85}
                hunger={pet.hunger || 20}
                onPetClick={() => handleInteraction('pet')}
                size={210}
              />

              {/* Pet Stats Bars (Happiness & Satiety) */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-sans-app">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="flex items-center justify-between mb-1 font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Heart size={12} className="text-pink-500 fill-pink-500" /> Happiness
                    </span>
                    <span className="font-mono-app text-pink-600">{pet.happiness || 85}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-pink-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${pet.happiness || 85}%` }}
                    />
                  </div>
                </div>

                <div className="stat-bar bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="flex items-center justify-between mb-1 font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Apple size={12} className="text-green-600 fill-green-500" /> Nourishment: {currentNourishment}%
                    </span>
                    <span className="font-mono-app text-green-700">{currentNourishment}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bar-fill bg-green-500 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${currentNourishment}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Talking Tom Interactive Action Buttons */}
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleInteraction('pet')}
                  disabled={isInteracting}
                  className="py-2.5 px-2 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl text-[10px] font-pixel text-pink-700 font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Heart size={14} className="text-pink-500 fill-pink-500" />
                  <span>PET ME</span>
                </button>

                <button
                  type="button"
                  onClick={handleFeedFruit}
                  disabled={isInteracting}
                  className="btn-feed py-2.5 px-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-[10px] font-pixel text-green-700 font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Apple size={14} className="text-green-600" />
                  <span>🍏 FEED FRUIT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInteraction('play')}
                  disabled={isInteracting}
                  className="py-2.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[10px] font-pixel text-amber-800 font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <Hand size={14} className="text-amber-600" />
                  <span>HIGH FIVE</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInteraction('talk')}
                  disabled={isInteracting}
                  className="py-2.5 px-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-[10px] font-pixel text-purple-700 font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 shadow-2xs"
                >
                  <MessageSquare size={14} className="text-purple-600" />
                  <span>TIP</span>
                </button>
              </div>

              {/* Evolution Roadmap Banner */}
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] font-pixel font-bold text-purple-900 mb-1">
                  <span>PET GROWTH MILESTONES</span>
                  <Sparkles size={13} className="text-purple-600" />
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-sans-app mt-2">
                  <div className={`p-1.5 rounded-lg border ${level >= 1 ? 'bg-purple-100 border-purple-300 font-bold text-purple-900' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <div>🍼 Baby</div>
                    <div className="font-mono-app text-[8px]">Lvl 1-9</div>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${level >= 10 ? 'bg-purple-100 border-purple-300 font-bold text-purple-900' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <div>🔥 Teen</div>
                    <div className="font-mono-app text-[8px]">Lvl 10-24</div>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${level >= 25 ? 'bg-purple-100 border-purple-300 font-bold text-purple-900' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <div>🛡️ Adult</div>
                    <div className="font-mono-app text-[8px]">Lvl 25-49</div>
                  </div>
                  <div className={`p-1.5 rounded-lg border ${level >= 50 ? 'bg-purple-100 border-purple-300 font-bold text-purple-900' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                    <div>👑 Legend</div>
                    <div className="font-mono-app text-[8px]">Lvl 50+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Wardrobe & Cosmetics Shop Catalog */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-pixel text-sm text-slate-900 font-bold flex items-center gap-2">
                    <ShoppingBag size={16} className="text-[#8B7CFF]" />
                    <span>COSMETICS & WARDROBE SHOP</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-sans-app mt-0.5">
                    Unlock and equip custom gear for your pet companion using earned coins.
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'all', label: 'All Gear' },
                  { id: 'hats', label: 'Hats 🎩' },
                  { id: 'glasses', label: 'Glasses 🕶️' },
                  { id: 'outfits', label: 'Outfits 🥋' },
                  { id: 'backgrounds', label: 'Scenes 🏞️' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans-app font-medium whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#8B7CFF] text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {filteredItems.map(item => {
                  const isUnlocked = unlocked.includes(item.id);
                  const isEquipped =
                    pet[`equipped_${item.slot}`] === item.id ||
                    (item.slot === 'background' && pet.equipped_background === item.id);

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'border-[#8B7CFF] bg-[#8B7CFF]/5 shadow-xs'
                          : isUnlocked
                          ? 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl p-2 bg-slate-50 border border-slate-200 rounded-xl shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-sans-app font-bold text-xs text-slate-900 truncate">
                              {item.name}
                            </h4>
                          </div>
                          <p className="text-[10px] text-slate-500 font-sans-app mt-0.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        {!isUnlocked ? (
                          <div className="flex items-center gap-1 text-xs font-pixel font-bold text-amber-800">
                            <Coins size={13} className="text-amber-500 fill-amber-400" />
                            <span>{item.cost} Coins</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-pixel text-emerald-600 font-bold flex items-center gap-1">
                            <Check size={12} /> UNLOCKED
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleItemAction(item)}
                          className={`px-3 py-1.5 rounded-xl font-pixel text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                            isEquipped
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : isUnlocked
                              ? 'bg-[#8B7CFF] hover:bg-[#7C3AED] text-white shadow-xs'
                              : coins >= item.cost
                              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isEquipped ? 'UNEQUIP' : isUnlocked ? 'EQUIP' : `BUY 🪙`}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Scout Honor Board & Achievement Badges (Hall of Honor) */
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-pixel text-base text-slate-900 font-bold flex items-center gap-2">
                <Award size={20} className="text-[#8B7CFF]" />
                <span>HALL OF HONOR: SCOUT TROOP BADGES</span>
              </h3>
              <p className="text-xs text-slate-500 font-sans-app mt-1">
                Push beyond standard daily targets to unlock 1 to 3 Star Overachiever badges and pocket coin bounties!
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-xs font-pixel text-purple-900 font-bold self-start">
              ⭐ OVERACHIEVER REWARDS ENABLED
            </div>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoutBadges.map((badge) => {
              const pct = Math.min(100, Math.round(((badge.current || 0) / (badge.target || 1)) * 100));
              const canClaim = !badge.claimed && badge.stars >= 1;

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    badge.isOverachiever
                      ? 'border-amber-300 bg-gradient-to-br from-amber-50/60 to-orange-50/40 shadow-sm'
                      : badge.claimed
                      ? 'border-emerald-200 bg-emerald-50/15'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                          {badge.badgeIcon || '🎖️'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-pixel text-xs text-slate-900 font-bold">{badge.title}</h4>
                            {badge.isOverachiever && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-pixel font-bold rounded-full animate-pulse">
                                OVERACHIEVER!
                              </span>
                            )}
                          </div>
                          {/* Star Rating Display */}
                          <div className="flex items-center gap-1 mt-1 text-amber-500">
                            {[1, 2, 3].map((starNum) => (
                              <Star
                                key={starNum}
                                size={14}
                                className={starNum <= badge.stars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}
                              />
                            ))}
                            <span className="text-[10px] font-mono-app font-bold text-slate-500 ml-1">
                              ({badge.stars}/3 Stars)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-pixel text-amber-800 font-bold flex items-center gap-1 justify-end">
                          <Coins size={12} className="text-amber-500 fill-amber-400" />
                          <span>+{badge.coinsReward} Coins</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-sans-app leading-relaxed mb-3">
                      {badge.description}
                    </p>

                    {/* Progress Bar towards target */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center justify-between text-[10px] font-mono-app text-slate-500">
                        <span>Progress: {badge.current?.toLocaleString()} / {badge.target?.toLocaleString()} {badge.unit}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            badge.isOverachiever ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-[#8B7CFF]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Claim Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-sans-app">
                      {badge.claimed ? 'Reward deposited into coin wallet' : 'Attain targets to claim bounties'}
                    </span>

                    <button
                      type="button"
                      disabled={badge.claimed}
                      onClick={() => claimBadge(badge.id)}
                      className={`px-4 py-2 rounded-xl font-pixel text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        badge.claimed
                          ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed font-medium'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 active:scale-95'
                      }`}
                    >
                      {badge.claimed ? (
                        <>
                          <Check size={13} />
                          <span>CLAIMED ✔</span>
                        </>
                      ) : (
                        <>
                          <Award size={13} />
                          <span>CLAIM BOUNTY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetWardrobeScreen;
