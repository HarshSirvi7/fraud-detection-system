package com.frauddetection.fraud_api.dto;

import java.util.List;

public record RiskCheckResponse(String recipientId, String recipientName, String riskLevel,
                                int riskScore, long transactionCount, int fraudReports,
                                String message, List<String> reasons) {}
