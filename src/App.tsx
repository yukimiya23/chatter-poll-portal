import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <PollProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/user-details" element={<PrivateRoute element={<UserDetails />} />} />
                <Route path="/" element={<PrivateRoute element={<ChatRoom />} />} />
                <Route path="/chat" element={<PrivateRoute element={<ChatRoom />} />} />
                <Route path="/users" element={<PrivateRoute element={<UserList />} />} />
              </Routes>
            </ErrorBoundary>
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;