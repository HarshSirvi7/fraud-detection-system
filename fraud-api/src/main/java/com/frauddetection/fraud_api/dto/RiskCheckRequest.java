package com.frauddetection.fraud_api.dto;

public record RiskCheckRequest(String recipientId, String recipientName, double amount) {}
