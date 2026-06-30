package bd.gov.mch.web;

import bd.gov.mch.domain.OnlineStatus;
import bd.gov.mch.domain.Worker;
import bd.gov.mch.domain.WorkerRole;
import bd.gov.mch.repo.WorkerRepository;
import bd.gov.mch.service.FormatService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Field-officer roster + onboarding (used by the supervisor portal). */
@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerRepository repo;
    private final FormatService format;

    public WorkerController(WorkerRepository repo, FormatService format) {
        this.repo = repo;
        this.format = format;
    }

    public record OnboardRequest(String name, Integer age, String phone, String nid,
                                 String union, WorkerRole role) {
    }

    public record OnboardResponse(Worker worker, String username, String password) {
    }

    @GetMapping
    public List<Worker> list() {
        return repo.findAll();
    }

    /**
     * Onboard a new field officer: create the account and generate the login
     * credentials the worker enters in the mobile app on first sign-in.
     */
    @PostMapping
    public OnboardResponse onboard(@RequestBody OnboardRequest request) {
        int n = (int) repo.count() + 1;
        String username = format.genUsername(request.name(), request.union(), n);
        String password = format.genPassword();

        Worker w = new Worker();
        w.setId("w" + System.currentTimeMillis());
        w.setName(request.name().trim());
        w.setRole(request.role() == null ? WorkerRole.FWA : request.role());
        w.setUnion(request.union());
        w.setAssigned(0);
        w.setHigh(0);
        w.setVisits(0);
        w.setCov(0);
        w.setLastSync("Never");
        w.setStatus(OnlineStatus.OFFLINE);

        return new OnboardResponse(repo.save(w), username, password);
    }
}
