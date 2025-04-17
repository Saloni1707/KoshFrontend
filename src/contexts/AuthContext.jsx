// AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    // Check authentication status on mount and when localStorage changes
    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        setIsLoading(false);
      };
  
      // Listen for localStorage changes
      window.addEventListener('storage', checkAuth);
      
      // Initial check
      checkAuth();
  
      return () => {
        window.removeEventListener('storage', checkAuth);
      };
    }, []);
     // Function to manually update auth state after login/signup
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);