package bd.gov.mch.web;

import bd.gov.mch.service.DashboardService;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Aggregate figures for the supervisor dashboard. */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboard;

    public DashboardController(DashboardService dashboard) {
        this.dashboard = dashboard;
    }

    @GetMapping
    public Map<String, Object> dashboard() {
        return Map.of(
                "kpis", dashboard.kpis(),
                "ancTrend", dashboard.ancTrend(),
                "antigens", dashboard.antigens(),
                "nutritionBands", dashboard.nutritionBands(),
                "riskDistribution", dashboard.riskDistribution());
    }
}
