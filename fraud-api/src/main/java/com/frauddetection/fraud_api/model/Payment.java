package com.frauddetection.fraud_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String recipientId;
    private String recipientName;
    private double amount;
    private String riskLevel;
    private Instant createdAt;

    protected Payment() {}
    public Payment(String recipientId, String recipientName, double amount, String riskLevel) {
        this.recipientId = recipientId;
        this.recipientName = recipientName;
        this.amount = amount;
        this.riskLevel = riskLevel;
        this.createdAt = Instant.now();
    }
    public Long getId() { return id; }
    public String getRecipientId() { return recipientId; }
    public String getRecipientName() { return recipientName; }
    public double getAmount() { return amount; }
    public String getRiskLevel() { return riskLevel; }
    public Instant getCreatedAt() { return createdAt; }
}
