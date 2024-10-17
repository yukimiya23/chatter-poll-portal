import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PollVotingSectionProps {
  currentPoll: {
    id: string;
    question: string;
    options: { text: string; votes: string[] }[];
  } | null;
}

const PollVotingSection: React.FC<PollVotingSectionProps> = ({ currentPoll }) => {
  const { user } = useAuth();
  const { vote, unvote } = usePoll();
  const { toast } = useToast();

  if (!currentPoll) {
    return <div>No active poll at the moment.</div>;
  }

  const handleVote = async (optionIndex: number) => {
    if (user && currentPoll) {
      try {
        await vote(currentPoll.id, optionIndex, user.username);
        toast({
          title: "Vote Recorded",
          description: "Your vote has been successfully recorded.",
        });
      } catch (error) {
        console.error("Error voting:", error);
        toast({
          title: "Error",
          description: "Failed to record your vote. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUnvote = async (optionIndex: number) => {
    if (user && currentPoll) {
      try {
        await unvote(currentPoll.id, optionIndex, user.username);
        toast({
          title: "Vote Removed",
          description: "Your vote has been successfully removed.",
        });
      } catch (error) {
        console.error("Error unvoting:", error);
        toast({
          title: "Error",
          description: "Failed to remove your vote. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const totalVotes = currentPoll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
  const getPercentage = (votes: string[] | undefined) => {
    return totalVotes > 0 ? Math.round(((votes?.length || 0) / totalVotes) * 100) : 0;
  };

  const COLORS = ['#243642', '#387478', '#629584', '#E2F1E7'];

  return (
    <div className="space-y-6">
      {currentPoll.options.map((option, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">{option.text}</span>
            <span className="text-lg font-bold">{getPercentage(option.votes)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={getPercentage(option.votes)} 
              className="h-8" 
              style={{backgroundColor: COLORS[index % COLORS.length]}}
            />
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#243642] font-bold">
              {option.votes?.length || 0} votes
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleVote(index)} 
              variant="outline" 
              size="sm" 
              className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]"
            >
              Vote
            </Button>
            <Button 
              onClick={() => handleUnvote(index)} 
              variant="outline" 
              size="sm" 
              className="bg-[#E2F1E7] text-[#387478] hover:bg-[#629584]"
            >
              Unvote
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PollVotingSection;