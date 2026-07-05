# Local setup — test in Android Studio

Everything runs on your PC: Spring Boot backend (file-based H2) + the Flutter
app in an Android emulator.

## 0. One-time installs

- JDK 21 + Maven
- Flutter SDK (`flutter doctor` must be clean)
- Android Studio with the **Flutter** plugin + one emulator (Device Manager)

## 1. Get the code

```bash
git clone https://github.com/shakil128/Preventive-Healthcare-App-Bangladesh.git
cd Preventive-Healthcare-App-Bangladesh
git checkout claude/flutter-springboot-rebuild-xszyf2
```

## 2. Start the backend (terminal 1)

```bash
cd backend
mvn spring-boot:run
```

- Runs on `http://localhost:8080`; the DB is a **file** at `backend/data/mch.mv.db`,
  so your data survives restarts. Delete that file to reset to seed data.
- Sanity check in a browser: `http://localhost:8080/api/beneficiaries`
- H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/mch`, user `sa`)

## 3. Prepare the Flutter app (once)

```bash
cd mobile
flutter create .        # generates android/ + ios/ around the existing lib/
flutter pub get
```

Then allow plain `http://` for local testing — in
`android/app/src/main/AndroidManifest.xml` add one attribute inside
`<application ...>`:

```xml
android:usesCleartextTraffic="true"
```

## 4. Run in Android Studio

Open the `mobile/` folder → pick your emulator → **Run**.

The default base URL is `http://10.0.2.2:8080` (= your PC's localhost as seen
from the Android emulator), set in `lib/config/api_config.dart`. For a real
phone on your Wi-Fi, either edit that file to your PC's LAN IP or run with:

```
--dart-define=API_BASE_URL=http://192.168.0.10:8080
```

(Run ▸ Edit Configurations ▸ Additional run args.)

## 5. Log in (real accounts in the `users` table)

| Surface | Username | Password |
|---|---|---|
| Field officer app | `rokeya.cb01` | `Mch-2026` |
| Supervisor portal | `s.rahman` | `Admin-2026` |

- Wrong password (while the backend is up) → red SnackBar, no login.
- Backend stopped → the app logs in anyway with the local offline session
  (that's the offline-first design).
- Onboarding a field officer in the portal creates a **real** login row —
  the generated username/password work in the field-app login immediately.

## 6. What to try

1. Log in as the field officer → note "7 records pending sync" on the banner.
2. Open Rahima Begum → **Record new ANC visit** → toggle danger signs / step
   BP and Hb → watch the risk banner re-classify live → **Save**.
3. Tap **Sync** → pending count drops to 0 (records POSTed to `/api/sync`).
4. Portal tab → log in as supervisor → **Field officers → Onboard** → use the
   generated credentials to log in to the field app.

## Troubleshooting

| Symptom | Fix |
|---|---|
| App can't reach backend | Backend running? Emulator uses `10.0.2.2`, not `localhost`. Cleartext attribute added? |
| `flutter create .` complains | Run it from inside `mobile/`, not the repo root |
| Want a clean DB | Stop backend, delete `backend/data/`, start again (re-seeds) |
| Reset the app's local store | Uninstall the app from the emulator (clears SQLite), rerun |
