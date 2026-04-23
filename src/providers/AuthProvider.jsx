import { useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useData } from "../hooks/useData";

import { VALID_ROLES, ROLES_MAP } from "../constants/roles";
export const AuthProvider = ({ children }) => {
  const { getTable } = useData();
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authError, setAuthError] = useState(null);

  const isAuthenticated = !!authUser;

  const login = async (userData) => {
    try {
      setAuthLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const usuarios = getTable('usuarios');

      const foundUser = usuarios.find(
        (u) =>
          u.email === userData.email &&
          u.contraseña === userData.password
      );

      if (!foundUser) {
        setAuthError("Credenciales incorrectas");
        return { success: false };
      }

      const roleName = ROLES_MAP[foundUser.id_rol];

      if (!VALID_ROLES.includes(roleName)) {
        setAuthError("Rol no permitido en el sistema");
        return { success: false };
      }

      const sessionUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        id_condominio: foundUser.id_condominio,
        role: roleName
      };

      setAuthUser(sessionUser);
      
      if (userData.rememberMe) {
        localStorage.setItem("authUser", JSON.stringify(sessionUser));
      } else {
        sessionStorage.setItem("authUser", JSON.stringify(sessionUser));
      }

      return { success: true };
    } catch (e) {
      setAuthError(`Error inesperado al iniciar sesión: ${e.message}`);
      return { success: false, error: e.message };
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
      sessionStorage.removeItem("authUser");
      return { success: true };
    } catch (e) {
      setAuthError(`Error inesperado al cerrar sesión: ${e.message}`);
      return { success: false, error: e.message };
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