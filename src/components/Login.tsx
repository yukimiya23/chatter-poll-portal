import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container fluid>
      <Row className="vh-100">
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <div className="w-75">
            <h2 className="mb-4">Sign In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>USERNAME</Form.Label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>PASSWORD</Form.Label>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label htmlFor="remember-me" className="ms-2">Remember Me</label>
                </div>
                <a href="#" className="text-decoration-none">Forgot Password</a>
              </div>
              <Button variant="danger" type="submit" className="w-100">
                Sign In
              </Button>
            </Form>
          </div>
        </Col>
        <Col md={6} className="bg-danger d-flex align-items-center justify-content-center text-white">
          <div className="text-center">
            <h1 className="display-4 mb-4">Welcome to login</h1>
            <p className="lead mb-4">Don't have an account?</p>
            <Button variant="outline-light">Sign Up</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;