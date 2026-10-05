package com.frauddetection.fraud_api.repository;

import com.frauddetection.fraud_api.model.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipientRepository extends JpaRepository<Recipient, String> {}
