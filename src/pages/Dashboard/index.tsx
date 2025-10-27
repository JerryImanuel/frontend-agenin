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
        onClick={() => navigate("/dompet")}
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
          <p className="font-medium text-sm">Customer Transaction</p>
        </div>

        <div className="card">
          {loadingTrx ? (
            <div className="card bg-white text-primary p-3 rounded-2xl shadow-sm">
              <div className="text-xs text-gray-500">
                Loading customer info…
              </div>
            </div>
          ) : errorTrx ? (
            <div className="card bg-white text-primary p-3 rounded-2xl shadow-lg">
              <div className="text-xs text-red-600">Error: {errorTrx}</div>
            </div>
          ) : sortedTransactions.length === 0 ? (
            <div className="card bg-white text-primary p-3 rounded-2xl shadow-sm">
              <div className="text-xs text-gray-500">
                No customer info available.
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white py-3 px-4 rounded-2xl shadow-sm h-70 overflow-auto">
                {sortedTransactions.map((t, idx) => (
                  <div
                    key={idx}
                    className="text-primary border-b-1 border-gray-300 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold">
                        {t.productName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(t.transactionDate)}
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between mt-1">
                      <span className="text-xs text-gray-600 ">
                        Min. Deposit
                      </span>
                      <span className="font-semibold text-sky-950">
                        {currency(Number(t.productPrice || 0))}
                      </span>
                    </div>
                    <hr className="border-dashed my-2 border-gray-200" />

                    <div className="mt-2 text-xs">
                      <div className="flex flex-row items-center justify-between">
                        <div className="font-medium">
                          {t.customerName || "-"}
                        </div>
                        <div>{t.customerPhoneNumber || "-"} · </div>
                      </div>
                      <div className="text-gray-500 mt-1">
                        {t.customerEmail || "-"}
                      </div>
                      <div className="text-gray-500 text-[11px] truncate max-w-[300px] mt-1">
                        {t.customerAddress || "-"}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="bg-blue-200 text-sky-800 px-2 py-1 rounded-lg text-[11px]">
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
