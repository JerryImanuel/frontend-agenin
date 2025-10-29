import { Outlet, useLocation } from "react-router";
import { useToken } from "../../context/AuthContext";

const ProtectedRoutes = () => {
  const { pathname } = useLocation();

  const { user } = useToken();
  console.log(user?.accessToken, "accs");

  const tokenProtected = ["/", "/wallet", "/downline", "/product", "/profile"];
  const auth = ["/login", "/register"];

  if (tokenProtected.includes(pathname)) {
    if (!user?.accessToken) {
      window.location.href = "/login";
    }
  }

  if (auth.includes(pathname)) {
    if (user?.accessToken) {
      window.location.href = "/";
    }
  }

  return <Outlet />;
};

export default ProtectedRoutes;
