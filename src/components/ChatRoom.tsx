import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FiPaperclip, FiSend, FiLogOut } from 'react-icons/fi';

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
  };

  return (
    <Card className="w-full h-[600px] flex flex-col bg-gray-100">
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat Room</h2>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <FiPaperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <FiLogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
              {msg.username !== user?.username && (
                <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${msg.username}`} alt={msg.username} className="w-8 h-8 rounded-full mr-2" />
              )}
              <div
                className={`rounded-2xl p-3 ${
                  msg.username === user?.username
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-white text-black rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 rounded-full bg-gray-100 border-0"
          />
          <Button type="submit" size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
            <FiSend className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatRoom;