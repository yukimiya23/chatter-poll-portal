import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface NavBarProps {
  onPollClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onPollClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = ['Chat', 'Poll', 'Users', 'Logout'];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
      <ul className="flex items-center justify-center space-x-4">
        {navItems.map((item) => (
          <li key={item}>
            {item === 'Poll' ? (
              <button
                className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
                onClick={onPollClick}
              >
                {item}
              </button>
            ) : item === 'Logout' ? (
              <button
                className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
                onClick={handleLogout}
              >
                {item}
              </button>
            ) : (
              <Link
                to={item.toLowerCase()}
                className="px-4 py-2 text-sm font-medium rounded-full transition-colors text-[#E2F1E7] hover:bg-[#629584]"
              >
                {item}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;