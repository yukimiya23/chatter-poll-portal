import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import ChatRoom from './components/ChatRoom';
import UserList from './components/UserList';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/user-details" element={<PrivateRoute element={<UserDetails />} />} />
      <Route path="/" element={<PrivateRoute element={<ChatRoom />} />} />
      <Route path="/users" element={<PrivateRoute element={<UserList onClose={() => {}} />} />} />
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