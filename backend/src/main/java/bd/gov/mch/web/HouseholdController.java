package bd.gov.mch.web;

import bd.gov.mch.domain.Household;
import bd.gov.mch.repo.HouseholdRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** CRUD-lite access to household geographic-location baseline records. */
@RestController
@RequestMapping("/api/households")
public class HouseholdController {

    private final HouseholdRepository repo;

    public HouseholdController(HouseholdRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Household> list() {
        return repo.findAll();
    }

    @GetMapping("/{householdCode}")
    public Household get(@PathVariable String householdCode) {
        return repo.findById(householdCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No household " + householdCode));
    }

    /** Register (or upsert) a household's baseline geographic-location record. */
    @PostMapping
    public ResponseEntity<Household> register(@RequestBody Household household) {
        Household saved = repo.save(household);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
