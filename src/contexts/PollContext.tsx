import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { realtimeDb } from '../config/firebase';
import { ref, onValue, set, get, push } from 'firebase/database';
import { useAuth } from './AuthContext';
import { useToast } from "@/hooks/use-toast";

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
  fetchCurrentPoll: () => Promise<void>;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export const PollProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCurrentPoll = async () => {
    try {
      const pollRef = ref(realtimeDb, 'currentPoll');
      const snapshot = await get(pollRef);
      const data = snapshot.val();
      if (data) {
        setCurrentPoll(data);
      } else {
        setCurrentPoll(null);
      }
    } catch (error) {
      console.error("Error fetching current poll:", error);
      toast({
        title: "Error",
        description: "Failed to fetch the current poll. Please try again.",
        variant: "destructive",
      });
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
    }, (error) => {
      console.error("Error in poll subscription:", error);
      toast({
        title: "Connection Error",
        description: "There was an issue connecting to the poll data. Please check your connection.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const createPoll = async (question: string, options: string[]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a poll.",
        variant: "destructive",
      });
      return;
    }
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
      toast({
        title: "Error",
        description: "Failed to create the poll. Please try again.",
        variant: "destructive",
      });
    }
  };

  const vote = async (pollId: string, optionIndex: number, username: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to vote.",
        variant: "destructive",
      });
      return;
    }
    try {
      const pollRef = ref(realtimeDb, `polls/${pollId}/options/${optionIndex}/votes`);
      const snapshot = await get(pollRef);
      const currentVotes = snapshot.val() || [];
      if (!currentVotes.includes(username)) {
        await set(pollRef, [...currentVotes, username]);
      }
      await fetchCurrentPoll(); // Refresh the current poll data
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to record your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const unvote = async (pollId: string, optionIndex: number, username: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to remove your vote.",
        variant: "destructive",
      });
      return;
    }
    try {
      const pollRef = ref(realtimeDb, `polls/${pollId}/options/${optionIndex}/votes`);
      const snapshot = await get(pollRef);
      const currentVotes = snapshot.val() || [];
      const updatedVotes = currentVotes.filter((voter: string) => voter !== username);
      await set(pollRef, updatedVotes);
      await fetchCurrentPoll(); // Refresh the current poll data
    } catch (error) {
      console.error("Error unvoting:", error);
      toast({
        title: "Error",
        description: "Failed to remove your vote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PollContext.Provider value={{ currentPoll, createPoll, vote, unvote, fetchCurrentPoll }}>
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
