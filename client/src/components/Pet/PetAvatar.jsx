import React from 'react';
import './PetAvatar.css';

/**
 * Standardized Unified Canvas Overlay Grid for Pet and Wearable Accessories
 * All layers share the identical 1:1 aspect ratio and 100x100 viewBox coordinate plane.
 * Glasses snap directly to eyes (y: 36-50), Hats to head top (y: 6-26), Outfits to torso (y: 54-78).
 */
export const ACCESSORY_OFFSETS = {
  glasses: { top: '0', left: '0', width: '100%', height: '100%', zIndex: 3 },
  hats: { top: '0', left: '0', width: '100%', height: '100%', zIndex: 4 },
  hat: { top: '0', left: '0', width: '100%', height: '100%', zIndex: 4 },
  body: { top: '0', left: '0', width: '100%', height: '100%', zIndex: 2 },
  outfit: { top: '0', left: '0', width: '100%', height: '100%', zIndex: 2 }
};

export const PetAvatar = ({
  stage = 'baby',
  state = 'idle',
  equipped = {},
  size = 220,
  className = ''
}) => {
  const hatId = equipped.hat || equipped.head || equipped.equipped_hat;
  const glassesId = equipped.glasses || equipped.equipped_glasses;
  const outfitId = equipped.outfit || equipped.body || equipped.equipped_outfit;

  // Support for external image paths if passed
  const isHatImage = typeof hatId === 'string' && (hatId.includes('/') || hatId.endsWith('.png'));
  const isGlassesImage = typeof glassesId === 'string' && (glassesId.includes('/') || glassesId.endsWith('.png'));
  const isOutfitImage = typeof outfitId === 'string' && (outfitId.includes('/') || outfitId.endsWith('.png'));

  return (
    <div
      className={`pet-canvas-container select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {/* 1. Base Pet Layer */}
      <div className="pet-layer pet-base">
        {stage === 'baby' && <BabyPetStage state={state} />}
        {stage === 'teen' && <TeenPetStage state={state} />}
        {stage === 'adult' && <AdultPetStage state={state} />}
        {stage === 'champion' && <ChampionPetStage state={state} />}
      </div>

      {/* 2. Clothes / Body Layer */}
      {outfitId && (
        isOutfitImage ? (
          <img src={outfitId} className="pet-layer pet-body-item" alt="Body Outfit" />
        ) : (
          <div className="pet-layer pet-body-item">
            <OutfitGraphic id={outfitId} />
          </div>
        )
      )}

      {/* 3. Eyewear Layer */}
      {glassesId && (
        isGlassesImage ? (
          <img src={glassesId} className="pet-layer pet-glasses-item" alt="Glasses" />
        ) : (
          <div className="pet-layer pet-glasses-item">
            <GlassesGraphic id={glassesId} />
          </div>
        )
      )}

      {/* 4. Headwear Layer */}
      {hatId && (
        isHatImage ? (
          <img src={hatId} className="pet-layer pet-hat-item" alt="Hat" />
        ) : (
          <div className="pet-layer pet-hat-item">
            <HatGraphic id={hatId} />
          </div>
        )
      )}
    </div>
  );
};

/* --- Vector Sprite Bases (Unified 100x100 Grid) --- */
export const BabyPetStage = ({ state = 'idle' }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-lg">
    <circle cx="50" cy="50" r="42" fill="#FF85A1" fillOpacity="0.18" />
    <rect x="30" y="16" width="9" height="14" rx="4" fill="#FBBF24" />
    <rect x="61" y="16" width="9" height="14" rx="4" fill="#FBBF24" />
    <rect x="25" y="26" width="50" height="48" rx="18" fill="#FF85A1" />
    <rect x="30" y="32" width="40" height="38" rx="14" fill="#FFA6BC" />
    <rect x="34" y="38" width="10" height="12" rx="4" fill="#0F172A" />
    <circle cx="37" cy="41" r="3" fill="#FFFFFF" />
    <circle cx="41" cy="46" r="1.5" fill="#FFFFFF" />
    <rect x="56" y="38" width="10" height="12" rx="4" fill="#0F172A" />
    <circle cx="59" cy="41" r="3" fill="#FFFFFF" />
    <circle cx="63" cy="46" r="1.5" fill="#FFFFFF" />
    <ellipse cx="32" cy="52" rx="4" ry="2.5" fill="#FF4757" opacity="0.6" />
    <ellipse cx="68" cy="52" rx="4" ry="2.5" fill="#FF4757" opacity="0.6" />
    {state === 'damage' ? (
      <path d="M46 56 Q50 52 54 56" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M45 54 Q50 60 55 54" stroke="#0F172A" strokeWidth="2.5" fill="#FF4757" strokeLinecap="round" />
    )}
    <circle cx="34" cy="74" r="6" fill="#D946EF" />
    <circle cx="66" cy="74" r="6" fill="#D946EF" />
  </svg>
);

export const TeenPetStage = ({ state = 'idle' }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-xl">
    <circle cx="50" cy="50" r="45" fill="#8B7CFF" fillOpacity="0.16" />
    <polygon points="26,10 35,28 22,28" fill="#F59E0B" />
    <polygon points="74,10 65,28 78,28" fill="#F59E0B" />
    <rect x="22" y="24" width="56" height="52" rx="16" fill="#A855F7" />
    <rect x="28" y="30" width="44" height="42" rx="12" fill="#C084FC" />
    <polygon points="30,62 70,62 50,75" fill="#EF4444" />
    <circle cx="50" cy="64" r="3" fill="#FBBF24" />
    <rect x="33" y="36" width="11" height="12" rx="3" fill="#0F172A" />
    <circle cx="37" cy="39" r="3" fill="#FFFFFF" />
    <rect x="56" y="36" width="11" height="12" rx="3" fill="#0F172A" />
    <circle cx="60" cy="39" r="3" fill="#FFFFFF" />
    <path d="M44 54 Q50 58 56 52" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx="30" cy="76" r="7" fill="#7E22CE" />
    <circle cx="70" cy="76" r="7" fill="#7E22CE" />
  </svg>
);

export const AdultPetStage = ({ state = 'idle' }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-2xl">
    <path d="M15 45 C5 25 15 15 28 35 Z" fill="#6366F1" opacity="0.85" />
    <path d="M85 45 C95 25 85 15 72 35 Z" fill="#6366F1" opacity="0.85" />
    <path d="M28 22 L20 6 L32 14" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M72 22 L80 6 L68 14" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="20" y="22" width="60" height="56" rx="16" fill="#4F46E5" />
    <rect x="26" y="28" width="48" height="46" rx="12" fill="#6366F1" />
    <polygon points="50,56 62,68 50,78 38,68" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="50" cy="67" r="2.5" fill="#EF4444" />
    <polygon points="32,38 43,40 41,48 30,46" fill="#0F172A" />
    <circle cx="37" cy="43" r="2.5" fill="#67E8F9" />
    <polygon points="68,38 57,40 59,48 70,46" fill="#0F172A" />
    <circle cx="63" cy="43" r="2.5" fill="#67E8F9" />
    <rect x="25" y="76" width="14" height="9" rx="4" fill="#312E81" />
    <rect x="61" y="76" width="14" height="9" rx="4" fill="#312E81" />
  </svg>
);

export const ChampionPetStage = ({ state = 'idle' }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" className="image-pixelated drop-shadow-2xl">
    <circle cx="50" cy="50" r="46" fill="#F59E0B" opacity="0.25" />
    <path d="M12 40 C-2 15 12 5 30 28 Z" fill="#F43F5E" />
    <path d="M88 40 C102 15 88 5 70 28 Z" fill="#F43F5E" />
    <path d="M25 20 Q15 0 28 4 Q20 12 32 18" fill="#FBBF24" />
    <path d="M75 20 Q85 0 72 4 Q80 12 68 18" fill="#FBBF24" />
    <polygon points="34,8 42,16 50,6 58,16 66,8 64,22 36,22" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    <circle cx="50" cy="14" r="2.5" fill="#EF4444" />
    <rect x="18" y="22" width="64" height="58" rx="18" fill="#E11D48" />
    <rect x="24" y="28" width="52" height="48" rx="14" fill="#F43F5E" />
    <polygon points="50,52 65,66 50,80 35,66" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
    <polygon points="50,56 60,66 50,76 40,66" fill="#67E8F9" />
    <polygon points="31,36 44,39 42,47 29,44" fill="#0F172A" />
    <circle cx="37" cy="42" r="3" fill="#FDE047" />
    <polygon points="69,36 56,39 58,47 71,44" fill="#0F172A" />
    <circle cx="63" cy="42" r="3" fill="#FDE047" />
    <rect x="23" y="76" width="16" height="10" rx="4" fill="#9F1239" />
    <rect x="61" y="76" width="16" height="10" rx="4" fill="#9F1239" />
  </svg>
);

/* --- Wearable Graphic Overlays (Unified 100x100 ViewBox) --- */
export const HatGraphic = ({ id }) => {
  if (id === 'hat_wizard') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <polygon points="50,4 26,26 74,26" fill="#7C3AED" stroke="#5B21B6" strokeWidth="1.5" />
        <ellipse cx="50" cy="26" rx="30" ry="6" fill="#5B21B6" />
        <polygon points="50,11 52,15 57,15 53,18 55,22 50,19 45,22 47,18 43,15 48,15" fill="#FBBF24" />
      </svg>
    );
  }
  if (id === 'hat_crown') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <polygon points="24,25 30,10 40,18 50,5 60,18 70,10 76,25" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <circle cx="50" cy="18" r="3" fill="#EF4444" />
        <circle cx="34" cy="21" r="2.2" fill="#3B82F6" />
        <circle cx="66" cy="21" r="2.2" fill="#10B981" />
      </svg>
    );
  }
  if (id === 'hat_chef') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <ellipse cx="50" cy="15" rx="22" ry="13" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.8" />
        <rect x="33" y="21" width="34" height="8" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
      </svg>
    );
  }
  if (id === 'hat_cowboy') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <ellipse cx="50" cy="25" rx="36" ry="7" fill="#78350F" />
        <path d="M35 25 C35 13 43 11 50 13 C57 11 65 13 65 25 Z" fill="#92400E" />
        <rect x="37" y="22" width="26" height="3" fill="#B45309" />
      </svg>
    );
  }
  if (id === 'hat_ninja') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <rect x="22" y="24" width="56" height="8" rx="3" fill="#DC2626" />
        <circle cx="50" cy="28" r="3" fill="#F8FAFC" />
        <path d="M78 28 L88 22 M78 30 L89 34" stroke="#DC2626" strokeWidth="2.5" />
      </svg>
    );
  }
  if (id === 'hat_viking') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <ellipse cx="50" cy="25" rx="24" ry="8" fill="#64748B" stroke="#334155" strokeWidth="1.5" />
        <path d="M26 23 Q18 10 22 4 Q30 14 32 21 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
        <path d="M74 23 Q82 10 78 4 Q70 14 68 21 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
      </svg>
    );
  }
  return null;
};

export const GlassesGraphic = ({ id }) => {
  if (id === 'glasses_shades') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <rect x="27" y="36" width="20" height="15" rx="3" fill="#0F172A" />
        <rect x="53" y="36" width="20" height="15" rx="3" fill="#0F172A" />
        <line x1="47" y1="41" x2="53" y2="41" stroke="#0F172A" strokeWidth="2.5" />
        <line x1="30" y1="39" x2="36" y2="47" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
        <line x1="56" y1="39" x2="62" y2="47" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
      </svg>
    );
  }
  if (id === 'glasses_steampunk') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <circle cx="38" cy="44" r="9.5" fill="#3B82F6" stroke="#D97706" strokeWidth="3" />
        <circle cx="62" cy="44" r="9.5" fill="#3B82F6" stroke="#D97706" strokeWidth="3" />
        <rect x="47" y="42" width="6" height="4" fill="#B45309" />
      </svg>
    );
  }
  if (id === 'glasses_monocle') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <circle cx="62" cy="44" r="9" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
        <path d="M71 44 Q77 53 74 61" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  if (id === 'glasses_nerd') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <rect x="28" y="35" width="19" height="17" rx="5" fill="none" stroke="#78350F" strokeWidth="2.5" />
        <rect x="53" y="35" width="19" height="17" rx="5" fill="none" stroke="#78350F" strokeWidth="2.5" />
        <line x1="47" y1="42" x2="53" y2="42" stroke="#78350F" strokeWidth="2.5" />
      </svg>
    );
  }
  return null;
};

export const OutfitGraphic = ({ id }) => {
  if (id === 'outfit_knight') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <path d="M28 55 L72 55 L65 77 L35 77 Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
        <polygon points="50,59 56,66 50,73 44,66" fill="#F59E0B" />
      </svg>
    );
  }
  if (id === 'outfit_cloak') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <path d="M26 53 Q50 59 74 53 L68 79 Q50 75 32 79 Z" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
        <circle cx="50" cy="58" r="3" fill="#FBBF24" />
      </svg>
    );
  }
  if (id === 'outfit_tuxedo') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <rect x="30" y="55" width="40" height="22" rx="3" fill="#0F172A" />
        <polygon points="42,55 58,55 50,65" fill="#F8FAFC" />
        <polygon points="45,57 55,57 50,60" fill="#DC2626" />
      </svg>
    );
  }
  if (id === 'outfit_champion') {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%" className="drop-shadow-md">
        <rect x="25" y="60" width="50" height="12" rx="2" fill="#1E293B" />
        <circle cx="50" cy="66" r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
      </svg>
    );
  }
  return null;
};

export default PetAvatar;
