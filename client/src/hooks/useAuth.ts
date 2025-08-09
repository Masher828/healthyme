import { useState, useEffect } from "react";
import { authApi } from "@/lib/api";

// User type for server integration
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  currentWeight?: number;
  goalWeight?: number;
  height?: number;
  age?: number;
  activityLevel?: string;
  calorieGoal?: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authApi.getUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      // User not authenticated
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string = "demo@healthifyme.com", password: string = "demo123") => {
    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
      window.location.reload(); // Refresh to ensure clean state
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}