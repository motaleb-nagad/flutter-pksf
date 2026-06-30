package bd.gov.mch.service;

import java.security.SecureRandom;
import org.springframework.stereotype.Service;

/**
 * Small presentation/identity helpers shared across surfaces: initials, the
 * coverage/burden colour scale, and the field-officer username/password
 * generators. Ported from the field app's {@code format.ts}.
 */
@Service
public class FormatService {

    private static final SecureRandom RANDOM = new SecureRandom();

    /** First-two initials from a name, e.g. "Rahima Begum" → "RB". */
    public String initials(String name) {
        StringBuilder sb = new StringBuilder();
        String[] words = name.trim().split("\\s+");
        for (String w : words) {
            if (sb.length() >= 2) {
                break;
            }
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)));
            }
        }
        return sb.toString();
    }

    /**
     * Coverage / prevalence colour. For coverage indicators higher is better; for
     * "burden" indicators (wasting, caesarean rate, unmet need) the scale inverts.
     */
    public String covColor(int v, boolean burden) {
        if (burden) {
            return v >= 25 ? "#C0492E" : v >= 12 ? "#B5792A" : "#0E7C66";
        }
        return v >= 85 ? "#0E7C66" : v >= 60 ? "#B5792A" : "#C0492E";
    }

    public String covColor(int v) {
        return covColor(v, false);
    }

    /** Lower-cased initials of a union name, e.g. "Char Bhola" → "cb". */
    public String unionCode(String union) {
        StringBuilder sb = new StringBuilder();
        for (String w : union.trim().split("\\s+")) {
            if (!w.isEmpty()) {
                sb.append(Character.toLowerCase(w.charAt(0)));
            }
        }
        return sb.toString();
    }

    /** Username generator used when onboarding a field officer (e.g. "sahida.cb06"). */
    public String genUsername(String name, String union, int n) {
        String[] parts = name.trim().split("\\s+");
        String first = (parts.length > 0 && !parts[0].isEmpty() ? parts[0] : "worker")
                .toLowerCase()
                .replaceAll("[^a-z]", "");
        if (first.isEmpty()) {
            first = "worker";
        }
        return String.format("%s.%s%02d", first, unionCode(union), n);
    }

    /** Temporary password generator, e.g. "Mch-K7QF". */
    public String genPassword() {
        String alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        StringBuilder p = new StringBuilder("Mch-");
        for (int i = 0; i < 4; i++) {
            p.append(alphabet.charAt(RANDOM.nextInt(alphabet.length())));
        }
        return p.toString();
    }
}
