package bd.gov.mch.config;

import bd.gov.mch.domain.Beneficiary;
import bd.gov.mch.domain.BeneficiaryType;
import bd.gov.mch.domain.OnlineStatus;
import bd.gov.mch.domain.RiskLevel;
import bd.gov.mch.domain.User;
import bd.gov.mch.domain.Worker;
import bd.gov.mch.domain.WorkerRole;
import bd.gov.mch.repo.BeneficiaryRepository;
import bd.gov.mch.repo.UserRepository;
import bd.gov.mch.repo.WorkerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the in-memory database on startup with the design-handoff sample data —
 * Char Bhola Union, Bhola Sadar Upazila — so the app is usable immediately.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final BeneficiaryRepository beneficiaries;
    private final WorkerRepository workers;
    private final UserRepository users;

    public DataSeeder(BeneficiaryRepository beneficiaries, WorkerRepository workers,
                      UserRepository users) {
        this.beneficiaries = beneficiaries;
        this.workers = workers;
        this.users = users;
    }

    @Override
    public void run(String... args) {
        if (beneficiaries.count() == 0) {
            seedBeneficiaries();
        }
        if (workers.count() == 0) {
            seedWorkers();
        }
        if (users.count() == 0) {
            seedUsers();
        }
    }

    /** Demo login accounts (plain-text passwords — demo build only). */
    private void seedUsers() {
        users.save(new User("rokeya.cb01", "Mch-2026", "field-officer",
                "Rokeya Sultana", "Char Bhola Union"));
        users.save(new User("s.rahman", "Admin-2026", "supervisor",
                "Dr. S. Rahman", "Bhola Sadar · 6 unions · 42 field officers"));
    }

    private void seedBeneficiaries() {
        beneficiaries.save(b("b1", "Rahima Begum", "রহিমা বেগম", BeneficiaryType.ANC, "Char Bhola",
                "ANC-2451", RiskLevel.HIGH, "Raised BP, age under 20", "Due today",
                19, null, 32, 3, "12 Aug 2026", null, null));
        beneficiaries.save(b("b3", "Morjina Begum", "মর্জিনা বেগম", BeneficiaryType.ANC, "Char Bhola",
                "ANC-2439", RiskLevel.MEDIUM, "Anaemia (Hb 9.2), age 34", "Due today",
                34, null, 28, 4, "02 Sep 2026", null, null));
        beneficiaries.save(b("b4", "Abdullah", "আব্দুল্লাহ", BeneficiaryType.CHILD, "Char Bhola",
                "CH-1182", RiskLevel.HIGH, "MUAC 11.2 cm — SAM", "Due today",
                null, 9, null, null, null, null, 11.2));
        beneficiaries.save(b("b2", "Shefali Khatun", "শেফালী খাতুন", BeneficiaryType.ANC, "Madhupur",
                "ANC-2447", RiskLevel.LOW, null, "10 Jul",
                26, null, 18, 2, "30 Oct 2026", null, null));
        beneficiaries.save(b("b5", "Nasima Akter", "নাসিমা আক্তার", BeneficiaryType.PNC, "Madhupur",
                "PNC-0912", RiskLevel.LOW, null, "12 Jul",
                22, null, null, null, null, 3, null));
        beneficiaries.save(b("b6", "Fatema", "ফাতেমা", BeneficiaryType.CHILD, "Uttar Para",
                "CH-1175", RiskLevel.LOW, null, "18 Jul",
                null, 14, null, null, null, null, null));
        beneficiaries.save(b("b7", "Tania Akter", "তানিয়া আক্তার", BeneficiaryType.ADOLESCENT, "Char Bhola",
                "ADO-0571", RiskLevel.MEDIUM, "Anaemia screening due", "Due today",
                14, null, null, null, null, null, null));
        beneficiaries.save(b("b8", "Abdul Karim", "আব্দুল করিম", BeneficiaryType.ELDERLY, "Madhupur",
                "ELD-0233", RiskLevel.HIGH, "Hypertension — uncontrolled BP", "Due today",
                68, null, null, null, null, null, null));
        beneficiaries.save(b("b9", "Jamal Hossain", "জামাল হোসেন", BeneficiaryType.DISABLED, "Uttar Para",
                "PWD-0118", RiskLevel.MEDIUM, "Mobility impairment — home visit", "15 Jul",
                31, null, null, null, null, null, null));
    }

    private void seedWorkers() {
        workers.save(w("w1", "Rokeya Sultana", WorkerRole.FWA, "Char Bhola", 142, 6, 118, 71, "2 days ago", OnlineStatus.OFFLINE));
        workers.save(w("w2", "Shahnaz Pervin", WorkerRole.FWA, "Madhupur", 128, 3, 104, 78, "09:05 today", OnlineStatus.ONLINE));
        workers.save(w("w3", "Anwara Khatun", WorkerRole.FWV, "Uttar Para", 96, 2, 71, 64, "08:40 today", OnlineStatus.ONLINE));
        workers.save(w("w4", "Hasna Hena", WorkerRole.CHCP, "Char Bhola", 110, 4, 92, 58, "1 day ago", OnlineStatus.OFFLINE));
        workers.save(w("w5", "Mukti Rani", WorkerRole.FWA, "Dakshin", 134, 5, 121, 83, "09:11 today", OnlineStatus.ONLINE));
    }

    private Beneficiary b(String id, String name, String bn, BeneficiaryType type, String village,
                          String code, RiskLevel risk, String reason, String next,
                          Integer age, Integer months, Integer weeks, Integer anc, String edd,
                          Integer day, Double muac) {
        Beneficiary x = new Beneficiary();
        x.setId(id);
        x.setName(name);
        x.setBn(bn);
        x.setType(type);
        x.setVillage(village);
        x.setCode(code);
        x.setRisk(risk);
        x.setReason(reason);
        x.setNext(next);
        x.setAge(age);
        x.setMonths(months);
        x.setWeeks(weeks);
        x.setAnc(anc);
        x.setEdd(edd);
        x.setDay(day);
        x.setMuac(muac);
        return x;
    }

    private Worker w(String id, String name, WorkerRole role, String union, int assigned,
                     int high, int visits, int cov, String lastSync, OnlineStatus status) {
        Worker x = new Worker();
        x.setId(id);
        x.setName(name);
        x.setRole(role);
        x.setUnion(union);
        x.setAssigned(assigned);
        x.setHigh(high);
        x.setVisits(visits);
        x.setCov(cov);
        x.setLastSync(lastSync);
        x.setStatus(status);
        return x;
    }
}
