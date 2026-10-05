package com.frauddetection.fraud_api.service;

import com.frauddetection.fraud_api.dto.RiskCheckRequest;
import com.frauddetection.fraud_api.dto.RiskCheckResponse;
import com.frauddetection.fraud_api.model.Recipient;
import com.frauddetection.fraud_api.repository.PaymentRepository;
import com.frauddetection.fraud_api.repository.RecipientRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RiskAssessmentService {
    private final RecipientRepository recipients;
    private final PaymentRepository payments;

    public RiskAssessmentService(RecipientRepository recipients, PaymentRepository payments) {
        this.recipients = recipients;
        this.payments = payments;
    }

    public RiskCheckResponse assess(RiskCheckRequest request) {
        String id = request.recipientId().trim().toUpperCase();
        Recipient recipient = recipients.findById(id).orElse(null);
        long count = payments.countByRecipientId(id);
        int reports = recipient == null ? 0 : recipient.getFraudReports();
        int score = 5;
        List<String> reasons = new ArrayList<>();

        if (recipient == null) {
            score += 35;
            reasons.add("Recipient is not in the verified recipient directory");
        } else {
            reasons.add("Recipient found in the verified directory");
        }
        if (count == 0) {
            score += 20;
            reasons.add("No previous transaction history");
        } else {
            reasons.add(count + " previous transaction" + (count == 1 ? "" : "s") + " found");
            if (count >= 5) score -= 10;
        }
        if (reports > 0) {
            score += Math.min(70, reports * 35);
            reasons.add(reports + " fraud report" + (reports == 1 ? "" : "s") + " on record");
        } else {
            reasons.add("No fraud reports on record");
        }
        if (request.amount() >= 100000) {
            score += 15;
            reasons.add("Large transfer amount");
        }
        score = Math.max(0, Math.min(score, 100));
        String level = reports > 0 || score >= 70 ? "FRAUDULENT" : score >= 40 ? "SUSPICIOUS" : "SAFE";
        String message = switch (level) {
            case "FRAUDULENT" -> "Do not send. This recipient has a high fraud risk.";
            case "SUSPICIOUS" -> "Review the recipient details carefully before sending.";
            default -> "Recipient history looks good. This transfer appears safe.";
        };
        return new RiskCheckResponse(id, recipient == null ? request.recipientName() : recipient.getName(),
                level, score, count, reports, message, reasons);
    }
}
