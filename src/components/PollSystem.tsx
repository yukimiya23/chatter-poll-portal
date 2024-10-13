import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const COLORS = ['#243642', '#387478', '#629584', '#E2F1E7'];

  const pieChartData = currentPoll
    ? currentPoll.options.map((option, index) => ({
        name: option.text,
        value: option.votes,
        color: COLORS[index % COLORS.length]
      }))
    : [];

  const barChartData = currentPoll
    ? currentPoll.options.map((option) => ({
        name: option.text,
        votes: option.votes
      }))
    : [];

  return (
    <div className="fixed inset-0 bg-[#E2F1E7] overflow-y-auto">
      <Card className="w-full h-full max-w-6xl mx-auto p-6 bg-[#243642] text-[#E2F1E7]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{currentPoll ? currentPoll.question : 'Create a Poll'}</CardTitle>
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
          ) : (
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2 space-y-8">
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
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#243642] font-bold">
                        {option.votes} votes
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button onClick={() => handleVote(index)} variant="outline" size="sm" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">
                        Vote
                      </Button>
                      <Button onClick={() => handleUnvote(index)} variant="outline" size="sm" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">
                        Unvote
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={onClose} variant="outline" size="lg" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584] mt-4">Close</Button>
              </div>
              
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Poll Statistics</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Pie Chart</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">Bar Chart</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={barChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="votes" fill="#387478" />
                      </BarChart>
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