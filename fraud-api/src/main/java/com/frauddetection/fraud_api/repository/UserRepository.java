package com.frauddetection.fraud_api.repository;

import com.frauddetection.fraud_api.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, String> {}
