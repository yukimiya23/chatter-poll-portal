import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

interface AuthUser {
  uid: string;
  email: string | null;
  username: string;
  nickname?: string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  isOnline?: boolean;
  id?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserDetails: (details: Partial<AuthUser>) => Promise<void>;
  users: AuthUser[];
  fetchUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data() as AuthUser;
        setUser({ ...userData, uid: firebaseUser.uid });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    const userData = userDoc.data() as AuthUser;
    setUser({ ...userData, uid: userCredential.user.uid });
    navigate('/');
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: AuthUser = { uid: userCredential.user.uid, email, username: email.split('@')[0], isOnline: true };
    await setDoc(doc(db, 'users', newUser.uid), newUser);
    setUser(newUser);
    navigate('/user-details');
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/login');
  };

  const updateUserDetails = async (details: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...details };
      await setDoc(doc(db, 'users', user.uid), updatedUser);
      setUser(updatedUser);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AuthUser));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserDetails, users, fetchUsers }}>
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