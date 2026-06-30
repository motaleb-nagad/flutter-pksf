package bd.gov.mch.service;

import org.springframework.stereotype.Service;

/**
 * Child nutrition classification by MUAC (mid-upper-arm circumference) + oedema.
 * MUAC &lt; 11.5 cm or bilateral pitting oedema = SAM; &lt; 12.5 cm = MAM; else Normal.
 * Ported from the field app's {@code nutrition.ts}.
 */
@Service
public class NutritionService {

    public record NutritionStatus(String shortLabel, String label, String bn,
                                  String action, String color, String bg) {
    }

    public NutritionStatus classifyMuac(double cm, boolean edema) {
        if (edema || cm < 11.5) {
            return new NutritionStatus(
                    "SAM",
                    "Severe Acute Malnutrition (SAM)",
                    "তীব্র অপুষ্টি",
                    "Refer to nutrition centre today",
                    "#C0492E", "#F7E4DE");
        }
        if (cm < 12.5) {
            return new NutritionStatus(
                    "MAM",
                    "Moderate Acute Malnutrition (MAM)",
                    "মাঝারি অপুষ্টি",
                    "Enrol in supplementary feeding",
                    "#B5792A", "#F5EAD6");
        }
        return new NutritionStatus(
                "Normal",
                "Normal nutrition status",
                "স্বাভাবিক",
                "Continue growth monitoring",
                "#0E7C66", "#E0EFEA");
    }
}
