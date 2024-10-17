import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "../hooks/use-toast";

interface PollSystemProps {
  onClose: () => void;
}

const PollSystem: React.FC<PollSystemProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { user } = useAuth();
  const { currentPoll, createPoll, vote, unvote } = usePoll();
  const [showCreatePoll, setShowCreatePoll] = useState(!currentPoll);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShowCreatePoll(!currentPoll);
  }, [currentPoll]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question && options.every(opt => opt.trim())) {
      try {
        await createPoll(question, options);
        setShowCreatePoll(false);
        toast({
          title: "Poll Created",
          description: "Your poll has been successfully created.",
        });
      } catch (error) {
        console.error("Error creating poll:", error);
        toast({
          title: "Error",
          description: "Failed to create poll. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleVote = async (optionIndex: number) => {
    if (user && currentPoll) {
      setIsVoting(true);
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
      } finally {
        setIsVoting(false);
      }
    }
  };

  const handleUnvote = async (optionIndex: number) => {
    if (user && currentPoll) {
      setIsVoting(true);
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
      } finally {
        setIsVoting(false);
      }
    }
  };

  const totalVotes = currentPoll
    ? currentPoll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
    : 0;

  const getPercentage = (votes: string[]) => {
    return totalVotes > 0 ? Math.round((votes.length / totalVotes) * 100) : 0;
  };

  const COLORS = ['#243642', '#387478', '#629584', '#E2F1E7'];

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
          <form onSubmit={handleCreatePoll} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="text-xl p-4 bg-[#387478] text-[#E2F1E7] placeholder-[#E2F1E7] border-[#629584]"
            />
            {options.map((option, index) => (
              <Input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required
                className="text-lg p-3 bg-[#387478] text-[#E2F1E7] placeholder-[#E2F1E7] border-[#629584]"
              />
            ))}
            <div className="flex space-x-4">
              <Button type="button" onClick={() => setOptions([...options, ''])} size="lg" variant="outline" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">
                Add Option
              </Button>
              <Button type="submit" size="lg" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">Create Poll</Button>
            </div>
          </form>
        ) : currentPoll && (
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
                    {option.votes.length} votes
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleVote(index)} 
                    variant="outline" 
                    size="sm" 
                    className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]"
                    disabled={isVoting}
                  >
                    Vote
                  </Button>
                  <Button 
                    onClick={() => handleUnvote(index)} 
                    variant="outline" 
                    size="sm" 
                    className="bg-[#E2F1E7] text-[#387478] hover:bg-[#629584]"
                    disabled={isVoting}
                  >
                    Unvote
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;