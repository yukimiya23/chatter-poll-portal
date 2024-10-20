import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { realtimeDb } from '../config/firebase';
import { ref, push, onChildAdded, off, Query, DataSnapshot } from 'firebase/database';

interface Message {
  username: string;
  nickname: string;
  avatar: string | null;
  text: string;
  timestamp: number;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, username: string, nickname: string, avatar: string | null) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = ref(realtimeDb, 'messages');
    
    const handleNewMessage = (snapshot: DataSnapshot) => {
      const newMessage = snapshot.val() as Message;
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    onChildAdded(messagesRef, handleNewMessage);

    return () => {
      off(messagesRef, 'child_added', handleNewMessage);
    };
  }, []);

  const sendMessage = async (text: string, username: string, nickname: string, avatar: string | null) => {
    try {
      const newMessage = { username, nickname, avatar, text, timestamp: Date.now() };
      const messagesRef = ref(realtimeDb, 'messages');
      await push(messagesRef, newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
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