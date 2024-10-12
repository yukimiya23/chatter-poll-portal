import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{currentPoll ? 'Current Poll' : 'Create a Poll'}</CardTitle>
        <Button onClick={onClose} variant="outline" size="sm">Close</Button>
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
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{currentPoll.question}</h3>
            {currentPoll.options.map((option, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span>{option.votes} votes</span>
                </div>
                <Progress value={(option.votes / totalVotes) * 100} />
                <div className="flex space-x-2">
                  <Button onClick={() => handleVote(index)} variant="outline" size="sm">
                    Vote
                  </Button>
                  <Button onClick={() => handleUnvote(index)} variant="outline" size="sm">
                    Unvote
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Results Visualization</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentPoll.options}>
                  <XAxis dataKey="text" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="votes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-8">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentPoll.options}
                      dataKey="votes"
                      nameKey="text"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {currentPoll.options.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollSystem;