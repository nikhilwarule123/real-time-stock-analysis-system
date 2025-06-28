package com.demo.controller;

import com.demo.dto.EmailDTO;
import com.demo.dto.OtpDTO;
import com.demo.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    @Autowired
    private OtpService otpService;

    // Step 1: Generate OTP//
    @PostMapping("/generate")//http://localhost:8080/api/otp/generate
    public String generateOtp(@RequestBody EmailDTO emailDto) {
        return otpService.generateAndSendOtp(emailDto.getEmail(), emailDto.getUsername());
    }

    // Step 2: Verify OTP
    @PostMapping("/verify")//http://localhost:8080/api/otp/verify
    public String verifyOtp(@RequestBody OtpDTO otpDto) {
        boolean isVerified = otpService.verifyOtp(otpDto.getEmail(), otpDto.getOtp());
        return isVerified ? "OTP verified successfully." : "Invalid or expired OTP.";
    }

}

//{
//	  "email": "test@example.com"
//	}


//{
//	  "email": "test@example.com",
//	  "otp": "12345" //user mail check otp valid 5 min 
//	}

