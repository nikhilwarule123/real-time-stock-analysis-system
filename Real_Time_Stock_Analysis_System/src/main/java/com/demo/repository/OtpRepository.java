package com.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.entity.Otp;

@Repository

public interface OtpRepository extends JpaRepository<Otp, Integer> {
    Optional<Otp> findByEmail(String email);
    void deleteByEmail(String email);
}
