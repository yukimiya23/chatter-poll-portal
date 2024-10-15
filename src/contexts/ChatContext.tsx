import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

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
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        fetchedMessages.push(doc.data() as Message);
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (text: string, username: string, nickname: string, avatar: string | null) => {
    const newMessage = { username, nickname, avatar, text, timestamp: Date.now() };
    await addDoc(collection(db, 'messages'), newMessage);
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