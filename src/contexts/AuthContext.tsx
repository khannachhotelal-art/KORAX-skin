import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginState: (user: User) => void;
  logoutState: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  isAdmin: false, 
  loading: true,
  loginState: () => {},
  logoutState: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('korax_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        checkAdmin(parsed);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const checkAdmin = (u: User) => {
    // If it's the requested email or manually assigned admin list
    const adminsStr = localStorage.getItem('korax_admins') || '[]';
    let admins: string[] = [];
    try {
      admins = JSON.parse(adminsStr);
    } catch(e) {}
    
    if (u.email === 'khannachhotelal@gmail.com' || admins.includes(u.email)) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const loginState = (u: User) => {
    setUser(u);
    localStorage.setItem('korax_user', JSON.stringify(u));
    checkAdmin(u);
  };

  const logoutState = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('korax_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginState, logoutState }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

