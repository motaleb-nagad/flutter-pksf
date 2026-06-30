package bd.gov.mch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the MCH (Maternal &amp; Child Health) field-surveillance API.
 *
 * <p>This service is the backend the offline-first Flutter field app syncs to:
 * it stores beneficiaries and field officers, centralises the clinical scoring
 * logic (risk / nutrition / indicators), and exposes the supervisor dashboard.
 */
@SpringBootApplication
public class MchApplication {
    public static void main(String[] args) {
        SpringApplication.run(MchApplication.class, args);
    }
}
