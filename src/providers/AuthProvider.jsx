import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const isAuthenticated = !!user;

  const login = async (userData) => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userWithRole = {
        ...userData,
        role: "SUPER_ADMIN"
      };

      setUser(userWithRole);
      localStorage.setItem("user", JSON.stringify(userWithRole));

    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(null);
      localStorage.removeItem("user");

    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        authLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};