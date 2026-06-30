package bd.gov.mch.service;

import static org.assertj.core.api.Assertions.assertThat;

import bd.gov.mch.domain.AncVisit;
import bd.gov.mch.domain.RiskLevel;
import org.junit.jupiter.api.Test;

class RiskServiceTest {

    private final RiskService risk = new RiskService();

    private AncVisit healthy() {
        AncVisit v = new AncVisit();
        v.setSbp(118);
        v.setDbp(76);
        v.setHb(12.0);
        v.setFhr(140);
        return v;
    }

    @Test
    void healthyVitalsAreLowRisk() {
        RiskService.ComputedRisk r = risk.computeAncRisk(healthy());
        assertThat(r.level()).isEqualTo(RiskLevel.LOW);
        assertThat(r.reasons()).isEmpty();
    }

    @Test
    void anyDangerSignForcesHigh() {
        AncVisit v = healthy();
        v.getDanger().setBleeding(true);
        RiskService.ComputedRisk r = risk.computeAncRisk(v);
        assertThat(r.level()).isEqualTo(RiskLevel.HIGH);
        assertThat(r.reasons()).contains("Vaginal bleeding");
    }

    @Test
    void raisedBloodPressureIsHigh() {
        AncVisit v = healthy();
        v.setSbp(150);
        v.setDbp(95);
        RiskService.ComputedRisk r = risk.computeAncRisk(v);
        assertThat(r.level()).isEqualTo(RiskLevel.HIGH);
    }

    @Test
    void borderlineBloodPressureIsMedium() {
        AncVisit v = healthy();
        v.setSbp(132);
        v.setDbp(86);
        RiskService.ComputedRisk r = risk.computeAncRisk(v);
        assertThat(r.level()).isEqualTo(RiskLevel.MEDIUM);
    }

    @Test
    void mildAnaemiaIsMediumSevereIsHigh() {
        AncVisit mild = healthy();
        mild.setHb(9.2);
        assertThat(risk.computeAncRisk(mild).level()).isEqualTo(RiskLevel.MEDIUM);

        AncVisit severe = healthy();
        severe.setHb(6.5);
        assertThat(risk.computeAncRisk(severe).level()).isEqualTo(RiskLevel.HIGH);
    }

    @Test
    void abnormalFetalHeartRateIsHigh() {
        AncVisit v = healthy();
        v.setFhr(110);
        assertThat(risk.computeAncRisk(v).level()).isEqualTo(RiskLevel.HIGH);
    }
}
