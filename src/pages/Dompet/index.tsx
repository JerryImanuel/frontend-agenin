import { useEffect, useState } from "react";
import WalletInfo from "../../components/WalletInfo";
import { useAlert } from "../../context/AlertContext";
import CommissionInfo from "../../components/CommissionInfo";
import PageAlertTop from "../../components/PageAlertTop";
import { getUserIdFromAuth } from "../../utils/auth";
import { getUserBalanceAndWallet } from "../../services/AuthAPI/getWalletandBalance";
import { commissionToWallet } from "../../services/AuthAPI/balanceToWallet";

export default function Dompet() {
  const { showAlert } = useAlert();

  const [commissionDisplay, setCommissionDisplay] = useState<number>(0);
  const [walletDisplay, setWalletDisplay] = useState<number>(0);
  const [loadingBW, setLoadingBW] = useState<boolean>(true);
  const [errorBW, setErrorBW] = useState<string | null>(null);

  const [amountStr, setAmountStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function fetchBalanceAndWallet() {
    try {
      setLoadingBW(true);
      setErrorBW(null);

      const userId = getUserIdFromAuth();
      if (!userId) throw new Error("User not logged in.");

      // Service sudah menormalisasi ke number/string di results
      const resp = await getUserBalanceAndWallet(userId);
      const { userBalanceAmount, userWalletAmount } = resp.results ?? {
        userBalanceAmount: 0,
        userWalletAmount: 0,
      };

      setCommissionDisplay(
        typeof userBalanceAmount === "string"
          ? Number(userBalanceAmount)
          : userBalanceAmount || 0
      );
      setWalletDisplay(
        typeof userWalletAmount === "string"
          ? Number(userWalletAmount)
          : userWalletAmount || 0
      );
    } catch (e: any) {
      setErrorBW(e?.message ?? "Gagal memuat saldo & wallet.");
      setCommissionDisplay(0);
      setWalletDisplay(0);
    } finally {
      setLoadingBW(false);
    }
  }

  // Fetch pertama kali
  useEffect(() => {
    fetchBalanceAndWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit top up → pakai commissionToWallet service baru
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bersihkan input: izinkan desimal, hapus karakter lain
    const cleaned = amountStr.replace(/[^\d.]/g, "");
    const amount = Number(cleaned);

    if (!Number.isFinite(amount) || amount < 0.01) {
      showAlert("Minimal transfer adalah 0.01.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const userId = getUserIdFromAuth();
      if (!userId) throw new Error("User not logged in.");

      const resp = await commissionToWallet(userId, cleaned);
      showAlert(resp.message || "Transfer berhasil.", "success");
      setAmountStr("");

      // refresh angka dari backend
      fetchBalanceAndWallet();
    } catch (err: any) {
      showAlert(err?.message ?? "Transfer gagal.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-5 py-2">
      <PageAlertTop />

      {/* commissions ← results.userBalanceAmount */}
      <CommissionInfo
        commission={commissionDisplay}
        loading={loadingBW}
        error={errorBW}
        className="mb-2"
      />

      {/* wallet/balance ← results.userWalletAmount */}
      <WalletInfo balance={walletDisplay} loading={loadingBW} error={errorBW} />

      {/* ⬇️ Bagian Top Up Balance */}
      <div className="mt-4">
        <p className="text-sm font-medium mb-3">
          Top Up Balance from Commission
        </p>

        <div className="py-4 px-5 rounded-2xl bg-amber-50 text-xs text-amber-800 mb-4">
          Transfer income from commissions to add and update your Agenin wallet
          balance.
        </div>

        <div className="flex items-center justify-center my-5">
          <img src="/src/assets/image/topup.png" className="w-30" alt="Topup" />
        </div>

        <form onSubmit={onSubmit}>
          <input
            className="w-full border text-xs border-gray-300 rounded-xl px-3 py-3 mb-2 focus:outline-none focus:ring-2 focus:ring-sky-900"
            placeholder="Fill Amount (min 0.01)"
            value={amountStr}
            onChange={(e) =>
              setAmountStr(e.target.value.replace(/[^\d.]/g, ""))
            }
            required
          />

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border text-xs bg-white border-gray-300 rounded-xl px-3 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
              placeholder="Password"
              required
              name="userPassword"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none mb-1"
              aria-label={showPassword ? "Hide Password" : "Show Password"}
            >
              <i
                className={`bx ${
                  showPassword
                    ? "bx-show text-sky-900"
                    : "bx-hide text-gray-400"
                } text-lg`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-sky-900 border-2 border-sky-900 text-white text-sm py-2 rounded-2xl font-normal hover:bg-primary/90 transition disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Top Up Balance"}
          </button>
        </form>
      </div>
    </div>
  );
}
