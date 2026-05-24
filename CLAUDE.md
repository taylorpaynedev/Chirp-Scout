@AGENTS.md

## Project Overview

BirdApp is a bird classification app using on-device ML inference. It runs TFLite models directly on the device via `react-native-fast-tflite`.

**Stack:** Expo SDK 56, React Native 0.85.3, React 19.2.3, TypeScript 6

## Key Packages

| Package | Purpose |
| --- | --- |
| `react-native-fast-tflite@^3.0.1` | TFLite inference (requires NitroModules / New Architecture) |
| `react-native-nitro-modules` | TurboModule layer used by fast-tflite |
| `expo-camera` | Camera access |
| `expo-sqlite` | Local storage |
| `expo-file-system`, `expo-image-manipulator`, `expo-asset` | Media handling |
| `expo-dev-client` | Required for dev builds |
| `@react-navigation/bottom-tabs`, `@react-navigation/stack` | Navigation |

## Project Structure

```text
BirdApp/
├── app/              # Expo Router screens
├── src/              # Source components/logic
├── assets/
│   └── model/        # TFLite model files
├── ios/              # Native iOS project (do not hand-edit)
├── App.tsx           # Root component
├── index.ts          # Entry point (not index.js)
├── metro.config.js   # Metro bundler config
├── app.json          # Expo config (plugins, bundle ID, etc.)
└── package.json
```

## Build Requirements — CRITICAL

**Cannot use Expo Go.** `react-native-nitro-modules` is a TurboModule that requires a native build. Expo Go's sandbox does not support it.

**Must use a dev build:**

```bash
LANG=en_US.UTF-8 npx expo run:ios
```

**Requires Xcode 26.x** (Apple's 2026 calendar-versioned Xcode). Expo SDK 56 uses Swift 6.2 language features (`weak let`, `NonisolatedNonsendingByDefault`) that are not available in Xcode 16.x (Swift 6.1). Building with Xcode 16.x will fail with:

```text
package 'apple' is using Swift tools version 6.2.0 but the installed version is 6.1.0
```

**New Architecture:** Enabled and required. React Native 0.85 uses the new architecture by default.

## Dev Workflow

```bash
# Full native build + launch on simulator
LANG=en_US.UTF-8 npx expo run:ios

# Start dev server only (after native build is already on device/simulator)
LANG=en_US.UTF-8 npx expo start

# Update pods
LANG=en_US.UTF-8 cd ios && pod install

# Switch Xcode version
sudo xcode-select -s /Applications/Xcode-26.2.0.app/Contents/Developer
```

Always prefix builds with `LANG=en_US.UTF-8` or add `export LANG=en_US.UTF-8` to `~/.zshrc` to avoid CocoaPods UTF-8 errors.

## iOS Project State

- `ios/` directory contains a full Xcode workspace (`BirdApp.xcworkspace`)
- CocoaPods is used (111 pods installed)
- `Podfile.properties.json` has `"ios.buildReactNativeFromSource": "true"` — React Native builds from source (slow on first build)
- `expo-dev-client` plugin is listed in `app.json` plugins

## Known Issues / Gotchas

- **Xcode version:** `expo-modules-jsi@56.x` requires `swift-tools-version: 6.2` and uses `weak let` syntax. Only Xcode 26.x resolves this — Xcode 16.x will fail.
- **Simulator runtime:** iOS 18.6 runtime is required for Xcode 26.x. Download with `xcodebuild -downloadPlatform iOS` if missing.
- **Stale DerivedData:** After switching Xcode versions, clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/BirdApp*`
- **xcodes tool:** Use `xcodes list` and `xcodes install <version>` to manage multiple Xcode versions. Use `xcrun simctl runtime delete <UUID>` to free disk space from old runtimes.
