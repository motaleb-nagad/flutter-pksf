-- V1 — baseline schema for the MCH surveillance backend (PostgreSQL).
-- Matches the JPA entities exactly: Hibernate runs with ddl-auto=validate,
-- so every schema change from here on is a new Vn__*.sql migration.

CREATE TABLE beneficiaries (
    id          VARCHAR(255) PRIMARY KEY,
    name        VARCHAR(255),
    bn          VARCHAR(255),
    type        VARCHAR(255),
    village     VARCHAR(255),
    code        VARCHAR(255),
    risk        VARCHAR(255),
    reason      VARCHAR(512),
    next_visit  VARCHAR(255),
    age         INTEGER,
    months      INTEGER,
    weeks       INTEGER,
    anc         INTEGER,
    edd         VARCHAR(255),
    pnc_day     INTEGER,
    muac        DOUBLE PRECISION
);

CREATE TABLE workers (
    id          VARCHAR(255) PRIMARY KEY,
    name        VARCHAR(255),
    role        VARCHAR(255),
    union_name  VARCHAR(255),
    assigned    INTEGER NOT NULL,
    high        INTEGER NOT NULL,
    visits      INTEGER NOT NULL,
    cov         INTEGER NOT NULL,
    last_sync   VARCHAR(255),
    status      VARCHAR(255)
);

CREATE TABLE users (
    username    VARCHAR(255) PRIMARY KEY,
    password    VARCHAR(255) NOT NULL,
    user_role   VARCHAR(255) NOT NULL,
    name        VARCHAR(255),
    scope       VARCHAR(255)
);
