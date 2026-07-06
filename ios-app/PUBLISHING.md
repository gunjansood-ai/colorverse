# 📱 ColorVerse — iOS & iPad App (publishing guide)

This folder is a ready-to-build **universal iPhone + iPad app** for ColorVerse, built
with **Capacitor**. It bundles the web app locally and talks to your live backend at
`https://colorverse-delta.vercel.app` for AI generation, so the app stays in sync with
the website automatically.

- **App name:** ColorVerse
- **Bundle ID:** `com.colorverse.app`
- **App icon & splash:** already designed and wired in (the palette logo).
- **Devices:** iPhone + iPad (universal), all orientations on iPad.

---

## What I already did for you
- Generated the native **Xcode project** (`ios/App/App.xcworkspace`).
- Bundled the full web app (`www/` → `ios/App/App/public`).
- Designed and installed the **app icon** (1024px) and **launch/splash** screen.
- Pointed the app's API calls at the deployed Vercel backend so AI works in the app.
- Set the display name, bundle id, and iPad support.

## What only you can do (needs your Apple account — I can't sign in or pay)
You'll need a **Mac with Xcode** and an **Apple Developer account** ($99/year).

### 1. One-time setup (Terminal, in this `ios-app` folder)
```bash
cd "ios-app"
npm install            # restore Capacitor (I removed node_modules to keep it small)
sudo gem install cocoapods   # if you don't have CocoaPods
npx cap sync ios       # installs the iOS pods + copies web assets
npx cap open ios       # opens the project in Xcode
```

### 2. Signing (in Xcode)
- Select the **App** target → **Signing & Capabilities**.
- Check **Automatically manage signing** and pick your **Team** (your Apple Developer account).
- Bundle Identifier is `com.colorverse.app` — change it if that's taken (must be unique).

### 3. Test it
- Pick an iPhone or iPad **simulator** (or your connected device) and press **▶ Run**.
- Confirm coloring, Generate, and Learn (incl. AI "draw anything") all work.

### 4. Ship to the App Store
1. In Xcode: set the device target to **Any iOS Device (arm64)**.
2. **Product → Archive**. When the Organizer opens, click **Distribute App → App Store Connect → Upload**.
3. Go to **App Store Connect** (appstoreconnect.apple.com) → **My Apps → +** → **New App**:
   - Platform iOS, name **ColorVerse**, your bundle id, an SKU.
4. Fill in the listing: description, keywords, **screenshots** (use the simulator: iPhone 6.7" + iPad 12.9" required), support URL, privacy policy URL, and the **App Privacy** questionnaire.
5. Select the build you uploaded, then **Submit for Review**.

### Re-deploying updates later
The app loads bundled web assets. To push a web update into the app:
```bash
# from the project root, copy the latest web files into ios-app/www, then:
cd ios-app && npx cap copy ios
```
…then re-archive and upload a new build. (The *backend/API* updates automatically with
your Vercel deploys — no rebuild needed for those.)

---

## A heads-up on App Review (guideline 4.2)
Apple sometimes rejects apps that are *only* a thin wrapper around a website. ColorVerse
is a strong case because it has substantial **native-feeling, on-device interactivity**
(canvas painting, the drawing coach with live feedback, layers, exports) rather than just
displaying a site. To be safe, in your review notes mention these native interactions, and
make sure the app works smoothly offline for the built-in catalog/lessons (it does — only
AI generation needs the network).

## Icons / assets
Source art is in this repo if you ever want to tweak it:
- Icon (1024): `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`
- Splash (2732): `ios/App/App/Assets.xcassets/Splash.imageset/`
