package bd.gov.mch.web;

import bd.gov.mch.domain.User;
import bd.gov.mch.repo.UserRepository;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Database-backed login: looks the username up in the {@code users} table and
 * checks the password. Wrong credentials → 401. The response tells the client
 * which surface to show (field app vs supervisor portal).
 *
 * <p>Demo-grade: passwords are plain text and no token is issued. Before a real
 * deployment, hash passwords (BCrypt) and return a role-scoped JWT here.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;

    public AuthController(UserRepository users) {
        this.users = users;
    }

    public record LoginRequest(String username, String password) {
    }

    public record Profile(String name, String role, String scope, String username) {
    }

    public record LoginResponse(String role, Profile profile) {
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = request.username() == null ? "" : request.username().trim();
        String password = request.password() == null ? "" : request.password();

        Optional<User> found = users.findByUsername(username);   // ← the DB read
        if (found.isEmpty() || !found.get().getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        User u = found.get();
        return ResponseEntity.ok(new LoginResponse(u.getRole(), new Profile(
                u.getName(),
                "supervisor".equals(u.getRole()) ? "Supervisor" : "FWA",
                u.getScope(),
                u.getUsername())));
    }

    @PostMapping("/whoami")
    public Map<String, String> whoami() {
        return Map.of("status", "ok");
    }
}
