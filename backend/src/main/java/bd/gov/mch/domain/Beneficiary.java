package bd.gov.mch.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A person enrolled in the MCH surveillance programme. Mirrors the {@code Beneficiary}
 * model in the field app — a single flat record carrying just enough demographic and
 * clinical state to drive the case lists, profiles and dashboard.
 */
@Entity
@Table(name = "beneficiaries")
public class Beneficiary {

    @Id
    private String id;

    private String name;

    /** Bangla name. */
    @Column(name = "bn")
    private String bn;

    @Enumerated(EnumType.STRING)
    private BeneficiaryType type;

    private String village;

    /** Human ID, e.g. ANC-2451. */
    private String code;

    @Enumerated(EnumType.STRING)
    private RiskLevel risk;

    @Column(length = 512)
    private String reason;

    /** Next-visit label, e.g. "Due today" / "10 Jul". */
    @Column(name = "next_visit")
    private String next;

    private Integer age;
    private Integer months;   // for children
    private Integer weeks;    // ANC gestational weeks
    private Integer anc;      // ANC contact count
    private String edd;       // expected date of delivery
    @Column(name = "pnc_day")
    private Integer day;      // PNC day
    private Double muac;      // child MUAC (cm)

    public Beneficiary() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBn() {
        return bn;
    }

    public void setBn(String bn) {
        this.bn = bn;
    }

    public BeneficiaryType getType() {
        return type;
    }

    public void setType(BeneficiaryType type) {
        this.type = type;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public RiskLevel getRisk() {
        return risk;
    }

    public void setRisk(RiskLevel risk) {
        this.risk = risk;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getMonths() {
        return months;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }

    public Integer getWeeks() {
        return weeks;
    }

    public void setWeeks(Integer weeks) {
        this.weeks = weeks;
    }

    public Integer getAnc() {
        return anc;
    }

    public void setAnc(Integer anc) {
        this.anc = anc;
    }

    public String getEdd() {
        return edd;
    }

    public void setEdd(String edd) {
        this.edd = edd;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Double getMuac() {
        return muac;
    }

    public void setMuac(Double muac) {
        this.muac = muac;
    }
}
