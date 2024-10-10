import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Avatar from './Avatar';

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
    <Card className="w-full h-[600px] flex flex-col">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'} items-end`}>
              <Avatar username={msg.username} />
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.username === user?.username
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-black rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <div className="p-4 bg-white border-t">
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
    </Card>
  );
};

export default ChatRoom;