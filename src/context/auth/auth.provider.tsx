import { type ReactNode, useState } from "react";
import { AuthContext } from "./auth.context";
import type { ResponseType, User } from "./types/authTypes";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (response: ResponseType) => {
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
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
