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

export interface User {
  accessToken: string;
  userId?: string;
  userFullName?: string;
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
