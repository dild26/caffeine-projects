/**
 * Color contrast utilities for WCAG compliance
 * Implements WCAG 2.1 contrast ratio calculations
 */

interface ContrastResult {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
  passesAAALarge: boolean;
}

/**
 * Convert OKLCH color string to RGB
 * Format: "L C H" where L is 0-100, C is 0-0.4, H is 0-360
 */
function oklchToRgb(l: number, c: number, h: number): [number, number, number] {
  // Convert OKLCH to linear RGB
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  // OKLab to linear RGB conversion matrix
  const l_ = l / 100;
  const m_ = l_ + 0.3963377774 * a + 0.2158037573 * b;
  const s_ = l_ - 0.1055613458 * a - 0.0638541728 * b;
  const l__ = l_ - 0.0894841775 * a - 1.2914855480 * b;
  
  const lrgb = Math.pow(m_, 3);
  const mrgb = Math.pow(s_, 3);
  const srgb = Math.pow(l__, 3);
  
  let r = +4.0767416621 * lrgb - 3.3077115913 * mrgb + 0.2309699292 * srgb;
  let g = -1.2684380046 * lrgb + 2.6097574011 * mrgb - 0.3413193965 * srgb;
  let b_ = -0.0041960863 * lrgb - 0.7034186147 * mrgb + 1.7076147010 * srgb;
  
  // Clamp and convert to sRGB
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b_ = Math.max(0, Math.min(1, b_));
  
  // Apply gamma correction
  const toSrgb = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  
  return [
    Math.round(toSrgb(r) * 255),
    Math.round(toSrgb(g) * 255),
    Math.round(toSrgb(b_) * 255)
  ];
}

/**
 * Calculate relative luminance according to WCAG 2.1
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Parse OKLCH values from CSS custom property format
  const parseOklch = (color: string): [number, number, number] => {
    const match = color.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?)/);
    if (!match) return [50, 0, 0]; // fallback to gray
    
    let l = parseFloat(match[1]);
    let c = parseFloat(match[2]);
    const h = parseFloat(match[3]);
    
    // Normalize values
    if (c > 1) c = c / 100; // Convert percentage to decimal
    if (c > 0.4) c = 0.4; // Cap chroma
    
    return [l, c, h];
  };
  
  const [l1, c1, h1] = parseOklch(color1);
  const [l2, c2, h2] = parseOklch(color2);
  
  const [r1, g1, b1] = oklchToRgb(l1, c1, h1);
  const [r2, g2, b2] = oklchToRgb(l2, c2, h2);
  
  const lum1 = getRelativeLuminance(r1, g1, b1);
  const lum2 = getRelativeLuminance(r2, g2, b2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = calculateContrastRatio(foreground, background);
  
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
    passesAALarge: ratio >= 3,
    passesAAALarge: ratio >= 4.5,
  };
}

/**
 * Get computed OKLCH value from CSS custom property
 */
export function getComputedOklch(propertyName: string): string {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(propertyName).trim();
  return value;
}

/**
 * Validate all theme colors for contrast compliance
 */
export function validateThemeContrast(): {
  isValid: boolean;
  failures: Array<{ pair: string; ratio: number; required: number }>;
} {
  const failures: Array<{ pair: string; ratio: number; required: number }> = [];
  
  // Critical color pairs to check
  const pairs = [
    { fg: '--foreground', bg: '--background', name: 'Body text', required: 4.5 },
    { fg: '--card-foreground', bg: '--card', name: 'Card text', required: 4.5 },
    { fg: '--popover-foreground', bg: '--popover', name: 'Popover text', required: 4.5 },
    { fg: '--primary-foreground', bg: '--primary', name: 'Primary button', required: 4.5 },
    { fg: '--secondary-foreground', bg: '--secondary', name: 'Secondary button', required: 4.5 },
    { fg: '--muted-foreground', bg: '--muted', name: 'Muted text', required: 4.5 },
    { fg: '--accent-foreground', bg: '--accent', name: 'Accent text', required: 4.5 },
  ];
  
  for (const pair of pairs) {
    const fg = getComputedOklch(pair.fg);
    const bg = getComputedOklch(pair.bg);
    
    if (fg && bg) {
      const result = checkContrast(fg, bg);
      if (result.ratio < pair.required) {
        failures.push({
          pair: pair.name,
          ratio: result.ratio,
          required: pair.required,
        });
      }
    }
  }
  
  return {
    isValid: failures.length === 0,
    failures,
  };
}

/**
 * Suggest accessible text color (black or white) for a given background
 */
export function suggestTextColor(background: string): 'light' | 'dark' {
  const whiteContrast = calculateContrastRatio(background, '100 0 0'); // white in OKLCH
  const blackContrast = calculateContrastRatio(background, '0 0 0'); // black in OKLCH
  
  return whiteContrast > blackContrast ? 'light' : 'dark';
}
