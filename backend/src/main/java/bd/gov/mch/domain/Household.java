package bd.gov.mch.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

/**
 * "খানার ভৌগোলিক অবস্থান" — household geographic location baseline data,
 * collected once per household at programme start. {@link #householdCode} is
 * the household's unique, searchable identifier that every later section
 * (members, ANC, PNC, child visits) looks the household up by.
 */
@Entity
@Table(name = "households")
public class Household {

    @Id
    @Column(name = "household_code")
    private String householdCode;

    private LocalDate dataCollectionDate;
    private String collectorNameDesignation;

    private String partnerOrgName;

    private String branchName;
    private String branchCode;
    private String district;
    private String upazila;
    private String unionOrMunicipality;

    private String samityNumber;
    private String borrowerMemberNumber;

    private Double gpsLatitude;
    private Double gpsLongitude;

    public Household() {
    }

    public String getHouseholdCode() {
        return householdCode;
    }

    public void setHouseholdCode(String householdCode) {
        this.householdCode = householdCode;
    }

    public LocalDate getDataCollectionDate() {
        return dataCollectionDate;
    }

    public void setDataCollectionDate(LocalDate dataCollectionDate) {
        this.dataCollectionDate = dataCollectionDate;
    }

    public String getCollectorNameDesignation() {
        return collectorNameDesignation;
    }

    public void setCollectorNameDesignation(String collectorNameDesignation) {
        this.collectorNameDesignation = collectorNameDesignation;
    }

    public String getPartnerOrgName() {
        return partnerOrgName;
    }

    public void setPartnerOrgName(String partnerOrgName) {
        this.partnerOrgName = partnerOrgName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getUpazila() {
        return upazila;
    }

    public void setUpazila(String upazila) {
        this.upazila = upazila;
    }

    public String getUnionOrMunicipality() {
        return unionOrMunicipality;
    }

    public void setUnionOrMunicipality(String unionOrMunicipality) {
        this.unionOrMunicipality = unionOrMunicipality;
    }

    public String getSamityNumber() {
        return samityNumber;
    }

    public void setSamityNumber(String samityNumber) {
        this.samityNumber = samityNumber;
    }

    public String getBorrowerMemberNumber() {
        return borrowerMemberNumber;
    }

    public void setBorrowerMemberNumber(String borrowerMemberNumber) {
        this.borrowerMemberNumber = borrowerMemberNumber;
    }

    public Double getGpsLatitude() {
        return gpsLatitude;
    }

    public void setGpsLatitude(Double gpsLatitude) {
        this.gpsLatitude = gpsLatitude;
    }

    public Double getGpsLongitude() {
        return gpsLongitude;
    }

    public void setGpsLongitude(Double gpsLongitude) {
        this.gpsLongitude = gpsLongitude;
    }
}
