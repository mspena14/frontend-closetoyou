import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { validateToken } from '../services/api/authService';

interface AuthContextType {
  token: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userLogged: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userLogged, setUserLogged] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const valid = await validateToken(token);
        setIsAuthenticated(valid);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkToken();
  }, [token]);

  const login = (newToken: string, userId: string) => {
    setToken(newToken);
    setUserLogged(userId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, userLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
