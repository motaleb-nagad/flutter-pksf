package bd.gov.mch.service;

import bd.gov.mch.domain.AncVisit;
import bd.gov.mch.domain.DangerSigns;
import bd.gov.mch.domain.RiskLevel;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Centralised risk classification — the single source of truth for how an ANC
 * visit becomes a risk level. Any danger sign forces HIGH; BP / Hb / FHR
 * thresholds bump the level. Ported verbatim from the field app's {@code risk.ts}
 * so the app and server never drift.
 */
@Service
public class RiskService {

    /** Bilingual + colour styling for a risk level (mirrors the app's RISK map). */
    public record RiskStyle(String color, String bg, String label, String bn) {
    }

    /** A computed classification: the level, its styling, and the reasons behind it. */
    public record ComputedRisk(RiskLevel level, List<String> reasons,
                               String color, String bg, String label, String bn) {
    }

    public static RiskStyle style(RiskLevel level) {
        return switch (level) {
            case HIGH -> new RiskStyle("#C0492E", "#F7E4DE", "High risk", "উচ্চ ঝুঁকি");
            case MEDIUM -> new RiskStyle("#B5792A", "#F5EAD6", "Medium risk", "মাঝারি ঝুঁকি");
            case LOW -> new RiskStyle("#0E7C66", "#E0EFEA", "Low risk", "কম ঝুঁকি");
        };
    }

    private static final Map<String, String> DANGER_LABELS = new LinkedHashMap<>();

    static {
        DANGER_LABELS.put("headache", "Severe headache");
        DANGER_LABELS.put("blurred", "Blurred vision");
        DANGER_LABELS.put("swelling", "Swelling of face / hands");
        DANGER_LABELS.put("bleeding", "Vaginal bleeding");
        DANGER_LABELS.put("convulsions", "Convulsions");
        DANGER_LABELS.put("fever", "High fever");
        DANGER_LABELS.put("fetal", "Reduced fetal movement");
        DANGER_LABELS.put("abdo", "Severe abdominal pain");
        DANGER_LABELS.put("breathing", "Difficult breathing");
    }

    /** Auto-classify an ANC visit from vitals and danger signs. */
    public ComputedRisk computeAncRisk(AncVisit v) {
        List<String> reasons = new ArrayList<>();
        RiskLevel level = RiskLevel.LOW;

        DangerSigns d = v.getDanger() == null ? new DangerSigns() : v.getDanger();
        Map<String, Boolean> flags = new LinkedHashMap<>();
        flags.put("headache", d.isHeadache());
        flags.put("blurred", d.isBlurred());
        flags.put("swelling", d.isSwelling());
        flags.put("bleeding", d.isBleeding());
        flags.put("convulsions", d.isConvulsions());
        flags.put("fever", d.isFever());
        flags.put("fetal", d.isFetal());
        flags.put("abdo", d.isAbdo());
        flags.put("breathing", d.isBreathing());

        for (Map.Entry<String, Boolean> e : flags.entrySet()) {
            if (Boolean.TRUE.equals(e.getValue())) {
                reasons.add(DANGER_LABELS.get(e.getKey()));
                level = RiskLevel.max(level, RiskLevel.HIGH);
            }
        }

        if (v.getSbp() >= 140 || v.getDbp() >= 90) {
            reasons.add("Raised BP " + v.getSbp() + "/" + v.getDbp() + " mmHg (pre-eclampsia risk)");
            level = RiskLevel.max(level, RiskLevel.HIGH);
        } else if (v.getSbp() >= 130 || v.getDbp() >= 85) {
            reasons.add("Borderline BP " + v.getSbp() + "/" + v.getDbp());
            level = RiskLevel.max(level, RiskLevel.MEDIUM);
        }

        if (v.getHb() < 7) {
            reasons.add("Severe anaemia · Hb " + trim(v.getHb()) + " g/dL");
            level = RiskLevel.max(level, RiskLevel.HIGH);
        } else if (v.getHb() < 11) {
            reasons.add("Anaemia · Hb " + trim(v.getHb()) + " g/dL");
            level = RiskLevel.max(level, RiskLevel.MEDIUM);
        }

        if (v.getFhr() < 120 || v.getFhr() > 160) {
            reasons.add("Abnormal fetal heart rate " + v.getFhr() + " bpm");
            level = RiskLevel.max(level, RiskLevel.HIGH);
        }

        RiskStyle s = style(level);
        return new ComputedRisk(level, reasons, s.color(), s.bg(), s.label(), s.bn());
    }

    /** Render a double without a trailing ".0" so "9.5" and "7" read cleanly. */
    private static String trim(double value) {
        if (value == Math.rint(value)) {
            return String.valueOf((long) value);
        }
        return String.valueOf(value);
    }
}
