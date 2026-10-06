// ---------------------------------------------------------------------------
// theme.js — single source of truth for colours, spacing and type sizes.
// Change a value here and the whole app updates. Never hard-code colours
// inside screens.
// ---------------------------------------------------------------------------

export const colors = {
  primary: '#1B7F4B',      // main brand green (buttons, active tab)
  primaryDark: '#125C36',  // pressed / emphasis
  primarySoft: '#E3F4EA',  // light green backgrounds (badges, highlights)
  background: '#F6F8F7',   // screen background
  surface: '#FFFFFF',      // cards
  text: '#16211B',         // main text (high contrast on white)
  textMuted: '#5E6B64',    // secondary text
  border: '#DCE3DF',       // card / input borders
  warning: '#B26A00',      // needs attention (pending, flagged)
  warningSoft: '#FFF1D6',
  danger: '#B3261E',       // suspended / errors
  dangerSoft: '#FBE4E2',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const radius = { sm: 8, md: 12, lg: 20, pill: 999 };

export const font = { small: 13, body: 16, heading: 18, title: 24, display: 32 };

// Minimum touch-target height. Keep at 48+ so buttons are easy to hit outdoors.
export const MIN_TOUCH = 52;