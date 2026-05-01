import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
// Importación directa para asegurar que los datos existan como respaldo
import { usuarios as usuariosLocales } from "../data/usuario"; 
import { useData } from "../hooks/useData";

import { VALID_ROLES, ROLES_MAP } from "../constants/roles";
import { RESET_TOKEN_KEY, RESET_TOKEN_TTL } from "../constants/resetToken";

export const AuthProvider = ({ children }) => {
  const { getTable } = useData();

  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authError, setAuthError] = useState(null);

  const usuariosData = getTable("usuarios");

  // Efecto para verificar la validez de la sesión activa
  useEffect(() => {
    if (authUser) {
      const fuente = Array.isArray(usuariosData) && usuariosData.length > 0 
        ? usuariosData 
        : usuariosLocales;

      const currentUser = fuente.find(u => u.id === authUser.id);

      if (!currentUser || !currentUser.activo) {
        // eslint-disable-next-line react-hooks/immutability
        logout();
      }
    }
  }, [usuariosData, authUser]);

  const isAuthenticated = !!authUser;

  const login = async (userData) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Prioridad a la tabla dinámica, respaldo en el archivo estático
      const usuarios = Array.isArray(usuariosData) && usuariosData.length > 0 
        ? usuariosData 
        : usuariosLocales;

      // 1. Normalizamos la entrada del formulario
      const inputEmail = userData.email.trim().toLowerCase();
      
      // Captura flexible: acepta .password o .pass desde el formulario
      const inputPassword = String(userData.password || userData.pass || "").trim();

      // DEBUG para confirmar qué estamos comparando
      console.log("--- PROCESO DE AUTENTICACIÓN ---");
      console.log("Buscando Email:", inputEmail);
      console.log("Buscando Password:", inputPassword);

      // 2. Búsqueda con "Súper Poderes" (busca cualquier variante de nombre de propiedad)
      const foundUser = usuarios.find((u) => {
        // Normalizamos email del JSON/Array
        const uEmail = String(u.email || u.correo || "").trim().toLowerCase();
        
        // Normalizamos contraseña del JSON/Array (acepta contraseña, password o pass)
        const uPass = String(u.contraseña || u.password || u.pass || "").trim();
        
        return uEmail === inputEmail && uPass === inputPassword;
      });

      if (!foundUser) {
        console.warn("RESULTADO: No se encontró ningún usuario con esas credenciales.");
        setAuthError("Credenciales incorrectas");
        return { success: false };
      }

      // 3. Validación de Rol
      const roleName = ROLES_MAP[foundUser.id_rol];
      if (!roleName || !VALID_ROLES.includes(roleName)) {
        console.error("ERROR DE ROL:", foundUser.id_rol, "no existe en ROLES_MAP");
        setAuthError("El usuario no tiene un rol válido asignado.");
        return { success: false };
      }

      if (!foundUser.activo) {
        setAuthError("Tu cuenta ha sido desactivada.");
        return { success: false };
      }

      // 4. Creación de la sesión de usuario
      const sessionUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        id_condominio: foundUser.id_condominio,
        role: roleName,
      };

      setAuthUser(sessionUser);

      // Persistencia según "Recuérdame"
      const storage = userData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("authUser", JSON.stringify(sessionUser));

      console.info("¡Acceso concedido!", sessionUser.nombre);
      return { success: true };

    } catch (e) {
      console.error("Error crítico en AuthProvider:", e);
      setAuthError("Error inesperado en el sistema.");
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAuthUser(null);
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    setAuthLoading(false);
    return { success: true };
  };

  const clearAuthError = () => setAuthError(null);

  // Mantener las funciones de recuperación vacías o con su lógica previa
  const forgotPassword = async () => ({ success: true });
  const validateResetToken = () => ({ valid: true });
  const resetPassword = async () => ({ success: true });

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