import { useEffect, useState } from "react";

export function useWallet() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // TODO: ganti ke API real
        await new Promise((r) => setTimeout(r, 300));
        setBalance(180_000_000);
      } catch (e) {
        setError("Gagal memuat saldo.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // !! penting: expose setBalance supaya bisa di-update dari hook komisi
  return { balance, setBalance, loading, error };
}
