import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import ChatRoom from './components/ChatRoom';
import UserList from './components/UserList';
import NavBar from './components/NavBar';
import PollSystem from './components/PollSystem';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const MainContent: React.FC = () => {
  const [isPollVisible, setIsPollVisible] = useState(false);
  const [isUserListVisible, setIsUserListVisible] = useState(false);

  return (
    <>
      <NavBar onPollClick={() => setIsPollVisible(true)} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<ChatRoom />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/users" element={
            isUserListVisible ? 
              <UserList onClose={() => setIsUserListVisible(false)} /> : 
              null
          } />
        </Routes>
      </div>
      {isPollVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <PollSystem onClose={() => setIsPollVisible(false)} />
          </div>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <PollProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/user-details" element={<PrivateRoute element={<UserDetails />} />} />
              <Route path="/*" element={<PrivateRoute element={<MainContent />} />} />
            </Routes>
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;