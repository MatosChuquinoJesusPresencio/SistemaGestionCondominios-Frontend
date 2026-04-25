import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useData } from "../hooks/useData";

import { VALID_ROLES, ROLES_MAP } from "../constants/roles";
import { RESET_TOKEN_KEY, RESET_TOKEN_TTL } from "../constants/resetToken";

export const AuthProvider = ({ children }) => {
  const { getTable, updateTable } = useData();

  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authError, setAuthError] = useState(null);
  
  const usuariosData = getTable("usuarios");

  useEffect(() => {
    if (authUser) {
      const currentUser = usuariosData.find(u => u.id === authUser.id);

      if (!currentUser || !currentUser.activo) {
        logout();
      }
    }
  }, [usuariosData, authUser]);

  const isAuthenticated = !!authUser;

  const login = async (userData) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const usuarios = getTable("usuarios");
      const foundUser = usuarios.find(
        (u) => u.email === userData.email && u.contraseña === userData.password
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

      if (!foundUser.activo) {
        setAuthError("Tu cuenta ha sido desactivada.");
        return { success: false };
      }

      const sessionUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        id_condominio: foundUser.id_condominio,
        role: roleName,
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
      setAuthError(null);
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

  const forgotPassword = async (email) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const usuarios = getTable("usuarios");
      const userExists = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        const token = crypto.randomUUID();
        const payload = {
          token,
          email: userExists.email,
          expiresAt: Date.now() + RESET_TOKEN_TTL,
        };
        localStorage.setItem(RESET_TOKEN_KEY, JSON.stringify(payload));

        console.info(
          `[SIMULACIÓN] Enlace de recuperación:\n` +
          `http://localhost:5173/reset-password?token=${token}`
        );
      }

      return { success: true };
    } catch (e) {
      setAuthError(`Error inesperado: ${e.message}`);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const validateResetToken = (token) => {
    if (!token) return { valid: false, reason: "No se proporcionó un token." };

    const raw = localStorage.getItem(RESET_TOKEN_KEY);
    if (!raw) return { valid: false, reason: "El enlace no es válido o ya fue utilizado." };

    try {
      const payload = JSON.parse(raw);

      if (payload.token !== token) {
        return { valid: false, reason: "El token no coincide." };
      }

      if (Date.now() > payload.expiresAt) {
        localStorage.removeItem(RESET_TOKEN_KEY);
        return { valid: false, reason: "El enlace ha expirado. Solicita uno nuevo." };
      }

      return { valid: true, email: payload.email };
    } catch {
      return { valid: false, reason: "Token malformado." };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const { valid, reason, email } = validateResetToken(token);
      if (!valid) {
        setAuthError(reason);
        return { success: false };
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const usuarios = getTable("usuarios");
      const updatedUsuarios = usuarios.map((u) =>
        u.email === email ? { ...u, contraseña: newPassword } : u
      );
      updateTable("usuarios", updatedUsuarios);

      localStorage.removeItem(RESET_TOKEN_KEY);

      console.info(`[SIMULACIÓN] Contraseña actualizada para: ${email}`);

      return { success: true };
    } catch (e) {
      setAuthError(`Error inesperado: ${e.message}`);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authUser,
        authLoading,
        authError,
        login,
        logout,
        forgotPassword,
        validateResetToken,
        resetPassword,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};