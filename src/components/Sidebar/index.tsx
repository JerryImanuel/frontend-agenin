import type { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
}

const Sidebar = ({ active, setActive }: SidebarProps) => {
  const menu = [
    { key: "beranda", label: "Beranda", icon: "bx bxs-home" },
    { key: "dompet", label: "Dompet", icon: "bx bxs-wallet" },
    { key: "downline", label: "Downline", icon: "bx bxs-user-plus" },
  ];

  return (
    <div className="w-90 h-screen bg-agenin text-white flex flex-col px-7 py-10 shadow-sidebar">
      {/* Logo */}
      <div
        className="flex items-center gap-2 mb-8 cursor-pointer"
        onClick={() => setActive("beranda")}
      >
        <img
          src="/src/assets/image/logo-agenin.png"
          className="w-8 h-8"
          alt="Logo"
        />
        <span className="text-xl font-medium ml-2">Agenin</span>
      </div>

      {/* Menu */}
      <ul className="space-y-3">
        {menu.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl cursor-pointer transition ${
              active === item.key ? "bg-menu-selected" : "hover:bg-[#315071]"
            }`}
            onClick={() => setActive(item.key)}
          >
            <i className={`${item.icon} text-2xl mr-4`}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
