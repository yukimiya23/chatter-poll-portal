import React, { useState, useEffect } from 'react';
import { usePoll } from '../contexts/PollContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";
import PollCreationForm from './PollCreationForm';
import PollVotingSection from './PollVotingSection';

interface PollSystemProps {
  onClose: () => void;
}

const PollSystem: React.FC<PollSystemProps> = ({ onClose }) => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { currentPoll, fetchCurrentPoll, removePoll } = usePoll();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentPoll();
  }, [fetchCurrentPoll]);

  const handleRemovePoll = async () => {
    if (currentPoll) {
      try {
        await removePoll(currentPoll.id);
        toast({
          title: "Poll Removed",
          description: "The poll has been successfully removed.",
        });
      } catch (error) {
        console.error("Error removing poll:", error);
        toast({
          title: "Error",
          description: "Failed to remove the poll. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full bg-[#243642] text-[#E2F1E7]">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-3xl font-bold">
          {showCreatePoll ? 'Create a Poll' : currentPoll ? currentPoll.question : 'No Active Poll'}
        </CardTitle>
        <Button 
          onClick={onClose} 
          className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]"
        >
          Close
        </Button>
      </CardHeader>
      <CardContent>
        {showCreatePoll ? (
          <PollCreationForm setShowCreatePoll={setShowCreatePoll} />
        ) : currentPoll ? (
          <>
            <PollVotingSection currentPoll={currentPoll} />
            {user && currentPoll.createdBy === user.username && (
              <Button 
                onClick={handleRemovePoll} 
                className="mt-4 bg-red-500 text-white hover:bg-red-600"
              >
                Remove Poll
              </Button>
            )}
          </>
        ) : (
          <div>
            <p>No active poll. Create a new one to start voting.</p>
            <Button onClick={() => setShowCreatePoll(true)} className="mt-4 bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">
              Create New Poll
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;