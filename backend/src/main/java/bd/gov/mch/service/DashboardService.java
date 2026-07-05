package bd.gov.mch.service;

import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Aggregate programme figures for the supervisor dashboard (KPIs, ANC trend,
 * antigen coverage, nutrition bands, risk distribution). Ported from the field
 * app's {@code dashboard.ts}.
 */
@Service
public class DashboardService {

    private final FormatService format;

    public DashboardService(FormatService format) {
        this.format = format;
    }

    public record Kpi(String en, String bn, String value, String sub, boolean good) {
    }

    public record Point(String label, int value) {
    }

    public record ColoredPoint(String label, int value, String color) {
    }

    public List<Kpi> kpis() {
        return List.of(
                new Kpi("Registered pregnancies", "নিবন্ধিত গর্ভবতী", "1,284", "+96 this month", true),
                new Kpi("ANC 4+ coverage", "এএনসি ৪+", "71%", "Target 90%", false),
                new Kpi("Skilled birth attendance", "দক্ষ ধাত্রী", "63%", "+4 pts vs Q1", true),
                new Kpi("PNC within 48 hr", "পিএনসি ৪৮ ঘণ্টা", "58%", "Target 80%", false),
                new Kpi("Fully immunised <1 yr", "সম্পূর্ণ টিকা", "84%", "+2 pts", true),
                new Kpi("Active SAM cases", "সক্রিয় তীব্র অপুষ্টি", "37", "29 in treatment", false));
    }

    public List<Point> ancTrend() {
        return List.of(
                new Point("Jan", 58), new Point("Feb", 61), new Point("Mar", 64),
                new Point("Apr", 66), new Point("May", 69), new Point("Jun", 71));
    }

    public List<ColoredPoint> antigens() {
        return List.of(
                point("BCG", 97), point("Penta3", 88), point("PCV3", 86), point("OPV3", 87),
                point("IPV", 79), point("MR1", 85), point("MR2", 72));
    }

    private ColoredPoint point(String label, int value) {
        return new ColoredPoint(label, value, format.covColor(value));
    }

    public List<ColoredPoint> nutritionBands() {
        return List.of(
                new ColoredPoint("Normal", 81, "#03803D"),
                new ColoredPoint("MAM", 13, "#B5792A"),
                new ColoredPoint("SAM", 6, "#C0492E"));
    }

    public List<ColoredPoint> riskDistribution() {
        return List.of(
                new ColoredPoint("Low", 64, "#03803D"),
                new ColoredPoint("Medium", 26, "#B5792A"),
                new ColoredPoint("High", 10, "#C0492E"));
    }
}
