import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

interface PollSystemProps {
  onClose: () => void;
}

const PollSystem: React.FC<PollSystemProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { user } = useAuth();
  const { currentPoll, createPoll, vote, unvote } = usePoll();

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (question && options.every(opt => opt.trim())) {
      createPoll(question, options);
    }
  };

  const handleVote = (optionIndex: number) => {
    if (user && currentPoll) {
      vote(currentPoll.id, optionIndex, user.username);
    }
  };

  const handleUnvote = (optionIndex: number) => {
    if (user && currentPoll) {
      unvote(currentPoll.id, optionIndex, user.username);
    }
  };

  const totalVotes = currentPoll
    ? currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
    : 0;

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 overflow-y-auto">
      <Card className="w-full h-full max-w-3xl mx-auto p-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">{currentPoll ? currentPoll.question : 'Create a Poll'}</CardTitle>
          <Button onClick={onClose} variant="outline" size="lg">Close</Button>
        </CardHeader>
        <CardContent className="mt-8">
          {!currentPoll ? (
            <form onSubmit={handleCreatePoll} className="space-y-6">
              <Input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
                className="text-xl p-4"
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
                  className="text-lg p-3"
                />
              ))}
              <div className="flex space-x-4">
                <Button type="button" onClick={() => setOptions([...options, ''])} size="lg" variant="outline">
                  Add Option
                </Button>
                <Button type="submit" size="lg">Create Poll</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {currentPoll.options.map((option, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">{option.text}</span>
                    <span className="text-lg font-bold">{getPercentage(option.votes)}%</span>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={getPercentage(option.votes)} 
                      className="h-8" 
                      style={{backgroundColor: COLORS[index % COLORS.length]}}
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white font-bold">
                      {option.votes} votes
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button onClick={() => handleVote(index)} variant="outline" size="sm">
                      Vote
                    </Button>
                    <Button onClick={() => handleUnvote(index)} variant="outline" size="sm">
                      Unvote
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PollSystem;