import { NavLink, Outlet, useLocation } from "react-router-dom";
import HeaderBar from "../../components/HeaderBar";

export default function RootLayout() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/auth");

  let headerTitle: string | undefined;
  let showGreeting = false;
  if (location.pathname === "/") {
    showGreeting = true;
  } else if (location.pathname.startsWith("/dompet")) {
    headerTitle = "Dompet";
  } else if (location.pathname.startsWith("/downline")) {
    headerTitle = "Downline";
  } else if (location.pathname.startsWith("/produk")) {
    headerTitle = "Produk";
  } else if (location.pathname.startsWith("/profile")) {
    headerTitle = "Profile";
  }

  return (
    <div className="h-screen bg-sky-950 flex items-center justify-center p-4">
      <div className="relative w-[360px] h-[100dvh] max-h-[690px] bg-header rounded-xl shadow-2xl border border-gray-300 overflow-hidden">
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
              <nav className="flex justify-between">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `flex flex-col w-20 items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm ${
                      isActive
                        ? "bg-gray-100 text-sky-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`
                  }
                >
                  <i className="bx bxs-home text-xl" />
                  <span className="text-xs">Beranda</span>
                </NavLink>

                <NavLink
                  to="/dompet"
                  className={({ isActive }) =>
                    `flex flex-col w-20 items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm ${
                      isActive
                        ? "bg-gray-100 text-sky-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`
                  }
                >
                  <i className="bx bxs-wallet text-xl" />
                  <span className="text-xs">Dompet</span>
                </NavLink>

                <NavLink
                  to="/downline"
                  className={({ isActive }) =>
                    `flex flex-col w-20 items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm ${
                      isActive
                        ? "bg-gray-100 text-sky-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`
                  }
                >
                  <i className="bx bx-git-branch text-xl downline-icon" />
                  <span className="text-xs">Downline</span>
                </NavLink>

                <NavLink
                  to="/produk"
                  className={({ isActive }) =>
                    `flex flex-col w-20 items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm ${
                      isActive
                        ? "bg-gray-100 text-sky-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`
                  }
                >
                  <i className="bx bxs-package text-xl" />
                  <span className="text-xs">Produk</span>
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
