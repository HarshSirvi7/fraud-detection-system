package com.frauddetection.fraud_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "recipients")
public class Recipient {
    @Id
    private String accountId;
    private String name;
    private int fraudReports;

    protected Recipient() {}
    public Recipient(String accountId, String name, int fraudReports) {
        this.accountId = accountId;
        this.name = name;
        this.fraudReports = fraudReports;
    }
    public String getAccountId() { return accountId; }
    public String getName() { return name; }
    public int getFraudReports() { return fraudReports; }
    public void setName(String name) { this.name = name; }
    public void setFraudReports(int fraudReports) { this.fraudReports = fraudReports; }
}
