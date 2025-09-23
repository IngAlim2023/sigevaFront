import { useState, type PropsWithChildren } from "react";
import { AuthContext } from "./auth.context";
import type { Aprendiz, Gestor, ResponseType, User, UserNormalizado } from "./types/authTypes";
import toast from "react-hot-toast";


export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserNormalizado | null>(null);

  const login = (response: ResponseType<User>) => {
    if (!response.success) {
      setIsAuthenticated(false);
      setUser(null);
      toast.error("Correo o contraseña incorrectos");
      return;
    }
    
    if (
        response.data?.estado.toLowerCase() != "activo" && 
        response.data?.estado.toLowerCase() != "en formacion"
      ){
      toast.error("Usuario desactivado!");
      return
    }

    const rawUser = response.data!;

    const normalizado : UserNormalizado = {
      ...rawUser,
      centroFormacion:
        "centroFormacion" in rawUser
          ? (rawUser as Gestor).centroFormacion
          : (rawUser as Aprendiz).centroFormacionIdcentroFormacion,
    };

    setIsAuthenticated(true);
    setUser(normalizado);
    toast.success("Inicio de sesión exitoso!");
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Se cerró la sesión correctamente!");
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
