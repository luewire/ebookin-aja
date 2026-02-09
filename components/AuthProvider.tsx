'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface User extends FirebaseUser {
  subscriptionStatus?: string;
  role?: string;
  plan?: 'Free' | 'Premium';
  dbId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Get Token and Custom Claims (Role)
          const tokenResult = await firebaseUser.getIdTokenResult();
          const role = tokenResult.claims.role as string;

          // 2. Fetch Plan from Database
          // We use the token we just got to authenticate the request
          const token = tokenResult.token;

          let plan: 'Free' | 'Premium' = 'Free';
          let dbId: string | undefined = undefined;

          try {
            const res = await fetch('/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (res.ok) {
              const data = await res.json();
              if (data.user) {
                if (data.user.plan) plan = data.user.plan;
                if (data.user.id) dbId = data.user.id;
              }
            }
          } catch (err) {
            console.error("Failed to fetch user data from DB", err);
          }

          const userWithData = firebaseUser as User;
          userWithData.role = role;
          userWithData.plan = plan;
          userWithData.dbId = dbId;

          setUser(userWithData);
        } catch (e) {
          console.error("Auth initialization error", e);
          setUser(firebaseUser as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

