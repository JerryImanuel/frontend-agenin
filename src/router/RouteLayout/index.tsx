import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";
import { useToken } from "../../context/AuthContext";

const NAV_BY_ROLE = {
  ADMIN: [
    // { to: "/downline", icon: "bx bx-git-branch", label: "Downline" },
    { to: "/product", icon: "bx bxs-package", label: "Product" },
  ],
  AGENT: [
    { to: "/", icon: "bx bxs-home", label: "Home" },
    { to: "/wallet", icon: "bx bxs-wallet", label: "Wallet" },
    { to: "/downline", icon: "bx bx-git-branch", label: "Downline" },
    { to: "/product", icon: "bx bxs-package", label: "Product" },
  ],
} as const;

export default function RootLayout() {
  const location = useLocation();
  const { user } = useToken();
  const role = (user?.roleName ?? "AGENT") as "ADMIN" | "AGENT";
  const navItems = NAV_BY_ROLE[role] ?? NAV_BY_ROLE.AGENT;

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/auth");

  let headerTitle: string | undefined;
  let showGreeting = false;
  if (location.pathname === "/") {
    showGreeting = true;
  } else if (location.pathname.startsWith("/wallet")) {
    headerTitle = "Wallet";
  } else if (location.pathname.startsWith("/downline")) {
    headerTitle = "Downline";
  } else if (location.pathname.startsWith("/product")) {
    headerTitle = "Product";
  } else if (location.pathname.startsWith("/profile")) {
    headerTitle = "Profile";
  }

  if (!isAuthRoute && location.pathname === "/" && role === "ADMIN") {
    return <Navigate to="/produk" replace />;
  }

  return (
    <div className="h-screen">
      <div className="relative h-screen bg-header shadow-2xl border border-gray-300 overflow-hidden">
        <div className="flex flex-col h-full">
          {!isAuthRoute && (
            <HeaderBar
              title={headerTitle}
              showGreeting={showGreeting}
              className="flex-none"
            />
          )}

          <main className="flex-1 overflow-y-auto hide-scrollbar bg-background-gradient">
            <Outlet />
          </main>

          {!isAuthRoute && (
            <div
              className="flex-none bg-white border-t border-gray-200 p-2 z-50"
              role="navigation"
            >
              <nav className="flex justify-between gap-1">
                {(navItems ?? []).map(({ to, icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      `flex flex-col w-full items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm ${
                        isActive
                          ? "bg-gray-100 text-sky-900"
                          : "text-gray-500 hover:bg-gray-50"
                      }`
                    }
                  >
                    <i className={`${icon} text-xl`} />
                    <span className="text-xs">{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
