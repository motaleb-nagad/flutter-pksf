# MCH Surveillance — Backend (Spring Boot)

REST API for the Preventive Healthcare Programme (Maternal & Child Health field
surveillance). It is the server the offline-first Flutter field app syncs to, and
it centralises the clinical scoring logic so the app and server never drift.

## Tech stack

| Concern | Choice |
|---|---|
| Language / runtime | Java 21 |
| Framework | Spring Boot 3.3 (Web + Data JPA + Validation) |
| Database | **PostgreSQL** (default) · H2 file fallback via the `h2` profile |
| Build | Maven |

## Database setup (PostgreSQL)

The backend expects a PostgreSQL database. Either:

**Option A — Docker (one command):**
```bash
cd backend
docker compose up -d       # postgres:16 on localhost:5432, db/user/pass = mch
```

**Option B — your own PostgreSQL install:**
```sql
CREATE USER mch WITH PASSWORD 'mch';
CREATE DATABASE mch OWNER mch;
```

Connection settings default to `jdbc:postgresql://localhost:5432/mch` with
`mch`/`mch` and are overridable per environment — no code change needed:

```bash
DB_URL=jdbc:postgresql://dbhost:5432/mch DB_USERNAME=app DB_PASSWORD=secret mvn spring-boot:run
```

Hibernate creates/updates the tables on startup (`ddl-auto: update`) and the
seeder populates the sample data (Char Bhola Union) only when the tables are
empty — restarts never duplicate data. For production, switch to
`ddl-auto: validate` and manage schema changes with Flyway.

## Running

```bash
cd backend
mvn spring-boot:run        # starts on http://localhost:8080 (needs PostgreSQL up)
mvn test                   # run the unit tests (risk + nutrition logic)
mvn clean package          # build the runnable jar (target/*.jar)
```

**No PostgreSQL handy?** Use the zero-install H2 fallback (file under
`backend/data/`, console at `/h2-console`):

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | DB-backed login against the `users` table; 401 on bad credentials |
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

- Set `spring.jpa.hibernate.ddl-auto=validate` and manage schema changes with
  Flyway migrations instead of letting Hibernate alter tables.
- Passwords in the `users` table are plain text (demo); hash with BCrypt and
  issue role-scoped tokens (JWT/OAuth2) from `AuthController`.
- The `/api/sync` endpoint currently acknowledges everything; add idempotency
  keys + conflict resolution before relying on it for real field data.
- Point `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` at your managed PostgreSQL.
