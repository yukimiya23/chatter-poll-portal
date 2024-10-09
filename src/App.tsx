import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
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
    <Container fluid>
      <div className="d-flex justify-content-end mb-3">
        <DarkModeToggle />
      </div>
      <div className="row">
        <div className="col-md-8">
          <ChatRoom />
        </div>
        <div className="col-md-4">
          <PollSystem />
        </div>
      </div>
    </Container>
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