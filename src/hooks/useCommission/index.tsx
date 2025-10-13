import { useEffect, useState } from "react";
import { useWallet } from "../useWallet";

type TransferResult = { success: boolean; message: string };

export function useCommission() {
  const { setBalance } = useWallet(); // pakai setter dari wallet
  const [commission, setCommission] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // TODO: ganti ke API real: GET /commission
        await new Promise((r) => setTimeout(r, 250));
        setCommission(570_000); // mock awal
      } catch (e) {
        setError("Gagal memuat komisi.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function transfer(amount: number): Promise<TransferResult> {
    if (!commission && commission !== 0)
      return { success: false, message: "Komisi belum tersedia." };
    if (amount <= 0)
      return { success: false, message: "Jumlah harus lebih dari nol." };
    if (amount > commission)
      return { success: false, message: "Saldo komisi tidak mencukupi." };

    try {
      // TODO: ganti ke API real: POST /commission/transfer { amount }
      await new Promise((r) => setTimeout(r, 600)); // fake delay

      // update komisi lokal
      setCommission((prev) => (prev ?? 0) - amount);

      // tambahkan ke saldo wallet
      setBalance((prev) => (prev ?? 0) + amount);

      return { success: true, message: "Transfer berhasil." };
    } catch (e) {
      return {
        success: false,
        message: "Gagal melakukan transfer. Coba lagi.",
      };
    }
  }

  return { commission, loading, error, transfer };
}
