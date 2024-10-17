import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface NavBarProps {
  onPollClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onPollClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = async (path: string) => {
    try {
      if (path === 'poll') {
        onPollClick();
      } else if (path === 'logout') {
        await logout();
        navigate('/login');
      } else {
        navigate(`/${path}`);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "An error occurred while navigating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = ['Chat', 'Poll', 'Users', 'Logout'];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
      <ul className="flex items-center justify-center space-x-4">
        {navItems.map((item) => (
          <li key={item}>
            <Button
              onClick={() => handleNavigation(item.toLowerCase())}
              variant="ghost"
              className="text-[#E2F1E7] hover:bg-[#629584] hover:text-[#243642]"
            >
              {item}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;