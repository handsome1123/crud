import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    } else {
      setToken(null);
      setIsLoggedIn(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };

  return { isLoggedIn, token, logout };
}
