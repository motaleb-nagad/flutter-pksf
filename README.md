# Preventive Healthcare Programme — Maternal & Child Health (MCH) Field Surveillance

An offline-first preventive-healthcare surveillance system for rural Bangladesh
(**মা ও শিশু স্বাস্থ্য**), built around the WHO continuum-of-care framework. It has
two surfaces:

1. **Field Officer App** — a mobile, offline-first app used by community health
   workers (FWA / FWV / CHCP) to register beneficiaries, conduct home visits
   (ANC, PNC, child health, immunisation, nutrition), record danger signs, and
   sync when connectivity returns.
2. **Supervisor Web Portal** — a desktop dashboard for upazila/union supervisors
   to monitor programme indicators, beneficiaries, and field-officer performance,
   and to onboard new field officers.

Both surfaces are bilingual — English with Bangla (বাংলা) secondary labels
throughout. Sample data uses **Char Bhola Union, Bhola Sadar Upazila**.

This implementation recreates the design handoff in a single React app: the field
app is a real, installable **PWA** (offline-first, IndexedDB + sync queue), and
the portal is a standard SPA with a charting library.

## Tech stack

| Concern | Choice |
|---|---|
| UI | React 18 + TypeScript + Vite |
| Offline storage | IndexedDB via **Dexie** (`dexie-react-hooks` for live queries) |
| Offline app shell | **vite-plugin-pwa** (Workbox precache + font runtime cache) |
| UI / session state | **zustand** |
| Charts | **Recharts** |
| Icons | Inline SVG icon set (no emoji shipped — see `src/components/Icon.tsx`) |
| Fonts | Hind Siliguri (Bangla + Latin) + IBM Plex Mono |

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build (outputs dist/)
npm run preview    # preview the production build
npm run typecheck  # type-check only
```

Open the app and use the toggle at the top to switch between the **Field Officer
App** and the **Supervisor Portal**. Both have a login screen first; auth is
mocked, so any password logs in.

- Field officer — username `rokeya.cb01`
- Supervisor — username `s.rahman`

## Offline-first behaviour

Offline operation is core, not cosmetic:

- On first launch the local IndexedDB is **seeded** (`src/data/db.ts`) so the app
  works immediately with no network.
- Every write goes through `src/data/repository.ts`, which updates the local DB
  **and** appends a record to a **sync queue**. The home banner shows the live
  pending-sync count from that queue.
- The **Sync** button flushes the queue and updates the "last synced" time
  (`src/app/useSync.ts`). With no backend wired up this simulates the round-trip;
  the real implementation would POST batched records and clear only those the
  server acknowledged.
- The app registers a service worker (vite-plugin-pwa) so the shell + assets are
  cached and the app is installable on a phone.
- Real browser connectivity (`online`/`offline` events) drives the banner state.

## Domain logic (centralized)

All clinical/scoring logic lives in `src/domain/` so colours and thresholds never
drift across surfaces:

- **`risk.ts`** — the single `RISK` map (high/medium/low colours + bilingual
  labels) and `computeAncRisk()`, which auto-classifies an ANC visit from vitals
  and danger signs (any danger sign → high; BP / Hb / FHR thresholds bump the
  level). This recolours avatars, left borders, and badges everywhere.
- **`nutrition.ts`** — `classifyMuac()`: MUAC < 11.5 cm or bilateral oedema = SAM,
  < 12.5 cm = MAM, otherwise normal.
- **`indicators.ts`** — WHO/Bangladesh MCH framework indicators (coverage vs
  burden metrics, with an inverted colour scale for burden).
- **`format.ts`** — initials, bilingual type lines, coverage colours, and the
  field-officer username/password generators.

Try it: on the **ANC visit** screen, toggle danger signs or change BP/Hb — the
risk banner and referral panel re-classify live.

## Project structure

```
src/
  domain/        types + centralized risk/nutrition/indicators/dashboard + seed data
  data/          Dexie DB, sync queue repository, React hooks
  store/         zustand UI/session/navigation store
  components/    shared primitives (Icon, RiskBadge, Avatar, Card, frames)
  app/           Field Officer mobile app (login, home, list, register,
                 ANC visit, child health, profile, bottom nav)
  portal/        Supervisor portal (login, sidebar, dashboard, beneficiaries,
                 indicators, field officers, onboarding modal)
  styles/        design tokens + global styles
```

## Design fidelity

Colours, typography, spacing, copy (EN + BN), and interaction flows follow the
design handoff. Design tokens are centralized in `src/styles/tokens.css`. The
device/browser frames in `src/components/Frames.tsx` are presentation chrome only
(communicating "offline mobile app" vs "desktop portal"); they are not domain
code. The mock's hand-built bar charts are replaced with Recharts, and the
placeholder emoji icons are replaced with an inline SVG icon set.

## Notes / next steps

- Wire the sync queue to a real backend (batched POST + server-acknowledged
  clear) and add conflict resolution.
- Replace mocked auth with role-based access (field officer vs supervisor).
- Add per-beneficiary visit history persistence (currently visits update the
  beneficiary's risk/next-visit; full timelines are illustrative).
- Code-split the portal/charts bundle to reduce initial JS.
