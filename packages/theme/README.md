# @org/theme

Shared color system for web and mobile apps.

## Source of Truth

All colors are defined in [src/theme.css](src/theme.css) using OKLCH values.

## Usage

**Web app** (Tailwind v4):

```ts
import '@org/theme/theme.css';
```

Tailwind v4 auto-detects `--color-*` variables in `globals.css` and generates utilities: `bg-primary`, `text-foreground`, etc.

**Mobile app** (NativeWind/Tailwind v3):

```ts
import { colors } from '@org/theme';
import themeColors from '@org/theme/tailwind';
```

Use `colors.light.primary` for StyleSheet or `bg-primary` with NativeWind. Requires explicit `tailwind.config.js` setup (v3 doesn't auto-detect CSS variables).

## Updating Colors

1. Edit OKLCH values in `src/theme.css`
2. Run `pnpm --filter @org/theme build`
3. Hex values in `colors.ts` and `tailwind.cjs` regenerate automatically

The build script uses culori to convert OKLCH → hex at build time (zero runtime cost).
