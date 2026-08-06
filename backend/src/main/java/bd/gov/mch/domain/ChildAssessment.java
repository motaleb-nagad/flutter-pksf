package bd.gov.mch.domain;

/** Child anthropometry used for nutrition (MUAC) classification. */
public class ChildAssessment {
    private double muac;
    private double weight;
    private double length;
    private boolean edema;

    public double getMuac() {
        return muac;
    }

    public void setMuac(double muac) {
        this.muac = muac;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public boolean isEdema() {
        return edema;
    }

    public void setEdema(boolean edema) {
        this.edema = edema;
    }
}
