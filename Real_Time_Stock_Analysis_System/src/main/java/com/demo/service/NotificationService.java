package com.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.demo.entity.Notification;
import com.demo.repository.NotificationRepository;

@Service
public class NotificationService {
	@Autowired 
	NotificationRepository nprs;
	
	public String save(Notification n) {
    nprs.save(n);
     return "Data Save Sucessfully";
	}
	
	public List finall() {
		return nprs.findAll();
			
	}

}
