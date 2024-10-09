import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
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
                  {msg.text}
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