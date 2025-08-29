'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userUnsubscribe = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
                setUser({ id: userDoc.id, ...userDoc.data() } as User);
            }
            setLoading(false);
        });
        return () => userUnsubscribe();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => authUnsubscribe();
  }, []);
  
  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const newUser: Omit<User, 'id'> = {
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email!,
          avatarUrl: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
          subjects: [],
          skills: [],
          availability: 'any',
        };
        await setDoc(userDocRef, newUser);
      }
    } finally {
        // onAuthStateChanged will handle setting loading to false
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    logout,
    loginWithGoogle,
  };

  // Render children only when loading is false. This prevents rendering protected routes before auth state is resolved.
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
