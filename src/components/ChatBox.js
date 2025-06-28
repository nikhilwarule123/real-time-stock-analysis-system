import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const ChatBox = ({ username, receiver }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');

                // ✅ Subscribe to the topic for the current user
                stompClient.current.subscribe(`/topic/messages/${username}`, (message) => {
                    const body = JSON.parse(message.body);
                    console.log("Received WebSocket message:", body); // ✅ Add this line


                    // ✅ Add only messages relevant to this conversation
                    if (
                        (body.sender === username && body.receiver === receiver) ||
                        (body.sender === receiver && body.receiver === username)
                    ) {
                        setMessages(prev => [...prev, body]);
                    }
                });
            },
        });

        stompClient.current.activate();

        return () => {
            if (stompClient.current) stompClient.current.deactivate();
        };
    }, [username, receiver]);

    const sendMessage = async () => {
        const chatMsg = {
            sender: username,
            receiver: receiver,
            content: input,
            timestamp: new Date().toISOString() // ✅ timestamp 
        };
        try {
            await axios.post('http://localhost:8080/chat/send', chatMsg);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Message failed. Backend may be down.');
        }
    };


    return (
        <div style={{ border: '2px solid #ccc', padding: '10px', width: '400px' }}>
            <h3>Chat between {username} and {receiver}</h3>
            <div style={{ border: '1px solid #ddd', height: '300px', overflowY: 'scroll', padding: '5px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        textAlign: msg.sender === username ? 'right' : 'left',
                        margin: '5px 0'
                    }}>
                        <div><strong>{msg.sender}</strong></div>
                        <div>Content: {msg.content ? msg.content : '⚠️ No Content'}</div>
                        <div>Receiver: {msg.receiver}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    style={{ width: '70%', padding: '5px' }}
                />
                <button onClick={sendMessage} style={{ marginLeft: '5px' }}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
