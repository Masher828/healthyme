import { useState, useEffect } from "react";

// Mock user type for client-only demo
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

// Mock user data for client-only demo
const mockUser: User = {
  id: "1",
  email: "demo@healthifyme.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
  currentWeight: 75,
  goalWeight: 68,
  height: 175,
  age: 28,
  activityLevel: "moderate",
  calorieGoal: 2000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Check if user is "logged in" from localStorage
      const savedAuth = localStorage.getItem("demo_authenticated");
      setIsAuthenticated(savedAuth === "true");
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = () => {
    localStorage.setItem("demo_authenticated", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("demo_authenticated");
    setIsAuthenticated(false);
  };

  return {
    user: isAuthenticated ? mockUser : null,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}