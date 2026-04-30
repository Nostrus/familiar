/**
 * Color constants for React Native.
 *
 * AUTO-GENERATED from theme.css OKLCH values.
 * DO NOT EDIT MANUALLY - run 'pnpm build' to regenerate.
 */

export const colors = {
  light: {
    background: '#ffffff',
    foreground: '#0a0a0a',
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    popover: '#ffffff',
    popoverForeground: '#0a0a0a',
    primary: '#008236',
    primaryForeground: '#f0fdf4',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f5f5f5',
    mutedForeground: '#737373',
    accent: '#f5f5f5',
    accentForeground: '#171717',
    destructive: '#e7000b',
    border: '#e5e5e5',
    input: '#e5e5e5',
    ring: '#a1a1a1',
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    card: '#171717',
    cardForeground: '#fafafa',
    popover: '#171717',
    popoverForeground: '#fafafa',
    primary: '#016630',
    primaryForeground: '#f0fdf4',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#262626',
    mutedForeground: '#a1a1a1',
    accent: '#262626',
    accentForeground: '#fafafa',
    destructive: '#ff6467',
    border: '#ffffff1a',
    input: '#ffffff26',
    ring: '#737373',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorName = keyof typeof colors.light;
