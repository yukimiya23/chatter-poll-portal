import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PollOption {
  text: string;
  votes: number;
  voters: string[];
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
  unvote: (pollId: string, optionIndex: number, username: string) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);

  const createPoll = (question: string, options: string[]) => {
    const newPoll: Poll = {
      id: Date.now().toString(),
      question,
      options: options.map(text => ({ text, votes: 0, voters: [] })),
    };
    setCurrentPoll(newPoll);
  };

  const vote = (pollId: string, optionIndex: number, username: string) => {
    if (currentPoll && currentPoll.id === pollId) {
      setCurrentPoll(prevPoll => {
        if (!prevPoll) return null;
        const updatedOptions = [...prevPoll.options];
        if (!updatedOptions[optionIndex].voters.includes(username)) {
          updatedOptions[optionIndex].votes += 1;
          updatedOptions[optionIndex].voters.push(username);
        }
        return { ...prevPoll, options: updatedOptions };
      });
    }
  };

  const unvote = (pollId: string, optionIndex: number, username: string) => {
    if (currentPoll && currentPoll.id === pollId) {
      setCurrentPoll(prevPoll => {
        if (!prevPoll) return null;
        const updatedOptions = [...prevPoll.options];
        const voterIndex = updatedOptions[optionIndex].voters.indexOf(username);
        if (voterIndex !== -1) {
          updatedOptions[optionIndex].votes -= 1;
          updatedOptions[optionIndex].voters.splice(voterIndex, 1);
        }
        return { ...prevPoll, options: updatedOptions };
      });
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll, createPoll, vote, unvote }}>
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