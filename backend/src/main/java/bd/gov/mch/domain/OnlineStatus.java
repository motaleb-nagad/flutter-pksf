package bd.gov.mch.domain;

import com.fasterxml.jackson.annotation.JsonValue;

/** Whether a field officer's device last reported as online or offline. */
public enum OnlineStatus {
    ONLINE("online"),
    OFFLINE("offline");

    private final String json;

    OnlineStatus(String json) {
        this.json = json;
    }

    @JsonValue
    public String json() {
        return json;
    }
}
