import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import logoAgenin from "@/assets/image/logo-agenin.png";

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row w-screen h-screen bg-light-background">
      <aside
        className="w-85 bg-agenin text-white flex flex-col px-5 shadow-sidebar"
        role="navigation"
      >
        <Link
          to="/"
          className="flex items-center gap-2 mb-8 p-6 cursor-pointer"
        >
          <img src={logoAgenin} className="w-8 h-8" alt="Logo Agenin" />
          <span className="text-xl font-medium ml-2">Agenin</span>
        </Link>
        <nav className="px-2 space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                isActive ? "bg-menu-selected" : "hover:bg-white/10"
              }`
            }
          >
            <i className="bx bxs-home"></i>
            <span>Beranda</span>
          </NavLink>
          <NavLink
            to="/dompet"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                isActive ? "bg-menu-selected" : "hover:bg-white/10"
              }`
            }
          >
            <i className="bx bxs-wallet"></i>
            <span>Dompet</span>
          </NavLink>
          <NavLink
            to="/downline"
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                isActive ? "bg-menu-selected" : "hover:bg-white/10"
              }`
            }
          >
            <i className="bx bx-git-branch downline-icon"></i>
            <span>Downline</span>
          </NavLink>
        </nav>
      </aside>
      <main className="w-full px-8 py-5 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
