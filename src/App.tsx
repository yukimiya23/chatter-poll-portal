import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { PollProvider } from './contexts/PollContext';
import Login from './components/Login';
import UserDetails from './components/UserDetails';
import ChatRoom from './components/ChatRoom';
import UserList from './components/UserList';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthProvider>
          <ChatProvider>
            <PollProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/user-details" element={<UserDetails />} />
                <Route path="/" element={<ChatRoom />} />
                <Route path="/chat" element={<ChatRoom />} />
                <Route path="/users" element={<UserList />} />
              </Routes>
            </PollProvider>
          </ChatProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;