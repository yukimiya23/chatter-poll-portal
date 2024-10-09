import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PollOption {
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
}

interface PollContextType {
  currentPoll: Poll | null;
  createPoll: (question: string, options: string[]) => void;
  vote: (pollId: string, optionIndex: number, username: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);

  const createPoll = (question: string, options: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map(text => ({ text, votes: 0 })),
    };
    setCurrentPoll(newPoll);
  };

  const vote = (pollId: string, optionIndex: number, username: string) => {
    if (currentPoll && currentPoll.id === pollId) {
      setCurrentPoll(prevPoll => {
        if (!prevPoll) return null;
        const updatedOptions = [...prevPoll.options];
        updatedOptions[optionIndex].votes += 1;
        return { ...prevPoll, options: updatedOptions };
      });
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll, createPoll, vote }}>
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
};