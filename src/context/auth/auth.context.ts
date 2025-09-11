import { createContext, useContext } from "react";
import type { ResponseType, User } from "./types/authTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (response: ResponseType) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
