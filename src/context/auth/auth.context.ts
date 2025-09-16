import { createContext, use } from "react";
import type { ResponseType, User } from "./types/authTypes";

interface AuthContextType<T> {
  isAuthenticated: boolean;
  user: T | null;
  login: (response: ResponseType<T>) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType<User>);

export const useAuth = <T>() => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context as AuthContextType<T>;
};
