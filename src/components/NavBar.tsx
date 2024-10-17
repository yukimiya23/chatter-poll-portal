import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface NavBarProps {
  onPollClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onPollClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
      <ul className="flex items-center justify-center space-x-4">
        <li>
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
          >
            Chat
          </Link>
        </li>
        <li>
          <button
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
            onClick={onPollClick}
          >
            Poll
          </button>
        </li>
        <li>
          <Link
            to="/users"
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
          >
            Users
          </Link>
        </li>
        <li>
          <button
            className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;