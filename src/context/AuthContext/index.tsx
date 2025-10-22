import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setAxiosConfig } from "../../services/api";
import { fetchUserProfile } from "../../services/AuthAPI/getProfile";

export type Role = "ADMIN" | "AGENT";

export interface User {
  accessToken: string;
  userId?: string;
  userFullName?: string;
  roleName?: Role;
}

function toRole(v: unknown): Role | undefined {
  return v === "ADMIN" || v === "AGENT" ? v : undefined;
}

interface Context {
  user: User | null;
  changeUser: (user: User | null) => void;
  logout: () => void;
}

interface Props {
  children: ReactNode;
}

const contextValue: Context = {
  user: {
    accessToken: "",
    userFullName: "",
  },
  changeUser: () => {},
  logout: () => {},
};

const TokenContext = createContext<Context>(contextValue);

export const TokenProvider = ({ children }: Readonly<Props>) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? (JSON.parse(storedUser) as User)
      : {
          accessToken: "",
          userId: "",
          userFullName: "",
        };
  });

  const changeUser = useCallback((next: User | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem("user", JSON.stringify(next));
      localStorage.setItem("token", next.accessToken);
      localStorage.setItem("userId", next.userId || "");
      window.location.href = "/";
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const logout = useCallback(() => {
    if (user) {
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [user]);

  const tokenContextValue = useMemo(
    () => ({ user, changeUser, logout }),
    [user, changeUser, logout]
  );

  useEffect(() => {
    if (user?.accessToken) {
      setAxiosConfig(user.accessToken);

      if (!user.roleName) {
        (async () => {
          try {
            const p = await fetchUserProfile();
            setUser((prev) => {
              if (!prev) return prev;
              const merged = {
                ...prev,
                userId: p.userId,
                userFullName: p.userFullName,
                roleName: toRole(p.roleName),
              };
              localStorage.setItem("user", JSON.stringify(merged));
              return merged;
            });
          } catch {
            // optional: Notifikasi Logout
          }
        })();
      }
    }
  }, [user]);

  return (
    <TokenContext.Provider value={tokenContextValue}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("Error, useToken must be use within TokenContext");
  }
  return context;
};

export { toRole };
