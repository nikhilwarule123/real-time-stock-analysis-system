package com.demo.dto;

public class LoginDto {
	String username;
	String password;
	public LoginDto() {
		super();
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public LoginDto(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}

}
