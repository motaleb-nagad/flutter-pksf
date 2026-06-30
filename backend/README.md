# MCH Surveillance — Backend (Spring Boot)

REST API for the Preventive Healthcare Programme (Maternal & Child Health field
surveillance). It is the server the offline-first Flutter field app syncs to, and
it centralises the clinical scoring logic so the app and server never drift.

## Tech stack

| Concern | Choice |
|---|---|
| Language / runtime | Java 21 |
| Framework | Spring Boot 3.3 (Web + Data JPA + Validation) |
| Database | H2 in-memory (swap the datasource for PostgreSQL in production) |
| Build | Maven |

## Running

```bash
cd backend
mvn spring-boot:run        # starts on http://localhost:8080
mvn test                   # run the unit tests (risk + nutrition logic)
mvn clean package          # build the runnable jar (target/*.jar)
```

The in-memory DB is seeded on startup with the design-handoff sample data
(Char Bhola Union, Bhola Sadar Upazila). The H2 web console is at
`http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:mch`, user `sa`).

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Mock login; username `s.rahman` → supervisor, else field officer |
| `GET`  | `/api/beneficiaries` | List the beneficiary register |
| `GET`  | `/api/beneficiaries/{id}` | One beneficiary |
| `POST` | `/api/beneficiaries` | Register / upsert a beneficiary |
| `POST` | `/api/beneficiaries/{id}/anc-visit` | Record an ANC visit (classifies + updates risk) |
| `POST` | `/api/beneficiaries/{id}/child-assessment` | Record growth/nutrition (classifies MUAC) |
| `POST` | `/api/risk/anc` | Live ANC risk preview (no persistence) |
| `POST` | `/api/nutrition/muac` | Live MUAC nutrition preview (no persistence) |
| `GET`  | `/api/workers` | Field-officer roster |
| `POST` | `/api/workers` | Onboard a field officer (returns generated credentials) |
| `POST` | `/api/sync` | Receive a batched offline sync queue and acknowledge it |
| `GET`  | `/api/dashboard` | KPIs, ANC trend, antigen coverage, nutrition + risk bands |
| `GET`  | `/api/indicators` | WHO / Bangladesh MCH framework indicators |

## Centralised clinical logic

The scoring logic lives in `service/` and is exercised by unit tests:

- **`RiskService`** — `computeAncRisk()`: any danger sign → high; BP / Hb / FHR
  thresholds bump the level. Returns the level plus the human-readable reasons.
- **`NutritionService`** — `classifyMuac()`: MUAC < 11.5 cm or bilateral oedema =
  SAM, < 12.5 cm = MAM, otherwise normal.
- **`IndicatorService` / `DashboardService`** — the WHO/Bangladesh framework
  readouts and the aggregate dashboard figures (coverage vs burden colour scale).

## Production notes

- Swap H2 for PostgreSQL by changing `spring.datasource.*` in `application.yml`
  and setting `spring.jpa.hibernate.ddl-auto=validate` with a migration tool.
- Replace the mocked `AuthController` with real role-scoped tokens (JWT/OAuth2).
- The `/api/sync` endpoint currently acknowledges everything; add idempotency
  keys + conflict resolution before relying on it for real field data.
