import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePollClick = () => {
    // Navigate to poll page or open poll modal
    // For now, we'll just log a message
    console.log('Poll button clicked');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Chat App</h1>
        <div className="space-x-2">
          <Button onClick={handlePollClick} variant="outline" className="text-white hover:bg-gray-700">
            Poll
          </Button>
          <Button onClick={handleLogout} variant="outline" className="text-white hover:bg-gray-700">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;