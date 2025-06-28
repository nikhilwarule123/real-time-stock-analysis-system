package com.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.entity.Chatmessage;

public interface ChatmessageRepository extends JpaRepository<Chatmessage,Integer>{

	List<Chatmessage> findBySenderAndReceiverOrReceiverAndSender(String sender, String receiver, String sender2,
			String receiver2);

}
