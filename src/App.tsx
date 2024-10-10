import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import ChatRoom from './components/ChatRoom';
import PollSystem from './components/PollSystem';

const MainContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <ChatRoom />
        </div>
        <div className="w-full md:w-1/3">
          <PollSystem />
        </div>
      </div>
    </div>
  );
};

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user-details" element={<UserDetails />} />
      <Route path="/" element={<PrivateRoute element={<MainContent />} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <PollProvider>
            <AppRoutes />
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;