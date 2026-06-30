# MCH Surveillance — Mobile App (Flutter)

Cross-platform (iOS + Android) offline-first app for the Preventive Healthcare
Programme — Maternal & Child Health field surveillance. It carries both surfaces
of the original design:

1. **Field Officer App** — register beneficiaries, conduct ANC / child / general
   visits, auto-classify risk and nutrition, and sync when connectivity returns.
2. **Supervisor Portal** — dashboard, beneficiaries, WHO-framework indicators,
   and field-officer onboarding (toggle via the **Portal** tab in the bottom nav).

Both surfaces are bilingual (English + বাংলা). Sample data is Char Bhola Union,
Bhola Sadar Upazila.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Flutter (Dart 3) — one codebase for iOS + Android |
| State | `provider` (`ChangeNotifier`) |
| Offline storage | `sqflite` (local SQLite + a sync queue) |
| Networking | `http` to the Spring Boot backend |
| Charts | Lightweight hand-built bar/progress widgets (no native chart dep) |

## Project layout

```
lib/
  domain/    models + ported clinical logic (risk, nutrition, indicators,
             dashboard, format) + seed data — pure Dart, unit-tested
  data/      local_db (sqflite), api_client (REST), repository (writes + sync queue)
  state/     AppState (provider): navigation, auth, connectivity, cached data
  theme/     design tokens (colours) + ThemeData
  app/       Field Officer app (login, home, list, register, ANC visit,
             child health, profile, bottom nav)
  portal/    Supervisor portal (login, sidebar, dashboard, beneficiaries,
             indicators, field officers, onboarding modal)
test/        domain logic parity tests (mirror the backend's tests)
```

## Getting started

This repo ships the Dart source (`lib/`, `pubspec.yaml`, `test/`). Generate the
native iOS/Android scaffolding once, then run:

```bash
cd mobile
flutter create .            # generates android/ and ios/ from pubspec (keeps lib/)
flutter pub get
flutter test                # run the domain logic tests
flutter run                 # launch on a connected device / emulator
```

## Talking to the backend

The app is **offline-first**: it seeds a local SQLite store on first launch and
works with no network. The `Sync` button (home banner) flushes the queue to the
backend and clears only server-acknowledged records.

Point the app at your running Spring Boot backend via a dart-define:

```bash
# Android emulator reaches the host machine at 10.0.2.2 (the default)
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080

# Real device / iOS simulator — use the host machine's LAN IP
flutter run --dart-define=API_BASE_URL=http://192.168.0.10:8080
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
