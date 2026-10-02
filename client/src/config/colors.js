/**
 * Diet Quest RPG App - Color Palette & Themes
 * Matches the specification palette and typography hierarchy
 */

export const colors = {
  // Primary Backgrounds
  deepNavy: '#0F172A',      // Main Background
  slateGray: '#1E293B',     // Cards & Container Backgrounds
  slateLight: '#334155',    // Borders & elevated cards
  slateDark: '#0B1120',     // Inset panels / deep wells

  // Game HUD Elements
  softRed: '#FF5252',       // HP Bar & Heart Icons
  cyberBlue: '#388BFD',     // Energy Bar & Step Progress
  warmGold: '#FFD166',      // XP Points, Levels & Badges
  magicPurple: '#A855F7',   // Potions & Mana
  emeraldGreen: '#10B981',  // Buffs, Healthy completion, Shields

  // Accents & Typography
  candyPink: '#FF85A1',     // Mascot, Popups & Celebrations
  crispWhite: '#F8FAFC',    // Primary Text
  mutedGray: '#94A3B8',     // Subtext & Labels
  darkText: '#020617',      // Text on light badges

  // System & Status States
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#388BFD',

  // Gradient definitions for RPG progress bars
  gradients: {
    hp: 'linear-gradient(90deg, #FF5252 0%, #FF7B7B 100%)',
    energy: 'linear-gradient(90deg, #388BFD 0%, #60A5FA 100%)',
    xp: 'linear-gradient(90deg, #FFD166 0%, #FBBF24 100%)',
    gold: 'linear-gradient(135deg, #FFD166 0%, #D97706 100%)',
    pink: 'linear-gradient(135deg, #FF85A1 0%, #EC4899 100%)',
    card: 'linear-gradient(180deg, #1E293B 0%, #172033 100%)',
    boss: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
  }
};

export default colors;
