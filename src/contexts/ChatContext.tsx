import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  username: string;
  text: string;
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string, username: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://echo.websocket.org');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => {
        console.log('Attempting to reconnect...');
        setSocket(null);
      }, 5000);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (text: string, username: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = { username, text };
      socket.send(JSON.stringify(message));
      // Immediately add the sent message to the local state
      setMessages((prevMessages) => [...prevMessages, message]);
    } else {
      console.error('WebSocket is not connected');
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