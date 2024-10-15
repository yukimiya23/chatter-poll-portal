import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, limit, query } from 'firebase/firestore';

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
    const q = query(collection(db, 'polls'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Poll));
      setCurrentPoll(polls[0] || null);
    }, (error) => {
      console.error("Error fetching polls:", error);
    });

    return () => unsubscribe();
  }, []);

  const createPoll = async (question: string, options: string[]) => {
    try {
      const newPoll: Omit<Poll, 'id'> = {
        question,
        options: options.map(text => ({ text, votes: 0, voters: [] })),
      };
      await addDoc(collection(db, 'polls'), newPoll);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  const vote = async (pollId: string, optionIndex: number, username: string) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: arrayUnion(username),
        [`options.${optionIndex}.voters`]: arrayUnion(username),
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const unvote = async (pollId: string, optionIndex: number, username: string) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: arrayRemove(username),
        [`options.${optionIndex}.voters`]: arrayRemove(username),
      });
    } catch (error) {
      console.error("Error unvoting:", error);
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