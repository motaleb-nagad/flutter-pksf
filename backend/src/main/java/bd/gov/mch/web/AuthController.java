package bd.gov.mch.web;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Mocked authentication matching the design reference: any password logs in. The
 * supplied username decides which surface (field app vs supervisor portal) the
 * client should show. A real deployment would issue role-scoped tokens here.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(String username, String password) {
    }

    public record Profile(String name, String role, String scope, String username) {
    }

    public record LoginResponse(String role, Profile profile) {
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String username = request.username() == null ? "" : request.username().trim();

        if ("s.rahman".equalsIgnoreCase(username)) {
            return ResponseEntity.ok(new LoginResponse("supervisor", new Profile(
                    "Dr. S. Rahman", "Supervisor",
                    "Bhola Sadar · 6 unions · 42 field officers", "s.rahman")));
        }

        // Default everyone else to the field-officer app (offline surveillance).
        return ResponseEntity.ok(new LoginResponse("field-officer", new Profile(
                "Rokeya Sultana", "FWA", "Char Bhola Union",
                username.isEmpty() ? "rokeya.cb01" : username)));
    }

    @PostMapping("/whoami")
    public Map<String, String> whoami() {
        return Map.of("status", "ok");
    }
}
