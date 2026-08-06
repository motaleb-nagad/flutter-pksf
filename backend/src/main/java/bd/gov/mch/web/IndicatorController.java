package bd.gov.mch.web;

import bd.gov.mch.service.IndicatorService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** WHO &amp; Bangladesh MCH framework indicators for the supervisor portal. */
@RestController
@RequestMapping("/api/indicators")
public class IndicatorController {

    private final IndicatorService indicators;

    public IndicatorController(IndicatorService indicators) {
        this.indicators = indicators;
    }

    @GetMapping
    public List<IndicatorService.IndicatorGroup> indicators() {
        return indicators.indicatorGroups();
    }
}
