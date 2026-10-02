import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Apple, Smile, Crown, Shield, Flame, Star } from 'lucide-react';
import { ACCESSORY_OFFSETS, HatGraphic, GlassesGraphic, OutfitGraphic } from './PetAvatar.jsx';
import { usePet } from '../../context/PetContext.jsx';
import './PetAvatar.css';

/**
 * Interactive Pet Avatar Component (My Talking Tom Style)
 * Renders 4 Evolution Stages:
 * - Baby (Level 1-9)
 * - Teen (Level 10-24)
 * - Adult (Level 25-49)
 * - Champion/Legendary (Level 50+)
 *
 * Equipped accessories rendered on top:
 * - Hats: hat_wizard, hat_crown, hat_chef, hat_cowboy, hat_ninja, hat_viking
 * - Glasses: glasses_shades, glasses_steampunk, glasses_monocle, glasses_nerd
 * - Outfits: outfit_knight, outfit_cloak, outfit_tuxedo, outfit_champion
 * - Backgrounds: bg_cozy_guild, bg_mystic_forest, bg_citadel_throne, bg_cyber_dojo
 */

export const PET_CATALOG = {
  hats: [
    { id: 'hat_wizard', name: 'Archmage Wizard Hat', cost: 150, icon: '🧙‍♂️', desc: 'Infused with starlight mana +10% wisdom' },
    { id: 'hat_crown', name: 'Royal Gold Crown', cost: 300, icon: '👑', desc: 'Forged for citadel royalty with sparkling ruby' },
    { id: 'hat_chef', name: 'Master Chef Toque', cost: 120, icon: '👨‍🍳', desc: 'Indicates culinary authority on healthy macros' },
    { id: 'hat_cowboy', name: 'Ranger Wide-Brim Fedora', cost: 180, icon: '🤠', desc: 'Rugged leather for outdoor trail walking' },
    { id: 'hat_ninja', name: 'Shinobi Crimson Headband', cost: 140, icon: '🥷', desc: 'Swift reflexes for high-velocity step pacing' },
    { id: 'hat_viking', name: 'Viking Horned Helmet', cost: 220, icon: '⚔️', desc: 'Norse resilience for enduring boss battles' }
  ],
  glasses: [
    { id: 'glasses_shades', name: 'Cyber 8-Bit Shades', cost: 100, icon: '🕶️', desc: 'High coolness factor +20 style aura' },
    { id: 'glasses_steampunk', name: 'Steampunk Brass Goggles', cost: 160, icon: '🥽', desc: 'Fine-tuned magnification for ingredient labels' },
    { id: 'glasses_monocle', name: 'Scholar Golden Monocle', cost: 120, icon: '🧐', desc: 'For distinguished calorie accounting' },
    { id: 'glasses_nerd', name: 'Professor Horn-Rim Frames', cost: 110, icon: '👓', desc: 'Mastery over nutrition chemistry' }
  ],
  outfits: [
    { id: 'outfit_knight', name: 'Paladin Steel Plate', cost: 350, icon: '🛡️', desc: 'Polished silver armor guarding against junk food' },
    { id: 'outfit_cloak', name: 'Emerald Ranger Cloak', cost: 220, icon: '🧥', desc: 'Weatherproof camouflage for long hikes' },
    { id: 'outfit_tuxedo', name: 'Gala Black Tuxedo', cost: 260, icon: '🤵', desc: 'Dressed to impress at the healthy banquet' },
    { id: 'outfit_champion', name: 'Champion Martial Gi & Belt', cost: 250, icon: '🥋', desc: 'Golden buckle representing peak physical form' }
  ],
  backgrounds: [
    { id: 'bg_cozy_guild', name: 'Cozy Hearthstone Inn', cost: 0, icon: '🏡', bgGradient: 'from-amber-100 via-orange-50 to-amber-200', desc: 'A warm fireplace with crackling oak logs' },
    { id: 'bg_mystic_forest', name: 'Enchanted Luminescent Grove', cost: 200, icon: '🌲', bgGradient: 'from-emerald-950 via-teal-900 to-emerald-900', isDark: true, desc: 'Bioluminescent mushrooms and floating fairy orbs' },
    { id: 'bg_citadel_throne', name: 'Golden Sun Citadel', cost: 350, icon: '🏛️', bgGradient: 'from-sky-100 via-amber-50 to-indigo-100', desc: 'Towering marble pillars overlooking the kingdom' },
    { id: 'bg_cyber_dojo', name: 'Neon Cyber Dojo', cost: 300, icon: '🌆', bgGradient: 'from-slate-950 via-purple-950 to-slate-900', isDark: true, desc: 'Holographic calorie HUD and neon violet lanterns' }
  ]
};

export const InteractivePet = ({
  stage = 'baby',
  level = 1,
  equipped = {},
  petState = 'idle',
  happiness = 85,
  hunger = 20,
  speechText = '',
  onPetClick = null,
  size = 220,
  showControls = false
}) => {
  const { petStats, feedPet } = usePet();
  const [bouncing, setBouncing] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Exact nourishment calculation up to 100%
  const currentNourishment = petStats?.nourishment !== undefined
    ? petStats.nourishment
    : Math.min(100, Math.max(0, 100 - (hunger !== undefined ? hunger : 20)));

  const handleFeedFruit = (e) => {
    if (e) e.stopPropagation();
    if (currentNourishment < 100) {
      feedPet(10); // Adds 10% nourishment until reaching 100%
    }
  };

  // Trigger temporary bounce & heart burst when petted
  const handleClick = () => {
    setBouncing(true);
    setShowHeartBurst(true);
    setTimeout(() => setBouncing(false), 600);
    setTimeout(() => setShowHeartBurst(false), 1200);
    if (onPetClick) onPetClick();
  };

  // Determine background
  const bgItem = PET_CATALOG.backgrounds.find(b => b.id === equipped.background) || PET_CATALOG.backgrounds[0];

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none bg-gradient-to-b ${bgItem.bgGradient}`}
      style={{ minHeight: `${size + 100}px` }}
    >
      {/* Background Decor Elements */}
      {bgItem.id === 'bg_mystic_forest' && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-4 left-6 text-emerald-300 animate-pulse text-lg">✨</div>
          <div className="absolute top-12 right-10 text-teal-200 animate-bounce text-sm">🌟</div>
          <div className="absolute bottom-6 left-12 text-green-400 text-xs">🍄</div>
        </div>
      )}
      {bgItem.id === 'bg_cyber_dojo' && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(#8B7CFF_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute top-6 right-6 text-[#8B7CFF] text-xs font-mono-app font-bold animate-pulse">SYSTEM OPTIMAL</div>
        </div>
      )}
      {bgItem.id === 'bg_citadel_throne' && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-amber-400 text-4xl">👑</div>
        </div>
      )}

      {/* Floating Speech Bubble with generous headroom to avoid hat clipping */}
      {speechText && (
        <div
          className="speech-bubble relative z-30 mb-6 max-w-[280px] bg-white/95 backdrop-blur-md border border-slate-200 px-4 py-2.5 rounded-2xl shadow-xl text-center animate-in zoom-in-95 duration-200"
          style={{ marginBottom: '24px', zIndex: 30 }}
        >
          <p className="text-xs font-sans-app font-semibold text-slate-800 leading-snug">
            "{speechText}"
          </p>
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
        </div>
      )}

      {/* Heart Burst Animation */}
      {showHeartBurst && (
        <div className="absolute top-16 z-40 flex items-center justify-center gap-2 pointer-events-none animate-in fade-in zoom-in-125 duration-300">
          <span className="text-2xl animate-bounce">💖</span>
          <span className="text-xl animate-pulse">✨</span>
          <span className="text-2xl animate-bounce delay-75">💕</span>
        </div>
      )}

      {/* Pet Character Stage Container (Unified Canvas Overlay Grid) */}
      <div
        className={`pet-canvas-container relative z-20 flex items-center justify-center transition-transform duration-300 ${
          bouncing ? 'scale-110 -translate-y-2' : 'hover:scale-105'
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {/* 1. Base Pet Layer */}
        <div className="pet-layer pet-base">
          {stage === 'baby' && <BabyPetStage state={petState} />}
          {stage === 'teen' && <TeenPetStage state={petState} />}
          {stage === 'adult' && <AdultPetStage state={petState} />}
          {stage === 'champion' && <ChampionPetStage state={petState} />}
        </div>

        {/* 2. Clothes / Body Layer */}
        {equipped.outfit && (
          <div className="pet-layer pet-body-item">
            <OutfitGraphic id={equipped.outfit} />
          </div>
        )}

        {/* 3. Eyewear Layer */}
        {equipped.glasses && (
          <div className="pet-layer pet-glasses-item">
            <GlassesGraphic id={equipped.glasses} />
          </div>
        )}

        {/* 4. Headwear Layer */}
        {equipped.hat && (
          <div className="pet-layer pet-hat-item">
            <HatGraphic id={equipped.hat} />
          </div>
        )}
      </div>

      {/* Pet Name & Evolution Stage Badge */}
      <div className="relative z-20 mt-4 flex items-center gap-2">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-pixel font-bold text-slate-800 shadow-sm border border-slate-200 flex items-center gap-1.5">
          {stage === 'champion' && <Crown size={13} className="text-amber-500 fill-amber-400" />}
          {stage === 'adult' && <Shield size={13} className="text-indigo-500" />}
          {stage === 'teen' && <Flame size={13} className="text-orange-500" />}
          {stage === 'baby' && <Sparkles size={13} className="text-pink-500" />}
          <span className="capitalize">{stage} Stage</span>
          <span className="text-[10px] text-slate-400 font-mono-app font-normal">(Lvl {level})</span>
        </span>
      </div>
    </div>
  );
};

/* --- 1. BABY STAGE (Level 1-9): Cute, tiny paws, sweet anime eyes, baby horns --- */
const BabyPetStage = ({ state }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-lg">
    {/* Soft floating aura */}
    <circle cx="50" cy="50" r="42" fill="#FF85A1" fillOpacity="0.18" />

    {/* Tiny cute baby horns */}
    <rect x="30" y="16" width="9" height="14" rx="4" fill="#FBBF24" />
    <rect x="61" y="16" width="9" height="14" rx="4" fill="#FBBF24" />

    {/* Baby Body */}
    <rect x="25" y="26" width="50" height="48" rx="18" fill="#FF85A1" />
    <rect x="30" y="32" width="40" height="38" rx="14" fill="#FFA6BC" />

    {/* Big Shiny Anime Eyes */}
    <rect x="34" y="38" width="10" height="12" rx="4" fill="#0F172A" />
    <circle cx="37" cy="41" r="3" fill="#FFFFFF" />
    <circle cx="41" cy="46" r="1.5" fill="#FFFFFF" />

    <rect x="56" y="38" width="10" height="12" rx="4" fill="#0F172A" />
    <circle cx="59" cy="41" r="3" fill="#FFFFFF" />
    <circle cx="63" cy="46" r="1.5" fill="#FFFFFF" />

    {/* Rosy Cheeks */}
    <ellipse cx="32" cy="52" rx="4" ry="2.5" fill="#FF4757" opacity="0.6" />
    <ellipse cx="68" cy="52" rx="4" ry="2.5" fill="#FF4757" opacity="0.6" />

    {/* Cute Open Mouth */}
    {state === 'damage' ? (
      <path d="M46 56 Q50 52 54 56" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M45 54 Q50 60 55 54" stroke="#0F172A" strokeWidth="2.5" fill="#FF4757" strokeLinecap="round" />
    )}

    {/* Baby Paws */}
    <circle cx="34" cy="74" r="6" fill="#D946EF" />
    <circle cx="66" cy="74" r="6" fill="#D946EF" />
  </svg>
);

/* --- 2. TEEN STAGE (Level 10-24): Spirited posture, scout bandana, dynamic pose --- */
const TeenPetStage = ({ state }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-xl">
    {/* Energy Ring */}
    <circle cx="50" cy="50" r="45" fill="#8B7CFF" fillOpacity="0.16" />

    {/* Sharper Teen Horns */}
    <polygon points="26,10 35,28 22,28" fill="#F59E0B" />
    <polygon points="74,10 65,28 78,28" fill="#F59E0B" />

    {/* Main Body */}
    <rect x="22" y="24" width="56" height="52" rx="16" fill="#A855F7" />
    <rect x="28" y="30" width="44" height="42" rx="12" fill="#C084FC" />

    {/* Scout Bandana / Collar */}
    <polygon points="30,62 70,62 50,75" fill="#EF4444" />
    <circle cx="50" cy="64" r="3" fill="#FBBF24" />

    {/* Expressive Eyes */}
    <rect x="33" y="36" width="11" height="12" rx="3" fill="#0F172A" />
    <circle cx="37" cy="39" r="3" fill="#FFFFFF" />
    <rect x="56" y="36" width="11" height="12" rx="3" fill="#0F172A" />
    <circle cx="60" cy="39" r="3" fill="#FFFFFF" />

    {/* Confident Smirk */}
    <path d="M44 54 Q50 58 56 52" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

    {/* Paws */}
    <circle cx="30" cy="76" r="7" fill="#7E22CE" />
    <circle cx="70" cy="76" r="7" fill="#7E22CE" />
  </svg>
);

/* --- 3. ADULT STAGE (Level 25-49): Majestic paladin beast, armored chest crest, wings --- */
const AdultPetStage = ({ state }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-2xl">
    {/* Wings */}
    <path d="M15 45 C5 25 15 15 28 35 Z" fill="#6366F1" opacity="0.85" />
    <path d="M85 45 C95 25 85 15 72 35 Z" fill="#6366F1" opacity="0.85" />

    {/* Noble Golden Antlers / Horns */}
    <path d="M28 22 L20 6 L32 14" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M72 22 L80 6 L68 14" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* Majestic Body */}
    <rect x="20" y="22" width="60" height="56" rx="16" fill="#4F46E5" />
    <rect x="26" y="28" width="48" height="46" rx="12" fill="#6366F1" />

    {/* Golden Paladin Breastplate Emblem */}
    <polygon points="50,56 62,68 50,78 38,68" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="50" cy="67" r="2.5" fill="#EF4444" />

    {/* Piercing Heroic Eyes */}
    <polygon points="32,38 43,40 41,48 30,46" fill="#0F172A" />
    <circle cx="37" cy="43" r="2.5" fill="#67E8F9" />
    <polygon points="68,38 57,40 59,48 70,46" fill="#0F172A" />
    <circle cx="63" cy="43" r="2.5" fill="#67E8F9" />

    {/* Powerful Paws */}
    <rect x="25" y="76" width="14" height="9" rx="4" fill="#312E81" />
    <rect x="61" y="76" width="14" height="9" rx="4" fill="#312E81" />
  </svg>
);

/* --- 4. CHAMPION / LEGENDARY STAGE (Level 50+): Cosmic Celestial Sovereign Drake --- */
const ChampionPetStage = ({ state }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-2xl">
    {/* Celestial Radiant Corona */}
    <circle cx="50" cy="50" r="46" fill="url(#cosmicGlow)" opacity="0.35" />
    <defs>
      <radialGradient id="cosmicGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="60%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>

    {/* Dragon Wings */}
    <path d="M12 40 C-2 15 12 5 30 28 Z" fill="#F43F5E" />
    <path d="M88 40 C102 15 88 5 70 28 Z" fill="#F43F5E" />

    {/* Blazing Flame Horns */}
    <path d="M25 20 Q15 0 28 4 Q20 12 32 18" fill="#FBBF24" />
    <path d="M75 20 Q85 0 72 4 Q80 12 68 18" fill="#FBBF24" />

    {/* Golden Champion Crown Base */}
    <polygon points="34,8 42,16 50,6 58,16 66,8 64,22 36,22" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <circle cx="50" cy="14" r="2.5" fill="#EF4444" />

    {/* Champion Body */}
    <rect x="18" y="22" width="64" height="58" rx="18" fill="#E11D48" />
    <rect x="24" y="28" width="52" height="48" rx="14" fill="#F43F5E" />

    {/* Celestial Diamond Armor */}
    <polygon points="50,52 65,66 50,80 35,66" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    <polygon points="50,56 60,66 50,76 40,66" fill="#67E8F9" />

    {/* Fierce Glowing Eyes */}
    <polygon points="31,36 44,39 42,47 29,44" fill="#0F172A" />
    <circle cx="37" cy="42" r="3" fill="#FDE047" />
    <circle cx="38" cy="42" r="1.5" fill="#FFFFFF" />

    <polygon points="69,36 56,39 58,47 71,44" fill="#0F172A" />
    <circle cx="63" cy="42" r="3" fill="#FDE047" />
    <circle cx="62" cy="42" r="1.5" fill="#FFFFFF" />

    {/* Armored Dragon Paws */}
    <rect x="23" y="76" width="16" height="10" rx="4" fill="#9F1239" />
    <rect x="61" y="76" width="16" height="10" rx="4" fill="#9F1239" />
  </svg>
);

/* --- Wearable Overlays: Hats --- */
const HatOverlay = ({ hatId }) => <HatGraphic id={hatId} />;

/* --- Wearable Overlays: Glasses --- */
const GlassesOverlay = ({ glassesId }) => <GlassesGraphic id={glassesId} />;

/* --- Wearable Overlays: Outfits --- */
const OutfitOverlay = ({ outfitId }) => <OutfitGraphic id={outfitId} />;

export default InteractivePet;
