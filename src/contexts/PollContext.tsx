import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, realtimeDb } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';
import { collection, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface PollOption {
  text: string;
  votes: string[];
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
    const pollRef = ref(realtimeDb, 'currentPoll');
    const unsubscribe = onValue(pollRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentPoll(data);
      } else {
        setCurrentPoll(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const createPoll = async (question: string, options: string[]) => {
    try {
      const newPoll: Omit<Poll, 'id'> = {
        question,
        options: options.map(text => ({ text, votes: [] })),
      };
      const docRef = await addDoc(collection(db, 'polls'), newPoll);
      const pollWithId = { ...newPoll, id: docRef.id };
      await set(ref(realtimeDb, 'currentPoll'), pollWithId);
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  };

  const vote = async (pollId: string, optionIndex: number, username: string) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: arrayUnion(username),
      });
      if (currentPoll) {
        const updatedPoll = { ...currentPoll };
        updatedPoll.options[optionIndex].votes.push(username);
        await set(ref(realtimeDb, 'currentPoll'), updatedPoll);
      }
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  };

  const unvote = async (pollId: string, optionIndex: number, username: string) => {
    try {
      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: arrayRemove(username),
      });
      if (currentPoll) {
        const updatedPoll = { ...currentPoll };
        updatedPoll.options[optionIndex].votes = updatedPoll.options[optionIndex].votes.filter(voter => voter !== username);
        await set(ref(realtimeDb, 'currentPoll'), updatedPoll);
      }
    } catch (error) {
      console.error("Error unvoting:", error);
      throw error;
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