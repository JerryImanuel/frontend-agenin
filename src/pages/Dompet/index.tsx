import { useState } from "react";
import WalletInfo from "../../components/WalletInfo";
import { useWallet } from "../../hooks/useWallet";
import { useCommission } from "../../hooks/useCommission";
import { useAlert } from "../../context/AlertContext";
import CommissionInfo from "../../components/CommissionInfo";
import PageAlertTop from "../../components/PageAlertTop";

export default function Dompet() {
  const { balance, loading: walletLoading, error: walletError } = useWallet();
  const {
    commission,
    loading: commissionLoading,
    error: commissionError,
    transfer,
  } = useCommission();
  const { showAlert } = useAlert();

  const [amountStr, setAmountStr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const amount = Number(amountStr.replace(/\D/g, "")) || 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await transfer(amount);
    setSubmitting(false);

    if (res.success) {
      showAlert(
        `Transfer berhasil. Rp${amount.toLocaleString(
          "id-ID"
        )} ditambahkan ke saldo.`,
        "success"
      );
      setAmountStr("");
    } else {
      showAlert(res.message || "Transfer gagal.", "error");
    }
  };

  return (
    <div className="px-5 py-2">
      <PageAlertTop />

      <CommissionInfo
        commission={commission}
        loading={commissionLoading}
        error={commissionError}
        className="mb-2"
      />

      <WalletInfo
        balance={balance ?? 0}
        loading={walletLoading}
        error={walletError}
      />

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
            className="w-full border text-xs border-gray-300 rounded-xl px-3 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
            placeholder="Fill Amount"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            required
          />

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
