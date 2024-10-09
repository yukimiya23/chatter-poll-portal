import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Button, Form, ListGroup } from 'react-bootstrap';

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      sendMessage(message, user.username);
      setMessage('');
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Chat Room</h2>
      <div className="chat-messages mb-3" style={{ height: '400px', overflowY: 'auto' }}>
        <ListGroup>
          {messages.map((msg, index) => (
            <ListGroup.Item key={index} className={msg.username === user?.username ? 'text-end' : ''}>
              <strong>{msg.username}: </strong>{msg.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div ref={messagesEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
};

export default ChatRoom;