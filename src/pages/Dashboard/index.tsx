// src/pages/Dashboard/index.tsx
import WalletInfo from "../../components/WalletInfo";
import { useWallet } from "../../hooks/useWallet";
import DownlineTable from "../../components/DownlineTable";
import { Link, useNavigate } from "react-router-dom";
import PageAlertTop from "../../components/PageAlertTop";

import { useEffect, useMemo, useState } from "react";
import {
  getUserDownline,
  type DownlineUser as Downline,
} from "../../services/AuthAPI/getUserDownline";
import { getToken, getUserIdFromAuth } from "../../utils/auth";

const Dashboard = () => {
  const { balance, loading, error } = useWallet();
  const navigate = useNavigate();

  const [downlines, setDownlines] = useState<Downline[]>([]);
  const [dlLoading, setDlLoading] = useState(true);
  const [dlError, setDlError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setDlLoading(true);
        setDlError(null);
        const token = getToken() || undefined;
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");
        const data = await getUserDownline(userId, token);
        setDownlines(data || []);
      } catch (e) {
        setDlError((e as Error).message);
      } finally {
        setDlLoading(false);
      }
    })();
  }, []);

  const topDownlines = useMemo(() => downlines.slice(0, 5), [downlines]);

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
            <span className="font-normal text-xs">Lihat Detail</span>
            <i className="bx bx-link-external" />
          </Link>
        </div>

        <div className="card bg-white text-primary px-2 pb-4 pt-1 rounded-2xl shadow">
          <div className="max-h-90 overflow-auto hide-overflow">
            {dlLoading ? (
              <p className="px-3 py-3 text-sm text-gray-500">
                Memuat downline…
              </p>
            ) : dlError ? (
              <p className="px-3 py-3 text-sm text-red-600">{dlError}</p>
            ) : topDownlines.length === 0 ? (
              <div className="h-90 w-full flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <img
                    src="/src/assets/image/empty.png"
                    className="w-27"
                    alt="Empty"
                  />
                </div>
                <p className="px-3 py-3 text-sm text-gray-500">
                  Downline belum tersedia.
                </p>
              </div>
            ) : (
              <DownlineTable data={topDownlines} compact />
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 px-5"></div>
    </div>
  );
};

export default Dashboard;
