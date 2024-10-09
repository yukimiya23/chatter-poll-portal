import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  username: string;
  text: string;
  timestamp: number;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, username: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = (text: string, username: string) => {
    const newMessage = { username, text, timestamp: Date.now() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};