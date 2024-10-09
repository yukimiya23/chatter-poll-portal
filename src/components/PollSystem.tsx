import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

const PollSystem: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { user } = useAuth();
  const { currentPoll, createPoll, vote } = usePoll();

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

  const totalVotes = currentPoll
    ? currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
    : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{currentPoll ? 'Current Poll' : 'Create a Poll'}</CardTitle>
      </CardHeader>
      <CardContent>
        {!currentPoll ? (
          <form onSubmit={handleCreatePoll} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
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
              />
            ))}
            <div className="flex space-x-2">
              <Button type="button" onClick={() => setOptions([...options, ''])}>
                Add Option
              </Button>
              <Button type="submit">Create Poll</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentPoll.question}</h3>
            {currentPoll.options.map((option, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span>{option.votes} votes</span>
                </div>
                <Progress value={(option.votes / totalVotes) * 100} />
                <Button onClick={() => handleVote(index)} variant="outline" size="sm">
                  Vote
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;