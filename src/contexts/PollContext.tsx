import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ref, onValue, set, get, push, remove } from 'firebase/database';
import { realtimeDb } from '../config/firebase';
import { useAuth } from './AuthContext';

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
  removePoll: () => Promise<void>;
  fetchCurrentPoll: () => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const { user } = useAuth();

  const fetchCurrentPoll = async () => {
    const pollRef = ref(realtimeDb, 'currentPoll');
    const snapshot = await get(pollRef);
    const data = snapshot.val();
    if (data) {
      setCurrentPoll(data);
    } else {
      setCurrentPoll(null);
    }
  };

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
      const pollsRef = ref(realtimeDb, 'polls');
      const newPollRef = push(pollsRef);
      const pollId = newPollRef.key;
      if (!pollId) throw new Error('Failed to generate poll ID');
      
      const pollWithId = { ...newPoll, id: pollId };
      await set(newPollRef, pollWithId);
      await set(ref(realtimeDb, 'currentPoll'), pollWithId);
      setCurrentPoll(pollWithId);
    } catch (error) {
      console.error("Error creating poll:", error);
      throw error;
    }
  };

  const vote = async (pollId: string, optionIndex: number, username: string) => {
    if (!user) throw new Error('User must be authenticated to vote');
    try {
      const pollRef = ref(realtimeDb, `polls/${pollId}/options/${optionIndex}/votes`);
      const snapshot = await get(pollRef);
      const currentVotes = snapshot.val() || [];
      if (!currentVotes.includes(username)) {
        await set(pollRef, [...currentVotes, username]);
      }
      await fetchCurrentPoll();
    } catch (error) {
      console.error("Error voting:", error);
      throw error;
    }
  };

  const unvote = async (pollId: string, optionIndex: number, username: string) => {
    if (!user) throw new Error('User must be authenticated to unvote');
    try {
      const pollRef = ref(realtimeDb, `polls/${pollId}/options/${optionIndex}/votes`);
      const snapshot = await get(pollRef);
      const currentVotes = snapshot.val() || [];
      const updatedVotes = currentVotes.filter((voter: string) => voter !== username);
      await set(pollRef, updatedVotes);
      await fetchCurrentPoll();
    } catch (error) {
      console.error("Error unvoting:", error);
      throw error;
    }
  };

  const removePoll = async () => {
    if (!user) throw new Error('User must be authenticated to remove a poll');
    try {
      await remove(ref(realtimeDb, 'currentPoll'));
      setCurrentPoll(null);
    } catch (error) {
      console.error("Error removing poll:", error);
      throw error;
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll, createPoll, vote, unvote, removePoll, fetchCurrentPoll }}>
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