import API from "../api";

export type UserBalanceAndWallet = {
  userBalanceAmount: number | string;
  userWalletAmount: number | string;
};

export interface UserBalanceAndWalletResponse {
  status: number;
  message: string;
  error: string | null;
  results: UserBalanceAndWallet;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PATH = "/api/v1/transaction/balance-and-wallet";

export async function getUserBalanceAndWallet(
  userId: string
): Promise<UserBalanceAndWalletResponse> {
  if (!userId) throw new Error("userId wajib diisi");

  try {
    const { data } = await API.get<UserBalanceAndWalletResponse>(
      `${BASE_URL}${PATH}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId,
        },
      }
    );

    const r = data?.results ?? ({} as UserBalanceAndWallet);

    const normalizedResults: UserBalanceAndWallet = {
      userBalanceAmount:
        typeof r.userBalanceAmount === "string"
          ? Number(r.userBalanceAmount)
          : r.userBalanceAmount ?? 0,
      userWalletAmount:
        typeof r.userWalletAmount === "string"
          ? Number(r.userWalletAmount)
          : r.userWalletAmount ?? 0,
    };

    return {
      status: data.status ?? 200,
      message: data.message ?? "SUCCESS GET user balance and wallet",
      error: data.error ?? null,
      results: normalizedResults,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.restApiResponseMessage ||
      err?.message ||
      "Gagal mengambil saldo & wallet pengguna.";
    throw new Error(msg);
  }
}

export default getUserBalanceAndWallet;
