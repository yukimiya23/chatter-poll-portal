import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { FiSend } from 'react-icons/fi';
import NavBar from './NavBar';
import PollSystem from './PollSystem';

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPollVisible, setIsPollVisible] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user) {
      await sendMessage(message, user.username, user.nickname || user.username, user.avatar || null);
      setMessage('');
    }
  };

  const handlePollClick = () => {
    setIsPollVisible(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#E2F1E7]">
      <NavBar onPollClick={handlePollClick} />
      <Card className="flex-grow flex flex-col bg-[#243642] overflow-hidden mt-16 mx-4 rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.username === user?.username ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col ${msg.username === user?.username ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <p className="text-xs font-semibold mb-1 text-[#E2F1E7]">{msg.nickname || msg.username}</p>
                <div className={`flex ${msg.username === user?.username ? 'flex-row-reverse' : 'flex-row'} items-end`}>
                  <Avatar className="w-8 h-8">
                    {msg.avatar ? (
                      <AvatarImage src={msg.avatar} alt={msg.nickname || msg.username} />
                    ) : (
                      <AvatarFallback>{(msg.nickname || msg.username || '?').charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-2xl p-3 mx-2 ${
                      msg.username === user?.username
                        ? 'bg-[#387478] text-[#E2F1E7] rounded-br-none'
                        : 'bg-[#629584] text-[#E2F1E7] rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-[#387478]">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full bg-[#E2F1E7] border-0 text-[#243642]"
            />
            <Button type="submit" size="icon" className="rounded-full bg-[#629584] hover:bg-[#243642]">
              <FiSend className="h-4 w-4 text-[#E2F1E7]" />
            </Button>
          </form>
        </div>
      </Card>
      {isPollVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <PollSystem onClose={() => setIsPollVisible(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;