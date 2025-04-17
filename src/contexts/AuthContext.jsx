import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const validateToken = useCallback(async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/getUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const isValid = await validateToken(token);
      setIsAuthenticated(isValid);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [validateToken]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username, password) => {
    try {
      setAuthError(null);
      const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/signin`,
        data: { username, password },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const { token } = response.data;
      if (!token || typeof token !== 'string') {
        throw new Error("Invalid token received from server");
      }

      localStorage.setItem("token", token);
      
      await validateToken(token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setAuthError(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      setAuthError(null);
      // First, create the user
      const signupResponse = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_SERVER_URL}/api/v1/user/signup`,
        data: {
          ...userData,
          username: userData.username.trim()
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const { token } = signupResponse.data;
      if (!token || typeof token !== 'string') {
        throw new Error("Invalid token received from server");
      }

      localStorage.setItem("token", token);
      
      await validateToken(token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      setAuthError(error.response?.data?.message || "Signup failed");
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/signin");
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signup,
        logout,
        authError,
        user,
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
