import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  avatar?: string | null;
  isOnline: boolean;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  nickname: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserDetails: (details: UserDetails) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating fetching users from an API
    const fetchUsers = () => {
      const mockUsers: User[] = [
        { username: 'user1', isOnline: true },
        { username: 'user2', isOnline: false },
        { username: 'user3', isOnline: true },
      ];
      setUsers(mockUsers);
    };
    fetchUsers();
  }, []);

  const login = async (username: string, password: string) => {
    if (username.trim() && password.trim()) {
      const newUser: User = { username, isOnline: true };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUsers(prevUsers => [...prevUsers, newUser]);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    if (user) {
      setUsers(prevUsers => prevUsers.filter(u => u.username !== user.username));
    }
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateUserDetails = (details: UserDetails) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUsers(prevUsers => prevUsers.map(u => u.username === user.username ? updatedUser : u));
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};