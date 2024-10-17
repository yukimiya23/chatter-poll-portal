import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"

interface AuthUser {
  uid: string;
  email: string | null;
  username: string;
  nickname?: string;
  avatar?: string | null;
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
  const { toast } = useToast();

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
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data() as AuthUser;
      setUser({ ...userData, uid: userCredential.user.uid });
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Please check your email and password.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser: AuthUser = {
        uid: userCredential.user.uid,
        email: email,
        username: email.split('@')[0],
      };
      await setDoc(doc(db, 'users', newUser.uid), newUser);
      setUser(newUser);
      toast({
        title: "Registration Successful",
        description: "Please complete your profile details.",
      });
      navigate('/user-details');
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserDetails = async (details: Partial<AuthUser>) => {
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { ...user, ...details }, { merge: true });
        setUser((prev) => ({ ...prev!, ...details }));
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } catch (error) {
        console.error("Update user details error:", error);
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
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
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
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