package com.demo.service;

import com.demo.entity.Otp;
import com.demo.repository.OtpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    // Generate OTP and send to email
    public String generateAndSendOtp(String email, String username) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

        Optional<Otp> existingOtp = otpRepository.findByEmail(email);
        Otp otpEntity = existingOtp.orElse(new Otp());
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(expiryTime);
        otpRepository.save(otpEntity);

        try {
            emailService.sendOtpEmail(email, otp, username);
            return "OTP sent to email successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send OTP: " + e.getMessage();
        }
    }

    // Verify OTP
    public boolean verifyOtp(String email, String otpInput) {
        Optional<Otp> otpOptional = otpRepository.findByEmail(email);

        if (otpOptional.isPresent()) {
            Otp otp = otpOptional.get();
            if (otp.getOtp().equals(otpInput) && otp.getExpiryTime().isAfter(LocalDateTime.now())) {
                otpRepository.delete(otp);
                return true;
            }
        }
        return false;
    }
}
