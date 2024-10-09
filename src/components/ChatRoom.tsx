import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chat Room</h2>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-2 ${
                    msg.username === user?.username
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="text-xs opacity-70">{msg.username}</p>
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70">{new Date(msg.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatRoom;