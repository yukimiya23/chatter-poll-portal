import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
  createPoll: (question: string, options: string[]) => Promise<void>;
  vote: (pollId: string, optionIndex: number, username: string) => Promise<void>;
  unvote: (pollId: string, optionIndex: number, username: string) => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'polls'), (snapshot) => {
      const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
      setCurrentPoll(polls[0] || null);
    });

    return () => unsubscribe();
  }, []);

  const createPoll = async (question: string, options: string[]) => {
    const newPoll: Omit<Poll, 'id'> = {
      question,
      options: options.map(text => ({ text, votes: 0, voters: [] })),
    };
    await addDoc(collection(db, 'polls'), newPoll);
  };

  const vote = async (pollId: string, optionIndex: number, username: string) => {
    const pollRef = doc(db, 'polls', pollId);
    await updateDoc(pollRef, {
      [`options.${optionIndex}.votes`]: arrayUnion(username),
      [`options.${optionIndex}.voters`]: arrayUnion(username),
    });
  };

  const unvote = async (pollId: string, optionIndex: number, username: string) => {
    const pollRef = doc(db, 'polls', pollId);
    await updateDoc(pollRef, {
      [`options.${optionIndex}.votes`]: arrayRemove(username),
      [`options.${optionIndex}.voters`]: arrayRemove(username),
    });
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