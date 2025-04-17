import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(() => {
    try {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthError(error.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async (token) => {
    if (!token) {
      throw new Error("Token is required for login");
    }

    try {
      setIsLoading(true);
      setAuthError(null);
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        isLoading,
        authError,
        login,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
