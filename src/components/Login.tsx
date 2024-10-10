import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaFacebookF, FaTwitter, FaGithub } from 'react-icons/fa';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    try {
      await login(username, password);
      navigate('/user-details');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">LOGIN</h2>
        <p className="text-center text-gray-300">Please enter your login and password</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-200">
            Login
          </Button>
        </form>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
            <FaGithub size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;