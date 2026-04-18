import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { VALID_ROLES } from "../constants/roles"
import { useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && !user) {
      setUser(storedUser);
    }
  }, [user]);

  const isAuthenticated = !!user;

  const login = async (userData) => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userWithRole = {
        ...userData,
        role: "SUPER_ADMIN"
      };

      if (!VALID_ROLES.includes(userWithRole.role)) {
        setError("Rol no permitido en el sistema");
        return;
      }

      setUser(userWithRole);
      localStorage.setItem("user", JSON.stringify(userWithRole));

    } catch (e) {
      setError("Error inesperado en el login: ", e.message)
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
        authLoading,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};