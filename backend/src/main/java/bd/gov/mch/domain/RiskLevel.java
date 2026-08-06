package bd.gov.mch.domain;

import com.fasterxml.jackson.annotation.JsonValue;

/** Beneficiary risk classification, lowest → highest. */
public enum RiskLevel {
    LOW("low", 0),
    MEDIUM("medium", 1),
    HIGH("high", 2);

    private final String json;
    private final int order;

    RiskLevel(String json, int order) {
        this.json = json;
        this.order = order;
    }

    @JsonValue
    public String json() {
        return json;
    }

    public int order() {
        return order;
    }

    /** Returns the more severe of two levels. */
    public static RiskLevel max(RiskLevel a, RiskLevel b) {
        return a.order >= b.order ? a : b;
    }

    public static RiskLevel fromJson(String value) {
        for (RiskLevel r : values()) {
            if (r.json.equalsIgnoreCase(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Unknown risk level: " + value);
    }
}
