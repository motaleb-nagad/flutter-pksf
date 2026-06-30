# Preventive Healthcare Programme — Maternal & Child Health (MCH) Field Surveillance

An offline-first preventive-healthcare surveillance system for rural Bangladesh
(**মা ও শিশু স্বাস্থ্য**), built around the WHO continuum-of-care framework.

This repository is a **Flutter (iOS + Android) app + Spring Boot (Java) backend**
rebuild of the original design. It keeps the two surfaces of the programme:

1. **Field Officer App** — a mobile, offline-first app used by community health
   workers (FWA / FWV / CHCP) to register beneficiaries, conduct home visits
   (ANC, PNC, child health, immunisation, nutrition), record danger signs, and
   sync when connectivity returns.
2. **Supervisor Portal** — a dashboard to monitor programme indicators,
   beneficiaries, and field-officer performance, and to onboard new field
   officers. (Shipped inside the same Flutter app — toggle via the **Portal** tab.)

Both surfaces are bilingual — English with Bangla (বাংলা) secondary labels.
Sample data uses **Char Bhola Union, Bhola Sadar Upazila**.

## Architecture

```
├── mobile/     Flutter app (iOS + Android) — field app + supervisor portal
└── backend/    Spring Boot (Java 21) REST API — H2, JPA, clinical logic, seed data
```

| Layer | Tech |
|---|---|
| Mobile app | Flutter (Dart 3), `provider`, `sqflite` (offline store), `http` |
| Backend | Java 21, Spring Boot 3.3 (Web + Data JPA + Validation), H2 |
| Build | `flutter` (app) · Maven (backend) |

The **clinical scoring logic is centralized and duplicated in lock-step** on both
sides (Dart `lib/domain/` and Java `service/`), each covered by unit tests, so the
app can classify risk/nutrition fully offline and the server stays authoritative:

- **Risk** — any ANC danger sign → high; BP / Hb / FHR thresholds bump the level.
- **Nutrition** — MUAC < 11.5 cm or bilateral oedema = SAM, < 12.5 cm = MAM.
- **Indicators / dashboard** — WHO & Bangladesh MCH framework readouts.

## Quick start

### 1. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run     # API on http://localhost:8080 (seeded in-memory H2)
mvn test                # risk + nutrition unit tests
```

### 2. Mobile app (Flutter)

```bash
cd mobile
flutter create .        # generate android/ + ios/ scaffolding from pubspec
flutter pub get
flutter test            # domain-logic parity tests
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080   # Android emulator
```

`10.0.2.2` is the host machine from the Android emulator; use the machine's LAN
IP for a real device or iOS simulator. See `mobile/README.md` for the Android
cleartext-HTTP note and `backend/README.md` for the full API reference.

## Offline-first behaviour

- The field app seeds a local SQLite store on first launch and works with no
  network; the home banner shows the live pending-sync count.
- Every write updates the local store **and** appends to a sync queue. The
  `Sync` action POSTs the batch to `/api/sync` and clears only the records the
  server acknowledges, so an interrupted sync is safe to retry.

## Demo logins (auth is mocked — any password works)

- Field officer — username `rokeya.cb01`
- Supervisor — username `s.rahman`

## Next steps

- Replace mocked auth with role-scoped tokens (JWT/OAuth2).
- Swap H2 for PostgreSQL and add migrations + conflict resolution on sync.
- Persist full per-beneficiary visit history (visits currently update the
  beneficiary's risk/next-visit; timelines are illustrative).
