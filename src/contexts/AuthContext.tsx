import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { apiLogin, apiSignup } from "@/api/index";

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  // Initialize auth state from localStorage
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const initialToken = storedToken;
  const initialUser = storedUser ? (JSON.parse(storedUser) as User) : null;
  const [token, setToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<User | null>(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialToken && !!initialUser);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      const { token: newToken, user: newUser } = response;
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);
      navigate("/campaigns");
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || "Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await apiSignup(name, email, password);
      navigate("/login");
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context usage
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ProtectedRoute component to guard private routes
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}; 