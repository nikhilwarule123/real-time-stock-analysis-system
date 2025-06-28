package com.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.User;
import com.demo.repository.UserRepository;

@Service
public class UserService {
@Autowired
UserRepository prsp;


	public String save(User u) {
		User existingUser = prsp.findByUsername(u.getUsername()).orElse(null);

		if (existingUser != null) {
			return "User name is already exists.please try another one";
		}

		else {
			prsp.save(u);
			return "User register sucessfully";
		}
	}

	// user update sucess or not
	public User login(String username, String password) {
		User user = prsp.findByUsername(username).orElse(null);

		if (user != null) {
			if (user.getPassword().equals(password)) {
				return user;
			}
		}
		return null;

	}
	
}

