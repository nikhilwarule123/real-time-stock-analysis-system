package com.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	

    @Autowired
    private JavaMailSender mailSender;
    
    //email send user name use

    public void sendOtpEmail(String toEmail, String otp, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Email Verification - Real-Time Stock Analysis System");

        String body = "Dear " + username + ",\n\n"
                + "Thank you for registering with Real-Time Stock Analysis System!\n\n"
                + "Your One-Time Password (OTP) for verifying your email address is:\n\n"
                + "🔐 OTP: " + otp + "\n\n"
                + "This OTP is valid for only 5 minutes. Please enter this code in the verification screen to complete your registration.\n\n"
                + "If you did not initiate this request, you can safely ignore this email.\n\n"
                + "Regards,\n"
                + "Team Real-Time Stock Analysis System";

        message.setText(body);
        mailSender.send(message);
    }

}
