import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "../hooks/use-toast";
import PollCreationForm from './PollCreationForm';
import PollVotingSection from './PollVotingSection';

interface PollSystemProps {
  onClose: () => void;
}

const PollSystem: React.FC<PollSystemProps> = ({ onClose }) => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const { currentPoll } = usePoll();
  const { toast } = useToast();

  useEffect(() => {
    setShowCreatePoll(!currentPoll);
  }, [currentPoll]);

  if (!currentPoll && !showCreatePoll) {
    return (
      <Card className="w-full bg-[#243642] text-[#E2F1E7]">
        <CardContent>
          <p>No active poll. Create a new one to start voting.</p>
          <Button onClick={() => setShowCreatePoll(true)}>Create New Poll</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#243642] text-[#E2F1E7]">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-3xl font-bold">
          {showCreatePoll ? 'Create a Poll' : currentPoll?.question}
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
          <PollCreationForm setShowCreatePoll={setShowCreatePoll} toast={toast} />
        ) : currentPoll && (
          <PollVotingSection currentPoll={currentPoll} toast={toast} />
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;