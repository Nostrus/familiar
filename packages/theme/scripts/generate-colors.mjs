#!/usr/bin/env node
/**
 * Generates colors.ts and tailwind.cjs from theme.css OKLCH values.
 * Run this script whenever you update the OKLCH colors in theme.css.
 */

import { formatHex, formatHex8, parse } from 'culori';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const themeCssPath = join(__dirname, '../src/theme.css');
const colorsOutputPath = join(__dirname, '../src/colors.ts');
const tailwindOutputPath = join(__dirname, '../src/tailwind.cjs');

// Read and parse theme.css
const themeCss = readFileSync(themeCssPath, 'utf-8');

// Extract OKLCH values from CSS custom properties
const lightColors = {};
const darkColors = {};

// Match :root block
const rootMatch = themeCss.match(/:root\s*\{([^}]+)\}/);
if (rootMatch) {
  const rootContent = rootMatch[1];
  const colorMatches = rootContent.matchAll(/--([a-z-]+):\s*oklch\(([^)]+)\);?/g);
  for (const match of colorMatches) {
    const [, name, oklchValue] = match;
    lightColors[name] = `oklch(${oklchValue})`;
  }
}

// Match .dark block
const darkMatch = themeCss.match(/\.dark\s*\{([^}]+)\}/);
if (darkMatch) {
  const darkContent = darkMatch[1];
  const colorMatches = darkContent.matchAll(/--([a-z-]+):\s*oklch\(([^)]+)\);?/g);
  for (const match of colorMatches) {
    const [, name, oklchValue] = match;
    darkColors[name] = `oklch(${oklchValue})`;
  }
}

// Convert OKLCH to hex using culori
function convertColor(oklchString) {
  const parsed = parse(oklchString);
  if (!parsed) {
    throw new Error(`Failed to parse: ${oklchString}`);
  }

  // Handle alpha channel
  if (oklchString.includes('/') && parsed.alpha !== undefined) {
    return formatHex8(parsed);
  }

  return formatHex(parsed);
}

// Convert all colors
const lightHex = {};
const darkHex = {};

for (const [name, oklch] of Object.entries(lightColors)) {
  lightHex[name] = convertColor(oklch);
}

for (const [name, oklch] of Object.entries(darkColors)) {
  darkHex[name] = convertColor(oklch);
}

// Generate colors.ts
const colorsTs = `/**
 * Color constants for React Native.
 *
 * AUTO-GENERATED from theme.css OKLCH values.
 * DO NOT EDIT MANUALLY - run 'pnpm build' to regenerate.
 */

export const colors = {
  light: {
    background: '${lightHex.background}',
    foreground: '${lightHex.foreground}',
    card: '${lightHex.card}',
    cardForeground: '${lightHex['card-foreground']}',
    popover: '${lightHex.popover}',
    popoverForeground: '${lightHex['popover-foreground']}',
    primary: '${lightHex.primary}',
    primaryForeground: '${lightHex['primary-foreground']}',
    secondary: '${lightHex.secondary}',
    secondaryForeground: '${lightHex['secondary-foreground']}',
    muted: '${lightHex.muted}',
    mutedForeground: '${lightHex['muted-foreground']}',
    accent: '${lightHex.accent}',
    accentForeground: '${lightHex['accent-foreground']}',
    destructive: '${lightHex.destructive}',
    border: '${lightHex.border}',
    input: '${lightHex.input}',
    ring: '${lightHex.ring}',
  },
  dark: {
    background: '${darkHex.background}',
    foreground: '${darkHex.foreground}',
    card: '${darkHex.card}',
    cardForeground: '${darkHex['card-foreground']}',
    popover: '${darkHex.popover}',
    popoverForeground: '${darkHex['popover-foreground']}',
    primary: '${darkHex.primary}',
    primaryForeground: '${darkHex['primary-foreground']}',
    secondary: '${darkHex.secondary}',
    secondaryForeground: '${darkHex['secondary-foreground']}',
    muted: '${darkHex.muted}',
    mutedForeground: '${darkHex['muted-foreground']}',
    accent: '${darkHex.accent}',
    accentForeground: '${darkHex['accent-foreground']}',
    destructive: '${darkHex.destructive}',
    border: '${darkHex.border}',
    input: '${darkHex.input}',
    ring: '${darkHex.ring}',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorName = keyof typeof colors.light;
`;

// Generate tailwind.cjs
const tailwindCjs = `/**
 * Tailwind color tokens for NativeWind.
 *
 * AUTO-GENERATED from theme.css OKLCH values.
 * DO NOT EDIT MANUALLY - run 'pnpm build' to regenerate.
 */

module.exports = {
  background: '${lightHex.background}',
  foreground: '${lightHex.foreground}',
  card: {
    DEFAULT: '${lightHex.card}',
    foreground: '${lightHex['card-foreground']}',
  },
  popover: {
    DEFAULT: '${lightHex.popover}',
    foreground: '${lightHex['popover-foreground']}',
  },
  primary: {
    DEFAULT: '${lightHex.primary}',
    foreground: '${lightHex['primary-foreground']}',
  },
  secondary: {
    DEFAULT: '${lightHex.secondary}',
    foreground: '${lightHex['secondary-foreground']}',
  },
  muted: {
    DEFAULT: '${lightHex.muted}',
    foreground: '${lightHex['muted-foreground']}',
  },
  accent: {
    DEFAULT: '${lightHex.accent}',
    foreground: '${lightHex['accent-foreground']}',
  },
  destructive: {
    DEFAULT: '${lightHex.destructive}',
  },
  border: '${lightHex.border}',
  input: '${lightHex.input}',
  ring: '${lightHex.ring}',
};
`;

// Write files
writeFileSync(colorsOutputPath, colorsTs);
writeFileSync(tailwindOutputPath, tailwindCjs);

console.log('✓ Generated colors.ts');
console.log('✓ Generated tailwind.cjs');
console.log(`  ${Object.keys(lightHex).length} colors converted from OKLCH to hex`);
