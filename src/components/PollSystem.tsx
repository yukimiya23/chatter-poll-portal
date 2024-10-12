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
    <div className="fixed inset-0 bg-white dark:bg-gray-900 overflow-y-auto">
      <Card className="w-full h-full max-w-6xl mx-auto p-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">{currentPoll ? 'Current Poll' : 'Create a Poll'}</CardTitle>
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
              <h3 className="text-2xl font-semibold mb-6">{currentPoll.question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {currentPoll.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">{option.text}</span>
                        <span className="text-lg font-bold">{option.votes} votes</span>
                      </div>
                      <Progress value={(option.votes / totalVotes) * 100} className="h-4" />
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
                </div>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Bar Chart</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={currentPoll.options}>
                        <XAxis dataKey="text" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Pie Chart</h4>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PollSystem;