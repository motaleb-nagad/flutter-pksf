package bd.gov.mch.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A login account for the app: either a field officer or a supervisor.
 * Passwords are stored in plain text for this demo build ONLY — hash them
 * (BCrypt via Spring Security) before any real deployment.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    private String username;

    @Column(nullable = false)
    private String password;

    /** "field-officer" or "supervisor". */
    @Column(name = "user_role", nullable = false)
    private String role;

    private String name;

    /** Display scope: union for field officers, upazila summary for supervisors. */
    private String scope;

    public User() {
    }

    public User(String username, String password, String role, String name, String scope) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.name = name;
        this.scope = scope;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }
}
