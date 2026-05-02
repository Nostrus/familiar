# Mobile App

- Expo 55 + React Native 0.83 app
- File-based routing via Expo Router
- NativeWind for Tailwind styling
- Clerk for auth
- Shares types, theme tokens, and API conventions with the web app

## Development

```bash
pnpm run build:ios:simulator        # Build the app with EAS
pnpm nx run @org/mobile:start       # Start Expo dev server
press i to launch in the simulator
pnpm nx run @org/mobile:lint        # Lint
```

## Styling

NativeWind + shared `@org/theme` package:

```tsx
<View className="bg-primary border-border">
  <Text className="text-foreground">Hello</Text>
</View>
```

**Colors update:**

- When theme colors change, run `pnpm --filter @org/theme build` to regenerate hex values from OKLCH source of truth.

- Use `colors.light.primary` for StyleSheet or `bg-primary` with NativeWind. Requires explicit `tailwind.config.js` setup (v3 doesn't auto-detect CSS variables).

## File Structure

- `app/` — Routes (Expo Router file-based routing)
  - `(tabs)/` — Tab screens: `index` (Discover), `favorites`, `host`, `requests`, `profile`
  - `homes/[id].tsx` — Home detail screen
  - `modal.tsx` — Modal screen
- `components/` — Reusable UI components (e.g. `HomeCard`, `HomeEditModal`)
- `lib/` — Utility modules:
  - `api.ts` — `API_URL` constant from `EXPO_PUBLIC_API_URL`
  - `amenities.ts` — Re-exports `AMENITIES` from `@org/types`; `getAmenity(key)` resolves the `mobileIcon` (Feather name) for use with `<Feather name={...} />`
- `constants/` — App constants (colors, etc.)
- `assets/` — Images, fonts, etc.

## Environment Variables

Copy `apps/mobile/.env.example` to `apps/mobile/.env.local`:

```env
# For local development (web app running on localhost)
EXPO_PUBLIC_API_URL=http://localhost:3000

# For development on a physical device (replace with your machine's IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000

# For production
# EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

- EAS is used for [building](https://docs.expo.dev/build/setup/) and also for managing [environment variables](https://docs.expo.dev/eas/environment-variables/)
  - use `eas env:create --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment production --visibility plaintext` to add new variables
- [Build options](https://docs.expo.dev/build/introduction/)
- Apply the same set locally with `eas env:pull` or inside CI/CD.

## Authentication

Clerk is used for auth via `@clerk/expo`. The app:

- Uses `useAuth({ treatPendingAsSignedOut: false })` with `isLoaded` guards to prevent flicker on reload
- Uses Bearer token (`await getToken()`) for all authenticated API requests to the web backend
- Profile management is exposed via Clerk's native `presentUserProfile()` modal
