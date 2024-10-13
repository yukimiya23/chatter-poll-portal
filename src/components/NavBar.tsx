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
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#243642] rounded-full shadow-lg px-1 py-1 z-10">
        <ul className="flex items-center space-x-1">
          {navItems.map((item) => (
            <li key={item}>
              {item === 'Poll' ? (
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
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
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
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
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
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
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-colors ${
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-[#E2F1E7] p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <PollSystem onClose={() => setIsPollVisible(false)} />
          </div>
        </div>
      )}
      {isUserListVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-[#E2F1E7] p-6 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <UserList onClose={() => setIsUserListVisible(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;