package com.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="notifications")
public class Notification {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long id;

    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
	public Notification() {
		super();
	}
	public Notification(Long id, String message, LocalDateTime timestamp) {
		super();
		this.id = id;
		this.message = message;
		this.timestamp = timestamp;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
		
}
