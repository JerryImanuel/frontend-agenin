import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WalletInfo from "../../components/WalletInfo";
import DownlineCarousel from "../../components/DownlineCarousel";
import PageAlertTop from "../../components/PageAlertTop";

import {
  getUserDownline,
  type DownlineUser as Downline,
} from "../../services/AuthAPI/getUserDownline";
import { getUserIdFromAuth } from "../../utils/auth";

// 🔹 Transaksi (Customer Info)
import {
  getAllTransactionsByUser,
  type CustomerOpenBankAccount,
} from "../../services/AuthAPI/getCustomerInfo";

// 🔹 Balance & Wallet service
import { getUserBalanceAndWallet } from "../../services/AuthAPI/getWalletandBalance";

function currency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("id-ID");
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(true);
  const [errorBalance, setErrorBalance] = useState<string | null>(null);

  const [downlines, setDownlines] = useState<Downline[]>([]);
  const [transactions, setTransactions] = useState<CustomerOpenBankAccount[]>(
    []
  );
  const [loadingTrx, setLoadingTrx] = useState(true);
  const [errorTrx, setErrorTrx] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");

        // 🔹 Balance & Wallet
        setLoadingBalance(true);
        const bw = await getUserBalanceAndWallet(userId);
        const { userBalanceAmount, userWalletAmount } = bw.results ?? {
          userBalanceAmount: 0,
          userWalletAmount: 0,
        };

        setBalance(
          typeof userBalanceAmount === "string"
            ? Number(userBalanceAmount)
            : userBalanceAmount || 0
        );
        setWallet(
          typeof userWalletAmount === "string"
            ? Number(userWalletAmount)
            : userWalletAmount || 0
        );
      } catch (e: any) {
        setErrorBalance(e?.message || "Gagal memuat saldo & wallet.");
      } finally {
        setLoadingBalance(false);
      }

      try {
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User ID not found in localStorage");

        const downlineData = await getUserDownline(userId);
        setDownlines(downlineData || []);
      } catch (err) {
        console.error("Error fetching downline:", err);
      }

      try {
        setLoadingTrx(true);
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User ID not found in localStorage");

        const res = await getAllTransactionsByUser(userId);
        if (!res || !Array.isArray(res.results)) {
          throw new Error("Gagal mengambil transaksi pengguna.");
        }
        setTransactions(res.results);
      } catch (err: any) {
        setErrorTrx(err?.message || "Gagal memuat data transaksi.");
      } finally {
        setLoadingTrx(false);
      }
    })();
  }, []);

  // 🔹 Urutkan berdasarkan tanggal terbaru
  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );
  }, [transactions]);

  return (
    <div className="h-full">
      <PageAlertTop />

      {/* Wallet Section */}
      <div
        className="py-2 cursor-pointer active:scale-[0.98] transition"
        onClick={() => navigate("/wallet")}
      >
        <div className="px-5 pt-0">
          <WalletInfo
            balance={wallet}
            loading={loadingBalance}
            error={errorBalance}
          />
        </div>
      </div>

      {/* Downline Section */}
      <div className="mt-2 px-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">Downline Commission</p>
          <Link
            to="/downline"
            className="text-link flex items-center gap-2 text-sm"
          >
            <span className="font-normal text-xs">See Details</span>
            <i className="bx bx-link-external" />
          </Link>
        </div>
        <DownlineCarousel data={downlines} />
      </div>

      {/* Customer Info */}
      <div className="mt-4 px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-medium text-sm">Customer Info</p>
        </div>

        <div className="card bg-white text-primary p-3 rounded-2xl shadow-lg">
          {loadingTrx ? (
            <div className="text-xs text-gray-500">Loading customer info…</div>
          ) : errorTrx ? (
            <div className="text-xs text-red-600">Error: {errorTrx}</div>
          ) : sortedTransactions.length === 0 ? (
            <div className="text-xs text-gray-500">
              No customer info available.
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 pr-4">Deposit</th>
                      <th className="py-2 pr-4">Customer</th>
                      <th className="py-2 pr-4">Contact</th>
                      <th className="py-2 pr-4">Address</th>
                      <th className="py-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((t, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {formatDate(t.transactionDate)}
                        </td>
                        <td className="py-2 pr-4">{t.productName}</td>
                        <td className="py-2 pr-4 font-medium">
                          {currency(Number(t.productPrice || 0))}
                        </td>
                        <td className="py-2 pr-4">{t.customerName || "-"}</td>
                        <td className="py-2 pr-4 text-xs text-gray-600">
                          {t.customerPhoneNumber || "-"}
                          <br />
                          {t.customerEmail || "-"}
                        </td>
                        <td className="py-2 pr-4 text-xs text-gray-600">
                          {t.customerAddress || "-"}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-[11px]">
                            {t.transactionStatus || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {sortedTransactions.map((t, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-gray-200 p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        {t.productName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(t.transactionDate)}
                      </div>
                    </div>
                    <div className="text-xs mt-1 text-gray-600">
                      Deposit:{" "}
                      <span className="font-medium">
                        {currency(Number(t.productPrice || 0))}
                      </span>
                    </div>
                    <div className="mt-2 text-xs">
                      <div className="font-medium">{t.customerName || "-"}</div>
                      <div className="text-gray-500">
                        {t.customerPhoneNumber || "-"} ·{" "}
                        {t.customerEmail || "-"}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {t.customerAddress || "-"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-[11px]">
                        {t.transactionStatus || "-"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
