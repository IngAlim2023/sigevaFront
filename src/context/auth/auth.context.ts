import { createContext, use } from "react";
import type { ResponseType, User } from "./types/authTypes";

interface AuthContextType<T> {
  isAuthenticated: boolean;
  user: T | null;
  login: (response: ResponseType<T>) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType<User>>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
