import { useState, type PropsWithChildren } from "react";
import { AuthContext } from "./auth.context";
import type { ResponseType, User } from "./types/authTypes";
import toast from "react-hot-toast";

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (response: ResponseType<User>) => {
    if (!response.success) {
      setIsAuthenticated(false);
      setUser(null);
      toast.error("Correo o contraseña incorrectos");
      return;
    }

    setIsAuthenticated(true);
    setUser(response.data ?? null);
    toast.success("Inicio de Sesión Exitoso!");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Se cerró la Sesión Correctamente!");
  };

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}
