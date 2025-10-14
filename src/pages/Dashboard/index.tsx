import WalletInfo from "../../components/WalletInfo";
import { useWallet } from "../../hooks/useWallet";
import DownlineTable from "../../components/DownlineTable";
import { Link, useNavigate } from "react-router-dom";
import PageAlertTop from "../../components/PageAlertTop";

const Dashboard = () => {
  const { balance, loading, error } = useWallet();
  const navigate = useNavigate();

  const downlineData = [
    { id: 1, name: "Budi Santoso", dateCreated: "2025-10-01" },
    { id: 2, name: "Siti Aisyah", dateCreated: "2025-09-28" },
    { id: 3, name: "Andi Pratama", dateCreated: "2025-09-30" },
    { id: 4, name: "Ahmad Bustomi", dateCreated: "2025-10-01" },
    { id: 5, name: "Tardi Manalu", dateCreated: "2025-10-02" },
    { id: 6, name: "David Corenswet", dateCreated: "2025-10-03" },
    { id: 7, name: "Andrew Garfield", dateCreated: "2025-10-04" },
  ];

  return (
    <div className="h-full">
      <PageAlertTop />
      <div
        className="py-2 cursor-pointer active:scale-[0.98] transition"
        onClick={() => navigate("/dompet")}
      >
        <div className="p-5 pt-0">
          <WalletInfo balance={balance} loading={loading} error={error} />
        </div>
      </div>

      <div className="mt-2 px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm">Downline</p>
          <Link
            to="/downline"
            className="text-link flex items-center gap-2 text-sm"
          >
            <span className="font-normal">Lihat Detail</span>
            <i className="bx bx-link-external" />
          </Link>
        </div>

        <div className="card bg-white text-primary px-2 pb-4 pt-1 rounded-2xl shadow">
          <DownlineTable data={downlineData} compact />
        </div>
      </div>

      <div className="mt-2 px-5"></div>
    </div>
  );
};

export default Dashboard;
