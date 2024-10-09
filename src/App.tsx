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

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const MainContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <DarkModeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChatRoom />
        <PollSystem />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <PollProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={<PrivateRoute element={<MainContent />} />}
                />
              </Routes>
            </ThemeProvider>
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;