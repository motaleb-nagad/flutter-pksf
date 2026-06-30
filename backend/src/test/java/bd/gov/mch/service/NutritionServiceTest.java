package bd.gov.mch.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class NutritionServiceTest {

    private final NutritionService nutrition = new NutritionService();

    @Test
    void lowMuacIsSam() {
        assertThat(nutrition.classifyMuac(11.2, false).shortLabel()).isEqualTo("SAM");
    }

    @Test
    void oedemaAloneIsSam() {
        assertThat(nutrition.classifyMuac(13.0, true).shortLabel()).isEqualTo("SAM");
    }

    @Test
    void midRangeMuacIsMam() {
        assertThat(nutrition.classifyMuac(12.0, false).shortLabel()).isEqualTo("MAM");
    }

    @Test
    void healthyMuacIsNormal() {
        assertThat(nutrition.classifyMuac(13.5, false).shortLabel()).isEqualTo("Normal");
    }
}
