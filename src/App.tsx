import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import ChatRoom from './components/ChatRoom';

const MainContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <ChatRoom />
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
    <AuthProvider>
      <Router>
        <ChatProvider>
          <PollProvider>
            <AppRoutes />
          </PollProvider>
        </ChatProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;