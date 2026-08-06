package bd.gov.mch.domain;

/** Antenatal visit vitals + danger signs that drive automatic risk classification. */
public class AncVisit {
    private int sbp;
    private int dbp;
    private double weight;
    private double hb;
    private double fundal;
    private int fhr;
    private String note;
    private DangerSigns danger = new DangerSigns();

    public int getSbp() {
        return sbp;
    }

    public void setSbp(int sbp) {
        this.sbp = sbp;
    }

    public int getDbp() {
        return dbp;
    }

    public void setDbp(int dbp) {
        this.dbp = dbp;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getHb() {
        return hb;
    }

    public void setHb(double hb) {
        this.hb = hb;
    }

    public double getFundal() {
        return fundal;
    }

    public void setFundal(double fundal) {
        this.fundal = fundal;
    }

    public int getFhr() {
        return fhr;
    }

    public void setFhr(int fhr) {
        this.fhr = fhr;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public DangerSigns getDanger() {
        return danger;
    }

    public void setDanger(DangerSigns danger) {
        this.danger = danger;
    }
}
