import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserDetails: (details: UserDetails) => Promise<void>;
  getUserDetails: () => Promise<UserDetails | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          username: firebaseUser.email || '',
          isOnline: true,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/user-details');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserDetails = async (details: UserDetails) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.username === user.username ? updatedUser : u));
      
      // Save user details to Firestore
      const userRef = doc(db, 'users', user.username);
      await setDoc(userRef, details, { merge: true });
    }
  };

  const getUserDetails = async (): Promise<UserDetails | null> => {
    if (user) {
      const userRef = doc(db, 'users', user.username);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data() as UserDetails;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateUserDetails, getUserDetails }}>
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