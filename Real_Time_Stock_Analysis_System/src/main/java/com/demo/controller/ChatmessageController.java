package com.demo.controller;

import com.demo.entity.Chatmessage;
import com.demo.service.ChatmessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins="http://localhost:3000")
public class ChatmessageController {

    @Autowired
    private ChatmessageService chatmessageService;
    
    // ✅ Add this to fix the error
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // Save a new message
    @PostMapping("/send")
    public Chatmessage sendMessage(@RequestBody Chatmessage message) {
        Chatmessage saved = chatmessageService.saveMessage(message);

        // Send to receiver
        messagingTemplate.convertAndSend("/topic/messages/" + message.getReceiver(), message);

        // Also send to sender (so that sender sees it live without manual state update)
        messagingTemplate.convertAndSend("/topic/messages/" + message.getSender(), message);

        return saved;
    }

    // Get chat between two users
    @GetMapping("/messages")
    public List<Chatmessage> getChat(@RequestParam String sender, @RequestParam String receiver) {
        return chatmessageService.getChatBetweenUsers(sender, receiver);
    }
}
