import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import PollSystem from './components/PollSystem';
import DarkModeToggle from './components/DarkModeToggle';

const MainContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <DarkModeToggle />
      </div>
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
            <ThemeProvider>
              <AppRoutes />
            </ThemeProvider>
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;