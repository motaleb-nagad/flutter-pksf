package bd.gov.mch.domain;

/** Antenatal danger signs captured during a visit (any present → high risk). */
public class DangerSigns {
    private boolean headache;
    private boolean blurred;
    private boolean swelling;
    private boolean bleeding;
    private boolean convulsions;
    private boolean fever;
    private boolean fetal;      // reduced fetal movement
    private boolean abdo;       // abdominal pain
    private boolean breathing;

    public boolean isHeadache() {
        return headache;
    }

    public void setHeadache(boolean headache) {
        this.headache = headache;
    }

    public boolean isBlurred() {
        return blurred;
    }

    public void setBlurred(boolean blurred) {
        this.blurred = blurred;
    }

    public boolean isSwelling() {
        return swelling;
    }

    public void setSwelling(boolean swelling) {
        this.swelling = swelling;
    }

    public boolean isBleeding() {
        return bleeding;
    }

    public void setBleeding(boolean bleeding) {
        this.bleeding = bleeding;
    }

    public boolean isConvulsions() {
        return convulsions;
    }

    public void setConvulsions(boolean convulsions) {
        this.convulsions = convulsions;
    }

    public boolean isFever() {
        return fever;
    }

    public void setFever(boolean fever) {
        this.fever = fever;
    }

    public boolean isFetal() {
        return fetal;
    }

    public void setFetal(boolean fetal) {
        this.fetal = fetal;
    }

    public boolean isAbdo() {
        return abdo;
    }

    public void setAbdo(boolean abdo) {
        this.abdo = abdo;
    }

    public boolean isBreathing() {
        return breathing;
    }

    public void setBreathing(boolean breathing) {
        this.breathing = breathing;
    }
}
