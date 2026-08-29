-- V2 — households table: "খানার ভৌগোলিক অবস্থান" (household geographic
-- location) baseline data, collected once per household at programme start.
-- household_code is the "ইউনিক খানা নম্বর" the requirement doc calls for:
-- every later section (members, ANC, PNC, child) looks a household up by it.

CREATE TABLE households (
    household_code              VARCHAR(255) PRIMARY KEY,

    -- ১.১ - ১.২: who collected this and when
    data_collection_date        DATE,
    collector_name_designation  VARCHAR(255),

    -- ১.৩: partner organisation name
    partner_org_name            VARCHAR(255),

    -- ১.৪ - ১.৮: administrative location
    branch_name                 VARCHAR(255),
    branch_code                 VARCHAR(255),
    district                    VARCHAR(255),
    upazila                     VARCHAR(255),
    union_or_municipality       VARCHAR(255),

    -- ১.৯ - ১.১০: microfinance identifiers
    samity_number                VARCHAR(255),
    borrower_member_number      VARCHAR(255),

    -- ১.১১: GPS location (split for geo queries instead of one free-text field)
    gps_latitude                 DOUBLE PRECISION,
    gps_longitude                DOUBLE PRECISION
);
