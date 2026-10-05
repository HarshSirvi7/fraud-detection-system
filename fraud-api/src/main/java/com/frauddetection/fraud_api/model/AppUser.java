package com.frauddetection.fraud_api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_users")
public class AppUser {
    @Id private String email;
    private String name;
    private String passwordHash;
    protected AppUser() {}
    public AppUser(String email, String name, String passwordHash) { this.email = email; this.name = name; this.passwordHash = passwordHash; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getPasswordHash() { return passwordHash; }
}
