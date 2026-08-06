package bd.gov.mch.web;

import bd.gov.mch.domain.AncVisit;
import bd.gov.mch.domain.Beneficiary;
import bd.gov.mch.domain.ChildAssessment;
import bd.gov.mch.domain.RiskLevel;
import bd.gov.mch.repo.BeneficiaryRepository;
import bd.gov.mch.service.NutritionService;
import bd.gov.mch.service.RiskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Records clinical visits. The risk/nutrition classification runs server-side so
 * the app and server always agree on a case's status. Two "preview" endpoints let
 * the app re-classify live (as the worker edits vitals) without persisting.
 */
@RestController
@RequestMapping("/api")
public class VisitController {

    private final BeneficiaryRepository repo;
    private final RiskService riskService;
    private final NutritionService nutritionService;

    public VisitController(BeneficiaryRepository repo, RiskService riskService,
                           NutritionService nutritionService) {
        this.repo = repo;
        this.riskService = riskService;
        this.nutritionService = nutritionService;
    }

    /** Live ANC risk classification — does not persist. */
    @PostMapping("/risk/anc")
    public RiskService.ComputedRisk previewAncRisk(@RequestBody AncVisit visit) {
        return riskService.computeAncRisk(visit);
    }

    /** Live MUAC nutrition classification — does not persist. */
    @PostMapping("/nutrition/muac")
    public NutritionService.NutritionStatus previewMuac(@RequestBody ChildAssessment assessment) {
        return nutritionService.classifyMuac(assessment.getMuac(), assessment.isEdema());
    }

    /** Record an ANC visit: classify, update the beneficiary's risk + next visit. */
    @PostMapping("/beneficiaries/{id}/anc-visit")
    public Beneficiary recordAncVisit(@PathVariable String id, @RequestBody AncVisit visit) {
        Beneficiary b = require(id);
        RiskService.ComputedRisk risk = riskService.computeAncRisk(visit);
        b.setRisk(risk.level());
        b.setReason(risk.reasons().isEmpty() ? null : risk.reasons().get(0));
        b.setNext("13 Jul 2026");
        if (b.getAnc() != null) {
            b.setAnc(b.getAnc() + 1);
        }
        return repo.save(b);
    }

    /** Record a child growth/nutrition assessment and update the beneficiary. */
    @PostMapping("/beneficiaries/{id}/child-assessment")
    public Beneficiary recordChildAssessment(@PathVariable String id, @RequestBody ChildAssessment a) {
        Beneficiary b = require(id);
        NutritionService.NutritionStatus status = nutritionService.classifyMuac(a.getMuac(), a.isEdema());
        b.setRisk(switch (status.shortLabel()) {
            case "SAM" -> RiskLevel.HIGH;
            case "MAM" -> RiskLevel.MEDIUM;
            default -> RiskLevel.LOW;
        });
        b.setReason("MUAC " + a.getMuac() + " cm — " + status.shortLabel());
        b.setMuac(a.getMuac());
        return repo.save(b);
    }

    private Beneficiary require(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No beneficiary " + id));
    }
}
