# 📲 Get ColorVerse on your iPhone via TestFlight (no Xcode needed)

The GitHub Action at `.github/workflows/testflight.yml` builds the iOS app in the cloud
and uploads it to TestFlight. You only do the Apple-account steps below — once.

Your Apple **Team ID** is already known: `6T4X2Z2XN2`.

## One-time setup (~15 minutes)

### 1. App Store Connect app record
1. Go to https://appstoreconnect.apple.com → **Apps** → **+** → **New App**.
2. Platform **iOS**, Name **Little Artists: Color & Draw**, Bundle ID **com.littleartists.app**
   (if the bundle ID isn't in the dropdown, first register it at
   https://developer.apple.com/account/resources/identifiers → **+** → App IDs).
3. SKU: anything, e.g. `littleartists-001`.

### 2. Create an API key (lets the build sign & upload for you)
1. App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API**.
2. **Generate API Key**, role **App Manager** (or Admin).
3. Note the **Key ID** and the **Issuer ID** (shown at the top of the page).
4. **Download** the `.p8` file (only downloadable once — keep it safe).

### 3. Add four secrets to the GitHub repo
GitHub → `gunjansood-ai/colorverse` → **Settings** → **Secrets and variables** →
**Actions** → **New repository secret**:

| Secret name     | Value                                        |
|-----------------|----------------------------------------------|
| `ASC_KEY_ID`    | the Key ID from step 2                       |
| `ASC_ISSUER_ID` | the Issuer ID from step 2                    |
| `ASC_KEY_P8`    | the full text content of the `.p8` file (open it in TextEdit, copy everything) |
| `APPLE_TEAM_ID` | `6T4X2Z2XN2`                                 |

## Every build after that (~1 minute of your time)
1. GitHub → **Actions** tab → **Build & upload to TestFlight** → **Run workflow**.
2. Wait ~15 min. The build lands in App Store Connect → TestFlight.
3. First time only: in TestFlight, add yourself as an internal tester.
4. On your iPhone: install the **TestFlight** app, accept the invite, install ColorVerse.

Every new run auto-increments the build number, so repeat step 1 whenever you want
the latest version on your phone.
