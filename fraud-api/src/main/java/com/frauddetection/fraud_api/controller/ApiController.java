package com.frauddetection.fraud_api.controller;

import com.frauddetection.fraud_api.dto.RiskCheckRequest;
import com.frauddetection.fraud_api.dto.RiskCheckResponse;
import com.frauddetection.fraud_api.dto.RecipientRequest;
import com.frauddetection.fraud_api.model.Payment;
import com.frauddetection.fraud_api.model.Recipient;
import com.frauddetection.fraud_api.repository.PaymentRepository;
import com.frauddetection.fraud_api.repository.RecipientRepository;
import com.frauddetection.fraud_api.service.RiskAssessmentService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${app.frontend-origin:http://localhost:5173}")
public class ApiController {
    private final RiskAssessmentService riskService;
    private final RecipientRepository recipients;
    private final PaymentRepository payments;
    private final com.frauddetection.fraud_api.service.AuthService authService;

    public ApiController(RiskAssessmentService riskService, RecipientRepository recipients, PaymentRepository payments, com.frauddetection.fraud_api.service.AuthService authService) {
        this.riskService = riskService;
        this.recipients = recipients;
        this.payments = payments;
        this.authService = authService;
    }

    @PostMapping("/auth/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public Object signup(@RequestBody com.frauddetection.fraud_api.dto.AuthRequest request) { return authService.signup(request); }

    @PostMapping("/auth/login")
    public Object login(@RequestBody com.frauddetection.fraud_api.dto.AuthRequest request) { return authService.login(request); }

    @GetMapping("/recipients")
    public Object recipients() { return recipients.findAll().stream().map(r -> Map.of(
            "recipientId", r.getAccountId(), "name", r.getName(), "fraudReports", r.getFraudReports(),
            "transactionCount", payments.countByRecipientId(r.getAccountId()))).toList(); }

    @PostMapping("/recipients")
    @ResponseStatus(HttpStatus.CREATED)
    public Recipient addRecipient(@RequestBody RecipientRequest request) {
        if (request.recipientId() == null || request.recipientId().isBlank()
                || request.name() == null || request.name().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Recipient account ID and name are required.");
        }
        String id = request.recipientId().trim().toUpperCase();
        if (recipients.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That recipient account already exists.");
        }
        return recipients.save(new Recipient(id, request.name().trim(), 0));
    }

    @PostMapping("/recipients/{id}/fraud-reports")
    public Recipient reportFraud(@PathVariable String id) {
        Recipient recipient = recipients.findById(id.trim().toUpperCase()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found."));
        recipient.setFraudReports(recipient.getFraudReports() + 1);
        return recipients.save(recipient);
    }

    @PostMapping("/risk/check")
    public RiskCheckResponse check(@RequestBody RiskCheckRequest request) {
        if (request.recipientId() == null || request.recipientId().isBlank()
                || request.amount() <= 0 || !Double.isFinite(request.amount())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a recipient account and a valid amount.");
        }
        return riskService.assess(request);
    }

    @PostMapping("/transfers")
    public Payment transfer(@RequestBody RiskCheckRequest request) {
        RiskCheckResponse risk = check(request);
        if ("FRAUDULENT".equals(risk.riskLevel())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Transfer blocked: recipient is marked as fraudulent.");
        }
        return payments.save(new Payment(risk.recipientId(), risk.recipientName(), request.amount(), risk.riskLevel()));
    }

    @GetMapping("/transactions")
    public Object transactions() { return payments.findAllByOrderByCreatedAtDesc(); }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        long recipientCount = recipients.count();
        long reportedRecipients = recipients.findAll().stream().filter(r -> r.getFraudReports() > 0).count();
        long fraudReports = recipients.findAll().stream().mapToLong(Recipient::getFraudReports).sum();
        return Map.of("totalTransfers", payments.count(), "safeTransfers", payments.countByRiskLevel("SAFE"),
                "suspiciousTransfers", payments.countByRiskLevel("SUSPICIOUS"),
                "blockedTransfers", payments.countByRiskLevel("FRAUDULENT"),
                "recipientCount", recipientCount, "reportedRecipients", reportedRecipients,
                "fraudReports", fraudReports);
    }
}
