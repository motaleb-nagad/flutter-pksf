package bd.gov.mch.domain;

import com.fasterxml.jackson.annotation.JsonValue;

/** Category of person enrolled in the surveillance programme. */
public enum BeneficiaryType {
    ANC("anc"),         // pregnant / antenatal
    PNC("pnc"),         // postnatal
    CHILD("child"),
    ADOLESCENT("adolescent"),
    ELDERLY("elderly"),
    DISABLED("disabled");

    private final String json;

    BeneficiaryType(String json) {
        this.json = json;
    }

    @JsonValue
    public String json() {
        return json;
    }

    public static BeneficiaryType fromJson(String value) {
        for (BeneficiaryType t : values()) {
            if (t.json.equalsIgnoreCase(value)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Unknown beneficiary type: " + value);
    }
}
