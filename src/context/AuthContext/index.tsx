import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login, type LoginPayload } from "../../services/AuthAPI";
import type { User } from "../../types/User";

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthContextValue = AuthState & {
  loginWithPassword: (p: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // restore dari localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const cachedUser = localStorage.getItem("user");
    if (token) {
      setAccessToken(token);
    }
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {}
    }
  }, []);

  const loginWithPassword = async (p: LoginPayload) => {
    const res = await login(p);
    setAccessToken(res.accessToken);
    localStorage.setItem("accessToken", res.accessToken);

    // opsional: ambil profil fresh via /auth/me
    const me = await getMe(res.accessToken);
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  };

  const value = useMemo(
    () => ({ user, accessToken, loginWithPassword, logout }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
