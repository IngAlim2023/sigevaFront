import { createContext, useContext } from "react";
import type { ResponseType } from "./types/authTypes";

interface AuthContextType<T> {
  isAuthenticated: boolean;
  user: T | null;
  login: (response: ResponseType<T>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType<any>>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = <T>() => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context as AuthContextType<T>;
};
