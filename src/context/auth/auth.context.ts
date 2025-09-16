import { createContext, use } from "react";
import type { UserNormalizado } from "./types/authTypes";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserNormalizado | null;
  login: (response: any) => void;   
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
