import React, { createContext, useState } from "react";
import { verifyLogin } from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return { ok: false, error: "Enter your username to continue." };

    const authUser = verifyLogin(trimmedUsername, password);
    if (!authUser) return { ok: false, error: "Incorrect username or password." };

    setUser({ role: authUser.role, name: authUser.name });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const value = { user, login, logout, isSuper: user?.role === "Super Admin" };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
