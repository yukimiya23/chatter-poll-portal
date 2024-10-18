import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePoll } from '../contexts/PollContext';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NavBarProps {
  onPollClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onPollClick }) => {
  const { logout, user } = useAuth();
  const { fetchCurrentPoll } = usePoll();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePollClick = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to access polls.",
        variant: "destructive",
      });
      return;
    }
    try {
      await fetchCurrentPoll();
      onPollClick();
    } catch (error) {
      console.error('Error fetching poll:', error);
      toast({
        title: "Error",
        description: "Failed to load the poll. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
      <ul className="flex items-center justify-center space-x-4 flex-wrap">
        <li>
          <Link to="/chat">
            <Button variant="ghost" className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]">
              Chat
            </Button>
          </Link>
        </li>
        <li>
          <Button
            onClick={handlePollClick}
            variant="ghost"
            className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
          >
            Poll
          </Button>
        </li>
        <li>
          <Link to="/users">
            <Button variant="ghost" className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]">
              Users
            </Button>
          </Link>
        </li>
        <li>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
          >
            Logout
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;