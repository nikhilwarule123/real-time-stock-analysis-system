package com.demo.service;

import com.demo.entity.Chatmessage;
import com.demo.repository.ChatmessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatmessageService {

    @Autowired
    private ChatmessageRepository chatmessageRepository;

    // 1. Save message
    public Chatmessage saveMessage(Chatmessage message) {
        return chatmessageRepository.save(message);
    }

    // 2. Get messages between two users
    public List<Chatmessage> getChatBetweenUsers(String sender, String receiver) {
        return chatmessageRepository.findBySenderAndReceiverOrReceiverAndSender(
                sender, receiver, sender, receiver
        );
    }

    // 3. Get all messages (admin use-case)
    public List<Chatmessage> getAllMessages() {
        return chatmessageRepository.findAll();
    }
}
