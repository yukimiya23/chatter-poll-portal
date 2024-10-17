import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PollSystem from './PollSystem';
import UserList from './UserList';

const NavBar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Chat');
  const [isPollVisible, setIsPollVisible] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = ['Chat', 'Poll', 'Users', 'Logout'];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#243642] shadow-lg px-4 py-2 z-50">
        <ul className="flex items-center justify-center space-x-4">
          {navItems.map((item) => (
            <li key={item}>
              {item === 'Poll' ? (
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === item
                      ? 'bg-[#387478] text-[#E2F1E7]'
                      : 'text-[#E2F1E7] hover:bg-[#629584]'
                  }`}
                  onClick={() => {
                    setActiveTab(item);
                    setIsPollVisible(!isPollVisible);
                    setIsUserListVisible(false);
                  }}
                >
                  {item}
                </button>
              ) : item === 'Logout' ? (
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === item
                      ? 'bg-[#387478] text-[#E2F1E7]'
                      : 'text-[#E2F1E7] hover:bg-[#629584]'
                  }`}
                  onClick={handleLogout}
                >
                  {item}
                </button>
              ) : item === 'Users' ? (
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === item
                      ? 'bg-[#387478] text-[#E2F1E7]'
                      : 'text-[#E2F1E7] hover:bg-[#629584]'
                  }`}
                  onClick={() => {
                    setActiveTab(item);
                    setIsUserListVisible(!isUserListVisible);
                    setIsPollVisible(false);
                  }}
                >
                  {item}
                </button>
              ) : (
                <Link
                  to={item.toLowerCase()}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    activeTab === item
                      ? 'bg-[#387478] text-[#E2F1E7]'
                      : 'text-[#E2F1E7] hover:bg-[#629584]'
                  }`}
                  onClick={() => {
                    setActiveTab(item);
                    setIsPollVisible(false);
                    setIsUserListVisible(false);
                  }}
                >
                  {item}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {isPollVisible && (
        <PollSystem onClose={() => setIsPollVisible(false)} />
      )}
      {isUserListVisible && (
        <UserList onClose={() => setIsUserListVisible(false)} />
      )}
    </>
  );
};

export default NavBar;