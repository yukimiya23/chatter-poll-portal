import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
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

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <PollProvider>
            <ThemeProvider>
              <Container fluid>
                <Row className="mb-3">
                  <Col>
                    <DarkModeToggle />
                  </Col>
                </Row>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/"
                    element={
                      <PrivateRoute
                        element={
                          <Row>
                            <Col md={8}>
                              <ChatRoom />
                            </Col>
                            <Col md={4}>
                              <PollSystem />
                            </Col>
                          </Row>
                        }
                      />
                    }
                  />
                </Routes>
              </Container>
            </ThemeProvider>
          </PollProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;