import React, { useState } from 'react';
import { usePoll } from '../contexts/PollContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PollCreationFormProps {
  setShowCreatePoll: (show: boolean) => void;
  toast: (props: { title: string; description: string; variant?: string }) => void;
}

const PollCreationForm: React.FC<PollCreationFormProps> = ({ setShowCreatePoll, toast }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { createPoll } = usePoll();

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

  return (
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
  );
};

export default PollCreationForm;