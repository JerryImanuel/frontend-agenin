import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WalletInfo from "../../components/WalletInfo";
import DownlineCarousel from "../../components/DownlineCarousel";
import PageAlertTop from "../../components/PageAlertTop";
import TransactionTable from "../../components/TransactionTable";

import {
  getUserDownline,
  type DownlineUser as Downline,
} from "../../services/AuthAPI/getUserDownline";
import { getToken, getUserIdFromAuth } from "../../utils/auth";
import { useWallet } from "../../hooks/useWallet";

const Dashboard = () => {
  const navigate = useNavigate();
  const { balance, loading, error } = useWallet();

  const [downlines, setDownlines] = useState<Downline[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken() || undefined;
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");
        const data = await getUserDownline(userId, token);
        setDownlines(data || []);
      } catch (e) {
        console.error("Gagal memuat downline:", (e as Error).message);
      }
    })();
  }, []);

  return (
    <div className="h-full">
      <PageAlertTop />

      <div
        className="py-2 cursor-pointer active:scale-[0.98] transition"
        onClick={() => navigate("/dompet")}
      >
        <div className="px-5 pt-0">
          <WalletInfo balance={balance} loading={loading} error={error} />
        </div>
      </div>

      <div className="mt-2 px-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">Komisi Downline</p>
          <Link
            to="/downline"
            className="text-link flex items-center gap-2 text-sm"
          >
            <span className="font-normal text-xs">Lihat Detail</span>
            <i className="bx bx-link-external" />
          </Link>
        </div>

        <DownlineCarousel data={downlines} />
      </div>

      <div className="mt-4 px-5">
        <p className="font-medium text-sm mb-3">Log Transaksi</p>
        <div className="card bg-white text-primary px-2 pb-4 pt-1 rounded-2xl shadow">
          <TransactionTable compact />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
