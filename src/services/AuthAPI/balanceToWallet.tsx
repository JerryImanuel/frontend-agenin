import API from "../api";

export interface CommissionToWalletRequest {
  amountToWallet: number | string;
  userPassword: string;
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

class AuthError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || "Terjadi kesalahan.");
    this.name = "AuthError";
    this.status = status;
  }
}

export async function commissionToWallet(
  userId: string,
  amount: number | string,
  userPassword: string
): Promise<CommissionToWalletResponse> {
  if (!userId) throw new Error("userId wajib diisi.");

  const numeric =
    typeof amount === "string" ? Number(amount.replace(/[, ]/g, "")) : amount;
  if (!Number.isFinite(numeric) || numeric < 0.01)
    throw new Error("Minimal transfer adalah 0.01.");
  if (!userPassword?.trim()) throw new Error("Password wajib diisi.");

  try {
    const payload: CommissionToWalletRequest = {
      amountToWallet: numeric,
      userPassword: userPassword.trim(),
    };

    const { data, status } = await API.patch(`${BASE_URL}${PATH}`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": userId,
      },
      validateStatus: () => true,
    });

    if (status >= 400 || data?.status >= 400) {
      throw new AuthError(
        data?.status ?? status,
        data?.message ?? `HTTP ${status}: gagal transfer komisi.`
      );
    }

    const r = data?.results;
    if (!r) {
      throw new AuthError(status, "Response tidak valid dari server.");
    }

    const normalized: CommissionToWalletResult = {
      userId: String(r.userId),
      userBalanceAmount: Number(r.userBalanceAmount),
      userWalletAmount: Number(r.userWalletAmount),
      userBalanceLastUpdated: String(r.userBalanceLastUpdated),
    };

    return {
      status: data.status ?? status,
      message: data.message ?? "SUCCESS transfer to wallet",
      error: null,
      results: normalized,
    };
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status ?? 0;
    const apiMsg =
      err?.message ??
      err?.response?.data?.message ??
      "Gagal terhubung ke server. Periksa koneksi internet kamu.";

    throw new AuthError(status, apiMsg);
  }
}
