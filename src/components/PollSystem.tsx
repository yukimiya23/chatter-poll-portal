import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Button, Form, ProgressBar } from 'react-bootstrap';

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

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Polling System</h2>
      {!currentPoll ? (
        <Form onSubmit={handleCreatePoll}>
          <Form.Group className="mb-3" controlId="formQuestion">
            <Form.Label>Poll Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </Form.Group>
          {options.map((option, index) => (
            <Form.Group key={index} className="mb-3" controlId={`formOption${index}`}>
              <Form.Label>Option {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required
              />
            </Form.Group>
          ))}
          <Button variant="secondary" onClick={() => setOptions([...options, ''])}>
            Add Option
          </Button>
          <Button variant="primary" type="submit" className="ms-2">
            Create Poll
          </Button>
        </Form>
      ) : (
        <div>
          <h3>{currentPoll.question}</h3>
          {currentPoll.options.map((option, index) => (
            <div key={index} className="mb-2">
              <ProgressBar
                now={option.votes}
                label={`${option.text} (${option.votes})`}
                max={currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0)}
              />
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleVote(index)}
                className="mt-1"
              >
                Vote
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollSystem;