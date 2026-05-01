# Mobile App

Expo + React Native + NativeWind mobile app.

## Development

```bash
# Start development server
pnpm nx run @org/mobile:start

# Start with specific platform
pnpm nx run @org/mobile:start --ios
pnpm nx run @org/mobile:start --android
```

## Tech Stack

- **Expo** 55 with Expo Router (file-based routing)
- **React Native** 0.83.6
- **NativeWind** 4.2.3
  - To be able to use Tailwind CSS utility classes for React Native
- **TypeScript**

## Styling

NativeWind + shared `@org/theme` package:

```tsx
<View className="bg-primary border-border">
  <Text className="text-foreground">Hello</Text>
</View>
```

**Colors update:** When theme colors change, run `pnpm --filter @org/theme build` to regenerate hex values from OKLCH source of truth.

- Use `colors.light.primary` for StyleSheet or `bg-primary` with NativeWind. Requires explicit `tailwind.config.js` setup (v3 doesn't auto-detect CSS variables).

## File Structure

- `app/` - Routes (Expo Router file-based routing)
- `components/` - Reusable UI components
- `constants/` - App constants (colors, etc.)
- `assets/` - Images, fonts, etc.

## Adding environment variables

- EAS is used for [building](https://docs.expo.dev/build/setup/) and also for managing [environment variables](https://docs.expo.dev/eas/environment-variables/)
  - you can use `eas env:create --name EXPO_PUBLIC_API_URL --value https://api.example.com --environment production --visibility plaintext` to add new variables
- [Build options](https://docs.expo.dev/build/introduction/)
- Apply the same set locally with `eas env:pull` or inside CI/CD.

## Running on iOS Simulator

- `pnpm run build:ios:simulator` to build the app with EAS
- `pnpm nx run @org/mobile:start` to start the dev server locally
- press `i` to launch in the simulator
