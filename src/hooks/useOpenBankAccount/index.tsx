import { useState, useCallback } from "react";
import {
  createInquiry,
  type TransactionRequest,
  type Transaction,
  type TransactionResponse,
} from "../../services/AuthAPI/openBankAccount";

export function useInquiry() {
  const [loading, setLoading] = useState(false);
  const [latest, setLatest] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitInquiry = useCallback(
    async (params: {
      userId: string;
      productId: string;
      payload: TransactionRequest;
    }) => {
      setLoading(true);
      setError(null);
      try {
        // 🔹 Panggil API
        const resp: TransactionResponse = await createInquiry(
          params.userId,
          params.productId,
          params.payload
        );

        // 🔹 Ambil hasil (Transaction) dari results
        setLatest(resp.results);
        return resp.results;
      } catch (e: any) {
        setError(e?.message ?? "Gagal melakukan inquiry.");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLatest(null);
    setError(null);
    setLoading(false);
  }, []);

  return { loading, latest, error, submitInquiry, reset, setLatest };
}
