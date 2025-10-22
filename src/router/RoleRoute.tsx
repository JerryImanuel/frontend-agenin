import { Navigate } from "react-router-dom";
import { useToken } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";
import type { ReactElement } from "react";

interface RoleRouteProps {
  roles: Role[];
  children: ReactElement;
}

export default function RoleRoute({ roles, children }: RoleRouteProps) {
  const { user } = useToken();

  if (!user?.accessToken) return <Navigate to="/login" replace />;

  if (!user.roleName) return children;

  return roles.includes(user.roleName) ? children : <Navigate to="/" replace />;
}
