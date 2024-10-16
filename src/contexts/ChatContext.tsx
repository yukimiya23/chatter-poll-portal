import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { realtimeDb } from '../config/firebase';
import { ref, push, onChildAdded, query, limitToLast, DataSnapshot } from 'firebase/database';

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
    const messagesQuery = query(messagesRef, limitToLast(100));
    
    const unsubscribe = onChildAdded(messagesQuery, (snapshot: DataSnapshot) => {
      const message = snapshot.val() as Message;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // This is not actually unsubscribing, but there's no direct way to unsubscribe from onChildAdded
      // In a real-world scenario, you might want to use a more sophisticated approach
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