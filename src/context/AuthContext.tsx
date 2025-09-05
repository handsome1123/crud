// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { email: string } | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const payload = JSON.parse(atob(savedToken.split(".")[1]));
      setUser({ email: payload.email });
      setToken(savedToken);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser({ email: payload.email });
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
