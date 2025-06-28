package com.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.dto.LoginDto;
import com.demo.entity.User;
import com.demo.service.UserService;

@RestController
@RequestMapping("/userss")
@CrossOrigin(origins="http://localhost:3000")

public class UserController {
	
	
	@Autowired
	UserService uservice;
	
	@PostMapping("/register")//http://localhost:8080/userss/register
	public String save(@RequestBody User u) {
		return uservice.save(u);
	}

	
	//define user valid or not 
	@PostMapping("/login")//http://localhost:8080/userss/login
	public ResponseEntity<?> login(@RequestBody LoginDto logindto) {
		User user = uservice.login(logindto.getUsername(),logindto.getPassword());
		
		if(user != null) {
			return ResponseEntity.ok(user);
		}else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
			

	}}


