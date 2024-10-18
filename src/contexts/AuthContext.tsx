import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast"

export interface AuthUser {
  uid: string;
  email: string | null;
  username: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  avatar?: string | null;
  isOnline: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  users: AuthUser[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserDetails: (details: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Firebase user detected:", firebaseUser.email);
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as AuthUser;
          console.log("User data from Firestore:", userData);
          setUser({
            ...userData,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isOnline: true,
          });
        } else {
          console.log("No user document found in Firestore");
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.email || '',
            isOnline: true,
          });
        }
      } else {
        console.log("No Firebase user detected");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, user:", userCredential.user.email);
      
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as AuthUser;
        console.log("User data retrieved from Firestore:", userData);
        setUser({
          ...userData,
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          isOnline: true,
        });
        toast({
          title: "Logged in successfully",
          description: "Welcome back to the chat room!",
        });
        navigate('/');
      } else {
        console.log("No user document found, redirecting to user details");
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          username: email,
          isOnline: true,
        });
        toast({
          title: "Please complete your profile",
          description: "We need some additional information.",
        });
        navigate('/user-details');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username: email,
        isOnline: true,
      });
      toast({
        title: "Registered successfully",
        description: "Please complete your user details.",
      });
      navigate('/user-details');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Please try again with a different email.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const updateUserDetails = async (details: Partial<AuthUser>) => {
    if (user && auth.currentUser) {
      const updatedUser = { ...user, ...details };
      setUser(updatedUser);
      setUsers(prevUsers => prevUsers.map(u => u.uid === user.uid ? updatedUser : u));
      
      await setDoc(doc(db, 'users', auth.currentUser.uid), updatedUser);
      navigate('/');
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