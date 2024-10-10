import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import PollSystem from './PollSystem';

const NavBar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isPollOpen, setIsPollOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Chat App</h1>
        <div className="space-x-2">
          <Dialog open={isPollOpen} onOpenChange={setIsPollOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-white hover:bg-gray-700">
                Poll
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <PollSystem />
            </DialogContent>
          </Dialog>
          <Button onClick={handleLogout} variant="outline" className="text-white hover:bg-gray-700">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;