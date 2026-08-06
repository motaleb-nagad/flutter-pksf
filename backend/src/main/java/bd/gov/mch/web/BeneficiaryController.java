package bd.gov.mch.web;

import bd.gov.mch.domain.Beneficiary;
import bd.gov.mch.repo.BeneficiaryRepository;
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

/** CRUD-lite access to the beneficiary register. */
@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryRepository repo;

    public BeneficiaryController(BeneficiaryRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Beneficiary> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Beneficiary get(@PathVariable String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No beneficiary " + id));
    }

    /** Register (or upsert) a beneficiary coming off a field device. */
    @PostMapping
    public ResponseEntity<Beneficiary> register(@RequestBody Beneficiary beneficiary) {
        Beneficiary saved = repo.save(beneficiary);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
