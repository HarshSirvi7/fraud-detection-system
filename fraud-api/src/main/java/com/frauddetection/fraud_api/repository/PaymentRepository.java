package com.frauddetection.fraud_api.repository;

import com.frauddetection.fraud_api.model.Payment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    long countByRecipientId(String recipientId);
    List<Payment> findAllByOrderByCreatedAtDesc();
    long countByRiskLevel(String riskLevel);
}
