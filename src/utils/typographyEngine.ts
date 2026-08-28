/**
 * Typography Engine for Profile Website
 * Dynamically loads and applies 20+ Vietnamese-compatible Google Fonts in real-time.
 */

export interface FontOption {
  id: string;
  name: string;
  category: 'sans' | 'serif' | 'display' | 'mono';
  googleFontFamily: string;
  weights: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  // Top User Recommended Fonts
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'display', googleFontFamily: 'Space+Grotesk', weights: 'wght@400;600;700' },
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', category: 'sans', googleFontFamily: 'Be+Vietnam+Pro', weights: 'wght@400;500;600;700;800' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono', category: 'mono', googleFontFamily: 'IBM+Plex+Mono', weights: 'wght@400;600;700' },
  
  // High-End Professional Vietnamese Google Fonts
  { id: 'inter', name: 'Inter', category: 'sans', googleFontFamily: 'Inter', weights: 'wght@400;500;600;700;800' },
  { id: 'outfit', name: 'Outfit', category: 'sans', googleFontFamily: 'Outfit', weights: 'wght@400;600;700;800' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', category: 'sans', googleFontFamily: 'Plus+Jakarta+Sans', weights: 'wght@400;600;700;800' },
  { id: 'montserrat', name: 'Montserrat', category: 'sans', googleFontFamily: 'Montserrat', weights: 'wght@400;600;700;800' },
  { id: 'playfair-display', name: 'Playfair Display', category: 'serif', googleFontFamily: 'Playfair+Display', weights: 'wght@500;700;900' },
  { id: 'lora', name: 'Lora', category: 'serif', googleFontFamily: 'Lora', weights: 'wght@400;600;700' },
  { id: 'merriweather', name: 'Merriweather', category: 'serif', googleFontFamily: 'Merriweather', weights: 'wght@400;700' },
  { id: 'roboto', name: 'Roboto', category: 'sans', googleFontFamily: 'Roboto', weights: 'wght@400;500;700' },
  { id: 'oswald', name: 'Oswald', category: 'display', googleFontFamily: 'Oswald', weights: 'wght@500;700' },
  { id: 'lexend', name: 'Lexend', category: 'sans', googleFontFamily: 'Lexend', weights: 'wght@400;600;700' },
  { id: 'manrope', name: 'Manrope', category: 'sans', googleFontFamily: 'Manrope', weights: 'wght@400;600;700;800' },
  { id: 'work-sans', name: 'Work Sans', category: 'sans', googleFontFamily: 'Work+Sans', weights: 'wght@400;600;700' },
  { id: 'quicksand', name: 'Quicksand', category: 'sans', googleFontFamily: 'Quicksand', weights: 'wght@500;700' },
  { id: 'cabin', name: 'Cabin', category: 'sans', googleFontFamily: 'Cabin', weights: 'wght@400;600;700' },
  { id: 'comfortaa', name: 'Comfortaa', category: 'sans', googleFontFamily: 'Comfortaa', weights: 'wght@500;700' },
  { id: 'cinzel', name: 'Cinzel', category: 'serif', googleFontFamily: 'Cinzel', weights: 'wght@600;700;900' },
  { id: 'prata', name: 'Prata', category: 'serif', googleFontFamily: 'Prata', weights: 'wght@400' },
  { id: 'fira-code', name: 'Fira Code', category: 'mono', googleFontFamily: 'Fira+Code', weights: 'wght@400;600;700' }
];

const loadedFonts = new Set<string>();

export function getFontOption(input?: string): FontOption | undefined {
  if (!input) return undefined;
  const target = input.toLowerCase().trim();
  return AVAILABLE_FONTS.find(f => 
    f.id.toLowerCase() === target ||
    f.name.toLowerCase() === target ||
    f.googleFontFamily.toLowerCase() === target.replace(/\s+/g, '+') ||
    target.startsWith(f.id.toLowerCase()) ||
    target.startsWith(f.name.toLowerCase()) ||
    f.name.toLowerCase().includes(target)
  );
}

/**
 * Loads selected font from Google Fonts CDN dynamically
 */
export function loadGoogleFont(fontInput: string) {
  if (!fontInput) return;

  const fontOpt = getFontOption(fontInput);
  const googleFamily = fontOpt ? fontOpt.googleFontFamily : fontInput.trim().split(' ')[0].replace(/\+/g, '');
  const weights = fontOpt ? fontOpt.weights : 'wght@400;500;600;700;800';

  if (loadedFonts.has(googleFamily)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${googleFamily}:${weights}&display=swap`;
  document.head.appendChild(link);

  loadedFonts.add(googleFamily);
}

/**
 * Applies custom font variables & global font size scale to root document with explicit CSS overrides
 */
export function applyTypography(headingFont: string, bodyFont: string, monoFont: string, sizeScale: number = 100) {
  const hOpt = getFontOption(headingFont);
  const bOpt = getFontOption(bodyFont);
  const mOpt = getFontOption(monoFont);

  const hFamily = hOpt ? hOpt.googleFontFamily.replace(/\+/g, ' ') : (headingFont || 'Space Grotesk');
  const bFamily = bOpt ? bOpt.googleFontFamily.replace(/\+/g, ' ') : (bodyFont || 'Be Vietnam Pro');
  const mFamily = mOpt ? mOpt.googleFontFamily.replace(/\+/g, ' ') : (monoFont || 'IBM Plex Mono');

  loadGoogleFont(headingFont || 'Space Grotesk');
  loadGoogleFont(bodyFont || 'Be Vietnam Pro');
  loadGoogleFont(monoFont || 'IBM Plex Mono');

  // Set CSS root variables
  document.documentElement.style.setProperty('--disp', `'${hFamily}', sans-serif`);
  document.documentElement.style.setProperty('--body', `'${bFamily}', sans-serif`);
  document.documentElement.style.setProperty('--mono', `'${mFamily}', monospace`);
  
  if (sizeScale && sizeScale !== 100) {
    document.documentElement.style.fontSize = `${(sizeScale / 100) * 100}%`;
  } else {
    document.documentElement.style.fontSize = '';
  }

  // Inject or update dynamic override style tag to enforce font family across Tailwind classes
  let dynamicStyleEl = document.getElementById('dynamic-typography-style') as HTMLStyleElement;
  if (!dynamicStyleEl) {
    dynamicStyleEl = document.createElement('style');
    dynamicStyleEl.id = 'dynamic-typography-style';
    document.head.appendChild(dynamicStyleEl);
  }

  dynamicStyleEl.innerHTML = `
    :root {
      --disp: '${hFamily}', sans-serif !important;
      --body: '${bFamily}', sans-serif !important;
      --mono: '${mFamily}', monospace !important;
    }
    body, button, input, textarea, select {
      font-family: '${bFamily}', sans-serif !important;
    }
    h1, h2, h3, h4, h5, h6, .font-extrabold, .font-black, .font-bold, .font-display, [class*="font-extrabold"], [class*="font-bold"] {
      font-family: '${hFamily}', sans-serif !important;
    }
    .font-mono, [class*="font-mono"] {
      font-family: '${mFamily}', monospace !important;
    }
  `;
}
