import React, { useState, useEffect } from 'react';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "../hooks/use-toast";
import PollCreationForm from './PollCreationForm';
import PollVotingSection from './PollVotingSection';
import { useAuth } from '../contexts/AuthContext';

interface PollSystemProps {
  onClose: () => void;
}

const PollSystem: React.FC<PollSystemProps> = ({ onClose }) => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { currentPoll, fetchCurrentPoll, removePoll } = usePoll();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCurrentPoll();
  }, [fetchCurrentPoll]);

  const handleCreatePollClick = () => {
    setShowCreatePoll(true);
  };

  const handleRemovePoll = async () => {
    try {
      await removePoll();
      toast({
        title: "Poll Removed",
        description: "The current poll has been removed successfully.",
      });
    } catch (error) {
      console.error("Error removing poll:", error);
      toast({
        title: "Error",
        description: "Failed to remove the poll. Please try again.",
        variant: "destructive",
      });
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
            <div className="mt-4 flex justify-between">
              <Button 
                onClick={handleCreatePollClick} 
                className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]"
              >
                Create New Poll
              </Button>
              {user && (
                <Button 
                  onClick={handleRemovePoll} 
                  className="bg-[#E2F1E7] text-[#387478] hover:bg-[#629584]"
                >
                  Remove Poll
                </Button>
              )}
            </div>
          </>
        ) : (
          <div>
            <p>No active poll. Create a new one to start voting.</p>
            <Button 
              onClick={handleCreatePollClick} 
              className="mt-4 bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]"
            >
              Create New Poll
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;