import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NavBarProps {
  onPollClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onPollClick }) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
      <ul className="flex items-center justify-center space-x-4 flex-wrap">
        <li>
          <Button
            onClick={() => handleNavigation('/chat')}
            variant="ghost"
            className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
          >
            Chat
          </Button>
        </li>
        <li>
          <Button
            onClick={onPollClick}
            variant="ghost"
            className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
          >
            Poll
          </Button>
        </li>
        <li>
          <Button
            onClick={() => handleNavigation('/users')}
            variant="ghost"
            className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
          >
            Users
          </Button>
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