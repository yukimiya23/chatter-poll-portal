import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({
            ...userData,
            username: firebaseUser.email || '',
            isOnline: true,
          });
        } else {
          setUser({
            username: firebaseUser.email || '',
            isOnline: true,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser({
        username: email,
        isOnline: true,
      });
      navigate('/user-details');
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
    if (user && auth.currentUser) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.username === user.username ? updatedUser : u));
      
      // Save user details to Firestore
      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, users, login, register, logout, updateUserDetails }}>
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