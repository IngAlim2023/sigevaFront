import { useState, type PropsWithChildren } from "react";
import { AuthContext } from "./auth.context";
import type { ResponseType } from "./types/authTypes";

export function AuthProvider<T>({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<T | null>(null);

  const login = (response: ResponseType<T>) => {
    if (!response.success) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    setIsAuthenticated(true);
    setUser(response.data ?? null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
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
