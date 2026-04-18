import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

import { VALID_ROLES } from "../constants/roles";

import { users } from "../data/users";

export const AuthProvider = ({ children }) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("authUser"));

    if (storedUser && !authUser) {
      setAuthUser(storedUser);
    }
  }, [authUser]);

  const isAuthenticated = !!authUser;

  const login = async (userData) => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = users.find(
        (u) =>
          u.email === userData.email &&
          u.password === userData.password
      );

      if (!foundUser) {
        setAuthError("Credenciales incorrectas");
        return;
      }

      if (!VALID_ROLES.includes(foundUser.role)) {
        setAuthError("Rol no permitido en el sistema");
        return;
      }

      setAuthUser(foundUser);
      localStorage.setItem("authUser", JSON.stringify(foundUser));
    } catch (e) {
      setAuthError(`Error inesperado en el login: ${e.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthUser(null);
      localStorage.removeItem("authUser");

    } catch (e) {
      setAuthError(`Error inesperado en el login: ${e.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        clearAuthError,
        authUser,
        authLoading,
        authError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};