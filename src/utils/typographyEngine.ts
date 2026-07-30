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
  { id: 'space-grotesk', name: 'Space Grotesk (Modern Display)', category: 'display', googleFontFamily: 'Space+Grotesk', weights: 'wght@400;600;700' },
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro (Việt Hóa Chuẩn)', category: 'sans', googleFontFamily: 'Be+Vietnam+Pro', weights: 'wght@400;500;600;700;800' },
  { id: 'ibm-plex-mono', name: 'IBM Plex Mono (Tech Code)', category: 'mono', googleFontFamily: 'IBM+Plex+Mono', weights: 'wght@400;600;700' },
  
  // High-End Professional Vietnamese Google Fonts
  { id: 'inter', name: 'Inter (Sleek UI)', category: 'sans', googleFontFamily: 'Inter', weights: 'wght@400;500;600;700;800' },
  { id: 'outfit', name: 'Outfit (Modern Premium)', category: 'sans', googleFontFamily: 'Outfit', weights: 'wght@400;600;700;800' },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans (Corporate)', category: 'sans', googleFontFamily: 'Plus+Jakarta+Sans', weights: 'wght@400;600;700;800' },
  { id: 'montserrat', name: 'Montserrat (Bold & Clean)', category: 'sans', googleFontFamily: 'Montserrat', weights: 'wght@400;600;700;800' },
  { id: 'playfair-display', name: 'Playfair Display (Luxury Serif)', category: 'serif', googleFontFamily: 'Playfair+Display', weights: 'wght@500;700;900' },
  { id: 'lora', name: 'Lora (Editorial Serif)', category: 'serif', googleFontFamily: 'Lora', weights: 'wght@400;600;700' },
  { id: 'merriweather', name: 'Merriweather (Classic Book)', category: 'serif', googleFontFamily: 'Merriweather', weights: 'wght@400;700' },
  { id: 'roboto', name: 'Roboto (Universal Sans)', category: 'sans', googleFontFamily: 'Roboto', weights: 'wght@400;500;700' },
  { id: 'oswald', name: 'Oswald (Tall & Impactful)', category: 'display', googleFontFamily: 'Oswald', weights: 'wght@500;700' },
  { id: 'lexend', name: 'Lexend (Clean Reading)', category: 'sans', googleFontFamily: 'Lexend', weights: 'wght@400;600;700' },
  { id: 'manrope', name: 'Manrope (Minimalist)', category: 'sans', googleFontFamily: 'Manrope', weights: 'wght@400;600;700;800' },
  { id: 'work-sans', name: 'Work Sans (Crisp Clean)', category: 'sans', googleFontFamily: 'Work+Sans', weights: 'wght@400;600;700' },
  { id: 'quicksand', name: 'Quicksand (Soft Rounded)', category: 'sans', googleFontFamily: 'Quicksand', weights: 'wght@500;700' },
  { id: 'cabin', name: 'Cabin (Modern Humanist)', category: 'sans', googleFontFamily: 'Cabin', weights: 'wght@400;600;700' },
  { id: 'comfortaa', name: 'Comfortaa (Rounded Creative)', category: 'sans', googleFontFamily: 'Comfortaa', weights: 'wght@500;700' },
  { id: 'cinzel', name: 'Cinzel (Cinematic Classic)', category: 'serif', googleFontFamily: 'Cinzel', weights: 'wght@600;700;900' },
  { id: 'prata', name: 'Prata (High Fashion Serif)', category: 'serif', googleFontFamily: 'Prata', weights: 'wght@400' },
  { id: 'fira-code', name: 'Fira Code (Developer Mono)', category: 'mono', googleFontFamily: 'Fira+Code', weights: 'wght@400;600;700' }
];

const loadedFonts = new Set<string>();

/**
 * Loads selected font from Google Fonts CDN dynamically
 */
export function loadGoogleFont(fontName: string) {
  if (!fontName || loadedFonts.has(fontName)) return;

  const font = AVAILABLE_FONTS.find(f => f.name.includes(fontName) || f.googleFontFamily.includes(fontName.replace(/\s+/g, '+')));
  const fontFamilyParam = font ? `${font.googleFontFamily}:${font.weights}` : `${fontName.replace(/\s+/g, '+')}:wght@400;600;700`;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamilyParam}&display=swap`;
  document.head.appendChild(link);

  loadedFonts.add(fontName);
}

/**
 * Applies custom font variables & global font size scale to root document with explicit CSS overrides
 */
export function applyTypography(headingFont: string, bodyFont: string, monoFont: string, sizeScale: number = 100) {
  const hFont = headingFont || 'Space Grotesk';
  const bFont = bodyFont || 'Be Vietnam Pro';
  const mFont = monoFont || 'IBM Plex Mono';

  loadGoogleFont(hFont);
  loadGoogleFont(bFont);
  loadGoogleFont(mFont);

  // Set CSS root variables
  document.documentElement.style.setProperty('--disp', `'${hFont}', sans-serif`);
  document.documentElement.style.setProperty('--body', `'${bFont}', sans-serif`);
  document.documentElement.style.setProperty('--mono', `'${mFont}', monospace`);

  // Inject or update dynamic override style tag to enforce font family across Tailwind classes
  let dynamicStyleEl = document.getElementById('dynamic-typography-style') as HTMLStyleElement;
  if (!dynamicStyleEl) {
    dynamicStyleEl = document.createElement('style');
    dynamicStyleEl.id = 'dynamic-typography-style';
    document.head.appendChild(dynamicStyleEl);
  }

  dynamicStyleEl.innerHTML = `
    :root {
      --disp: '${hFont}', sans-serif !important;
      --body: '${bFont}', sans-serif !important;
      --mono: '${mFont}', monospace !important;
    }
    body, p, span, li, button, input, textarea, div {
      font-family: '${bFont}', sans-serif;
    }
    h1, h2, h3, h4, h5, h6, .font-extrabold, .font-black, .font-bold {
      font-family: '${hFont}', sans-serif;
    }
    .font-mono, [class*="font-mono"] {
      font-family: '${mFont}', monospace !important;
    }
  `;

  // Global font scale
  const baseScalePercent = Math.max(85, Math.min(130, sizeScale));
  document.documentElement.style.fontSize = `${(baseScalePercent / 100) * 16}px`;
}
