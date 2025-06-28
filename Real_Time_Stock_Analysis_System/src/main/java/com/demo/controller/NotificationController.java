package com.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.entity.Notification;
import com.demo.repository.NotificationRepository;
import com.demo.service.NotificationService;

@RestController
@RequestMapping("/notification")
@CrossOrigin(origins="http://localhost:3000")

public class NotificationController {
	@Autowired
	NotificationService srps;
	  @Autowired
	    private NotificationRepository notificationRepository;

	    @Autowired
	    private SimpMessagingTemplate messagingTemplate;

	    @PostMapping("/save")
	    public ResponseEntity<?> saveNotification(@RequestBody Notification notification) {
	       
	        Notification saved = notificationRepository.save(notification);

	        // User wesocket message
	        messagingTemplate.convertAndSend("/topic/notifications", saved);

	        return ResponseEntity.ok("Notification Sent Successfully");
	    }
	    
	    @GetMapping("/findall")
	    public List<Notification> getAllNotifications() {
	        return notificationRepository.findAll();
	    }

}
