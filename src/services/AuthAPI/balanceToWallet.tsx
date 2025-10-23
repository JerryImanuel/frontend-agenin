// services/AuthAPI/commissionToWallet.ts
import API from "../api";

/** ===== Types ===== */
export interface CommissionToWalletRequest {
  /** >= 0.01 sesuai @DecimalMin */
  amountToWallet: number | string;
}

export interface CommissionToWalletResult {
  userId: string;
  userBalanceAmount: number;
  userWalletAmount: number;
  userBalanceLastUpdated: string;
}

export interface CommissionToWalletResponse {
  status: number;
  message: string;
  error: string | null;
  results: CommissionToWalletResult;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PATH = "/api/v1/transaction/transfer-to-wallet";

export async function commissionToWallet(
  userId: string,
  amount: number | string
): Promise<CommissionToWalletResponse> {
  if (!userId) throw new Error("userId wajib diisi.");
  const numeric = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(numeric) || numeric < 0.01) {
    throw new Error("Minimal transfer adalah 0.01.");
  }

  try {
    const { data, status } = await API.patch<CommissionToWalletResponse>(
      `${BASE_URL}${PATH}`,
      { amountToWallet: numeric } satisfies CommissionToWalletRequest,
      {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId,
        },
        validateStatus: () => true,
      }
    );

    if (status >= 400) {
      throw new Error(
        (data as any)?.message || `HTTP ${status}: gagal transfer komisi.`
      );
    }

    const r = data?.results;
    const normalized: CommissionToWalletResult = {
      userId: String(r.userId),
      userBalanceAmount:
        typeof r.userBalanceAmount === "string"
          ? Number(r.userBalanceAmount)
          : (r.userBalanceAmount as number),
      userWalletAmount:
        typeof r.userWalletAmount === "string"
          ? Number(r.userWalletAmount)
          : (r.userWalletAmount as number),
      userBalanceLastUpdated: String(r.userBalanceLastUpdated),
    };

    return {
      status: data.status ?? 200,
      message: data.message ?? "SUCCESS transfer commission to wallet",
      error: data.error ?? null,
      results: normalized,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal transfer komisi ke wallet.";
    throw new Error(msg);
  }
}
