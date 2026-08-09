# MCH Surveillance — Mobile App (Flutter)

Cross-platform (Android · iOS · Web · Windows · macOS · Linux) offline-first app
for the Preventive Healthcare Programme — Maternal & Child Health field
surveillance. It carries both surfaces of the original design:

1. **Field Officer App** — register beneficiaries, conduct ANC / child / general
   visits, auto-classify risk and nutrition, and sync when connectivity returns.
2. **Supervisor Portal** — dashboard, beneficiaries, WHO-framework indicators,
   and field-officer onboarding (toggle via the **Portal** tab in the bottom nav).

Both surfaces are bilingual (English + বাংলা). Sample data is Char Bhola Union,
Bhola Sadar Upazila.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Flutter (Dart 3) — one codebase for Android, iOS, web & desktop |
| State | `provider` (`ChangeNotifier`) |
| Offline storage | SQLite + a sync queue — `sqflite` on mobile, `sqflite_common_ffi` on desktop, `sqflite_common_ffi_web` (WASM) on web |
| Networking | `dio` to the Spring Boot backend |
| Charts | Lightweight hand-built bar/progress widgets (no native chart dep) |

## Project layout

Screens live in `lib/pages/` (PascalCase, one file per screen — same convention
as the PKSF app); supporting code sits in small, clearly-named folders.

```
lib/
  main.dart               app entry — swaps FieldShell ↔ PortalPage
  config/
    api_config.dart       backend base URL (local ↔ server toggle)
  pages/                  every screen (PascalCase, like your app)
    LoginPage, HomePage, BeneficiaryListPage, RegisterPage, AncVisitPage,
    ChildHealthPage, ProfilePage, BottomNav, FieldShell           (field app)
    PortalPage, PortalLoginPage, PortalSidebar, PortalTopBar,
    DashboardSection, BeneficiariesSection, IndicatorsSection,
    WorkersSection, OnboardModal                                  (supervisor)
  widgets/
    widgets.dart          shared UI (Avatar, RiskBadge, AppCard, ScreenHeader…)
  services/
    api_service.dart      dio client for the backend
    local_db.dart         SQLite offline store + sync queue
    db_factory.dart       picks the right SQLite backend per platform
      db_factory_native.dart   mobile (sqflite) + desktop (FFI)  — conditional import
      db_factory_web.dart      web (WASM)                        — conditional import
    repository.dart       the only writer: local write + enqueue sync
  state/
    app_state.dart        provider store: navigation, auth, cached data
  domain/                 models + clinical logic (risk, nutrition, indicators,
                          dashboard, format) + seed data — pure Dart, unit-tested
  theme/
    tokens.dart           colours + ThemeData
test/                     domain logic parity tests (mirror the backend's tests)
```

### Why a couple of pieces differ from the PKSF app
Your PKSF app is online-only with `setState` and `Map<String,dynamic>`. This app
keeps **typed models** and a **provider** store on purpose, because it is
offline-first: the same record serialises both to backend JSON *and* to SQLite
rows, and one shared beneficiary list feeds the home counter, the case list, the
profile, and the "pending sync" badge at once. Everything else — `pages/` layout,
`dio`, the local↔server base-URL toggle — follows your conventions.

## Getting started

The native scaffolding for all six platforms (`android/`, `ios/`, `web/`,
`windows/`, `macos/`, `linux/`) is committed, so you can build and run anywhere
Flutter is supported:

```bash
cd mobile
flutter pub get
flutter test                          # run the domain logic tests

flutter run                           # connected device / emulator (Android, iOS)
flutter run -d chrome                 # web
flutter run -d windows                # Windows desktop
flutter run -d macos                  # macOS desktop
flutter run -d linux                  # Linux desktop
```

Enable the desktop/web targets on your machine once with
`flutter config --enable-<platform>-desktop` / `--enable-web` if `flutter
devices` doesn't list them.

### Web SQLite assets

The web build needs a SQLite WASM worker. Those assets (`web/sqlite3.wasm`,
`web/sqflite_sw.js`) are committed, but if you upgrade `sqflite_common_ffi_web`
regenerate them with:

```bash
dart run sqflite_common_ffi_web:setup
```

### Regenerating platform folders

If you ever need to recreate the platform scaffolding, `flutter create .` fills
in any missing folders without touching `lib/`.

## Talking to the backend

The app is **offline-first**: it seeds a local SQLite store on first launch and
works with no network. The `Sync` button (home banner) flushes the queue to the
backend and clears only server-acknowledged records.

The default base URL is chosen per platform (see `lib/config/api_config.dart`):
the Android emulator uses `http://10.0.2.2:8080` (its alias for the host's
localhost), while web, desktop and the iOS simulator use `http://localhost:8080`.
Override any of it via a dart-define:

```bash
# Real device — use the host machine's LAN IP
flutter run --dart-define=API_BASE_URL=http://192.168.0.10:8080

# Point anywhere (e.g. a deployed server)
flutter run --dart-define=API_BASE_URL=https://trnapp.example.org
```

**Android cleartext HTTP:** talking to a local `http://` backend on Android API
28+ requires cleartext to be allowed. For development add
`android:usesCleartextTraffic="true"` to `<application>` in
`android/app/src/main/AndroidManifest.xml` (and keep the `INTERNET` permission).
Use HTTPS in production.

## Offline-first behaviour

- First launch seeds beneficiaries, workers, and a backlog so the banner shows
  "7 records pending sync" exactly as in the design reference.
- Every write goes through `Repository`, which updates the local store **and**
  appends to the sync queue (`sqflite`). The home banner shows the live pending
  count.
- `Repository.flushSyncQueue()` POSTs the batch to `/api/sync` and clears only
  the ref ids the server acknowledged, so an interrupted sync is safe to retry.

## Centralised clinical logic

All scoring lives in `lib/domain/` and is kept in lock-step with the backend:

- **`risk.dart`** — `computeAncRisk()`: any danger sign → high; BP / Hb / FHR
  thresholds bump the level (recolours avatars, borders, badges everywhere).
- **`nutrition.dart`** — `classifyMuac()`: MUAC < 11.5 cm or bilateral oedema =
  SAM, < 12.5 cm = MAM, otherwise normal.
- **`indicators.dart` / `dashboard.dart`** — WHO/Bangladesh framework readouts
  and aggregate dashboard figures.

Try it: on the **ANC visit** screen, toggle danger signs or change BP/Hb — the
risk banner and referral panel re-classify live.
