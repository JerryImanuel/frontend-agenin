import { useEffect, useState } from "react";
import { getUserIdFromAuth } from "../../utils/auth";
import { getUserBalanceAndWallet } from "../../services/AuthAPI/getWalletandBalance";

export function useWallet() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");

        // 🔹 Fetch saldo & wallet
        const resp = await getUserBalanceAndWallet(userId);

        // 🔹 Ambil hasil utama dari results (karena API return { status, message, results })
        const results = resp.results ?? {
          userWalletAmount: 0,
          userBalanceAmount: 0,
        };

        // 🔹 Normalisasi agar string BigDecimal dari backend jadi number
        const userWalletAmount =
          typeof results.userWalletAmount === "string"
            ? Number(results.userWalletAmount)
            : results.userWalletAmount ?? 0;
        setBalance(userWalletAmount);
      } catch (e: any) {
        setError(e?.message ?? "Gagal memuat saldo.");
        setBalance(0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Expose state dan setter agar bisa di-update manual dari komponen lain
  return { balance, setBalance, loading, error };
}
