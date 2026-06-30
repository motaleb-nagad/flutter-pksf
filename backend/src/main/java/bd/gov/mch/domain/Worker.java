package bd.gov.mch.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** A field officer (community health worker) tracked by the supervisor portal. */
@Entity
@Table(name = "workers")
public class Worker {

    @Id
    private String id;

    private String name;

    @Enumerated(EnumType.STRING)
    private WorkerRole role;

    @Column(name = "union_name")
    private String union;

    private int assigned;
    private int high;
    private int visits;

    /** ANC4+ coverage %. */
    private int cov;

    private String lastSync;

    @Enumerated(EnumType.STRING)
    private OnlineStatus status;

    public Worker() {
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

    public WorkerRole getRole() {
        return role;
    }

    public void setRole(WorkerRole role) {
        this.role = role;
    }

    public String getUnion() {
        return union;
    }

    public void setUnion(String union) {
        this.union = union;
    }

    public int getAssigned() {
        return assigned;
    }

    public void setAssigned(int assigned) {
        this.assigned = assigned;
    }

    public int getHigh() {
        return high;
    }

    public void setHigh(int high) {
        this.high = high;
    }

    public int getVisits() {
        return visits;
    }

    public void setVisits(int visits) {
        this.visits = visits;
    }

    public int getCov() {
        return cov;
    }

    public void setCov(int cov) {
        this.cov = cov;
    }

    public String getLastSync() {
        return lastSync;
    }

    public void setLastSync(String lastSync) {
        this.lastSync = lastSync;
    }

    public OnlineStatus getStatus() {
        return status;
    }

    public void setStatus(OnlineStatus status) {
        this.status = status;
    }
}
