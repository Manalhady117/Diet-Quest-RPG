import React from 'react';

/**
 * Pixel Mascot Component
 * States: 'idle' | 'celebrate' | 'damage'
 */
export const PixelMascot = ({ state = 'idle', size = 96, className = '' }) => {
  // SVG Pixel art matrices
  const renderMascot = () => {
    if (state === 'celebrate') {
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          className={`image-pixelated animate-pixel-bounce ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Confetti & floating stars */}
          <rect x="2" y="4" width="2" height="2" fill="#FFD166" />
          <rect x="28" y="5" width="2" height="2" fill="#FF85A1" />
          <rect x="5" y="10" width="1" height="1" fill="#388BFD" />
          <rect x="25" y="11" width="2" height="2" fill="#10B981" />
          
          {/* Golden Crown */}
          <rect x="11" y="2" width="10" height="2" fill="#FFD166" />
          <rect x="10" y="4" width="2" height="3" fill="#F59E0B" />
          <rect x="15" y="3" width="2" height="4" fill="#F59E0B" />
          <rect x="20" y="4" width="2" height="3" fill="#F59E0B" />
          <rect x="15" y="2" width="2" height="1" fill="#FF5252" />

          {/* Happy Mascot Body (Candy Pink & Lavender) */}
          <rect x="8" y="8" width="16" height="16" rx="3" fill="#FF85A1" />
          <rect x="10" y="10" width="12" height="12" fill="#FFA6BC" />

          {/* Joyful Star / Curve Eyes */}
          <rect x="11" y="12" width="3" height="1" fill="#0F172A" />
          <rect x="10" y="13" width="1" height="2" fill="#0F172A" />
          <rect x="14" y="13" width="1" height="2" fill="#0F172A" />

          <rect x="18" y="12" width="3" height="1" fill="#0F172A" />
          <rect x="17" y="13" width="1" height="2" fill="#0F172A" />
          <rect x="21" y="13" width="1" height="2" fill="#0F172A" />

          {/* Big Rosy Cheeks */}
          <rect x="9" y="16" width="3" height="2" fill="#FF5252" opacity="0.8" />
          <rect x="20" y="16" width="3" height="2" fill="#FF5252" opacity="0.8" />

          {/* Big Open Smile */}
          <rect x="13" y="17" width="6" height="3" fill="#0F172A" />
          <rect x="14" y="18" width="4" height="2" fill="#FF5252" />

          {/* Raised Victory Arms */}
          <rect x="5" y="9" width="3" height="3" fill="#FF85A1" />
          <rect x="4" y="7" width="2" height="3" fill="#FFA6BC" />
          <rect x="24" y="9" width="3" height="3" fill="#FF85A1" />
          <rect x="26" y="7" width="2" height="3" fill="#FFA6BC" />

          {/* Feet */}
          <rect x="10" y="24" width="4" height="3" fill="#D946EF" />
          <rect x="18" y="24" width="4" height="3" fill="#D946EF" />
        </svg>
      );
    }

    if (state === 'damage') {
      return (
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          className={`image-pixelated ${className}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sweat Drop */}
          <rect x="23" y="6" width="2" height="3" fill="#388BFD" />
          <rect x="24" y="9" width="1" height="2" fill="#60A5FA" />

          {/* Head Bandage */}
          <rect x="11" y="7" width="6" height="3" fill="#F8FAFC" />
          <rect x="13" y="8" width="2" height="1" fill="#FF5252" />

          {/* Body in Hurt Purple/Pink */}
          <rect x="8" y="9" width="16" height="15" rx="3" fill="#F472B6" />
          <rect x="10" y="11" width="12" height="11" fill="#FB7185" />

          {/* Dizzy X Eyes */}
          {/* Left X */}
          <rect x="11" y="13" width="1" height="1" fill="#0F172A" />
          <rect x="13" y="13" width="1" height="1" fill="#0F172A" />
          <rect x="12" y="14" width="1" height="1" fill="#0F172A" />
          <rect x="11" y="15" width="1" height="1" fill="#0F172A" />
          <rect x="13" y="15" width="1" height="1" fill="#0F172A" />

          {/* Right X */}
          <rect x="18" y="13" width="1" height="1" fill="#0F172A" />
          <rect x="20" y="13" width="1" height="1" fill="#0F172A" />
          <rect x="19" y="14" width="1" height="1" fill="#0F172A" />
          <rect x="18" y="15" width="1" height="1" fill="#0F172A" />
          <rect x="20" y="15" width="1" height="1" fill="#0F172A" />

          {/* Wobbly Sad Mouth */}
          <rect x="13" y="19" width="6" height="1" fill="#0F172A" />
          <rect x="12" y="20" width="2" height="1" fill="#0F172A" />
          <rect x="18" y="20" width="2" height="1" fill="#0F172A" />

          {/* Drooped Arms */}
          <rect x="6" y="16" width="2" height="4" fill="#F472B6" />
          <rect x="24" y="16" width="2" height="4" fill="#F472B6" />

          {/* Feet */}
          <rect x="10" y="24" width="4" height="3" fill="#BE185D" />
          <rect x="18" y="24" width="4" height="3" fill="#BE185D" />
        </svg>
      );
    }

    // Default: 'idle'
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={`image-pixelated animate-pixel-bounce ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft floating aura */}
        <circle cx="16" cy="16" r="14" fill="#FF85A1" fillOpacity="0.12" />

        {/* Mascot Horns / Ears */}
        <rect x="9" y="6" width="3" height="4" fill="#FFD166" />
        <rect x="10" y="4" width="2" height="2" fill="#F59E0B" />
        <rect x="20" y="6" width="3" height="4" fill="#FFD166" />
        <rect x="20" y="4" width="2" height="2" fill="#F59E0B" />

        {/* Mascot Main Body */}
        <rect x="8" y="9" width="16" height="15" rx="3" fill="#FF85A1" />
        <rect x="10" y="11" width="12" height="11" fill="#FFA6BC" />

        {/* Cute Sparkle Eyes */}
        <rect x="11" y="13" width="3" height="4" fill="#0F172A" />
        <rect x="12" y="13" width="1" height="2" fill="#FFFFFF" />
        
        <rect x="18" y="13" width="3" height="4" fill="#0F172A" />
        <rect x="19" y="13" width="1" height="2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <rect x="9" y="17" width="2" height="1" fill="#FF5252" opacity="0.7" />
        <rect x="21" y="17" width="2" height="1" fill="#FF5252" opacity="0.7" />

        {/* Shy Cute Smile */}
        <rect x="14" y="18" width="4" height="1" fill="#0F172A" />
        <rect x="15" y="19" width="2" height="1" fill="#0F172A" />

        {/* Small Front Paws */}
        <rect x="7" y="15" width="2" height="3" fill="#FF85A1" />
        <rect x="23" y="15" width="2" height="3" fill="#FF85A1" />

        {/* Feet */}
        <rect x="10" y="24" width="4" height="2" fill="#D946EF" />
        <rect x="18" y="24" width="4" height="2" fill="#D946EF" />
      </svg>
    );
  };

  return <div className="inline-flex items-center justify-center select-none">{renderMascot()}</div>;
};

/**
 * Pixel Icon Helper for Heart, Potion, Shield, Passes
 */
export const PixelIcon = ({ name = 'heart', size = 20, className = '' }) => {
  if (name === 'heart') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} className={`image-pixelated ${className}`} fill="#FF5252">
        <path d="M2 4h3v2H2zM7 4h2v2H7zM11 4h3v2h-3zM1 6h6v2H1zM9 6h6v2H9zM2 8h12v2H2zM3 10h10v2H3zM5 12h6v2H5zM7 14h2v2H7z" />
      </svg>
    );
  }

  if (name === 'shield') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} className={`image-pixelated ${className}`} fill="#10B981">
        <path d="M2 2h12v2H2zM2 4h12v4H2zM3 8h10v3H3zM4 11h8v2H4zM6 13h4v2H6zM7 15h2v1H7z" />
        <rect x="7" y="4" width="2" height="7" fill="#FFFFFF" fillOpacity="0.8" />
        <rect x="4.5" y="6.5" width="7" height="2" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    );
  }

  if (name === 'potion') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} className={`image-pixelated ${className}`}>
        <rect x="6" y="1" width="4" height="2" fill="#A855F7" />
        <rect x="7" y="3" width="2" height="3" fill="#E2E8F0" />
        <rect x="4" y="6" width="8" height="8" rx="2" fill="#A855F7" />
        <rect x="5" y="7" width="6" height="5" fill="#C084FC" />
        <rect x="6" y="8" width="2" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  if (name === 'energy') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} className={`image-pixelated ${className}`} fill="#388BFD">
        <path d="M8 1h5l-4 6h4l-7 8 2-6H4l4-8z" />
      </svg>
    );
  }

  if (name === 'gold') {
    return (
      <svg viewBox="0 0 16 16" width={size} height={size} className={`image-pixelated ${className}`} fill="#FFD166">
        <circle cx="8" cy="8" r="6" stroke="#D97706" strokeWidth="2" fill="#FFD166" />
        <rect x="6" y="5" width="4" height="6" fill="#D97706" />
      </svg>
    );
  }

  return null;
};

export default PixelMascot;
