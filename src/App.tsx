import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Dompet from "./components/Dompet";
import Downline from "./components/Downline";

function App() {
  const [active, setActive] = useState("beranda");

  const renderPage = () => {
    switch (active) {
      case "beranda":
        return <Dashboard />;
      case "dompet":
        return <Dompet />;
      case "downline":
        return <Downline />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar active={active} setActive={setActive} />
      {renderPage()}
    </div>
  );
}

export default App;
