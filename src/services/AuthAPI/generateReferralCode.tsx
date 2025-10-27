import API from "../api";

export type ReferralCode = {
  userReferralId: string;
  userReferralCode: string;
  userReferralCreatedAt: string;
};

export interface ReferralCodeResponse {
  status: number;
  message: string;
  error: string | null;
  results: ReferralCode;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const REFERRAL_PATH_PREFIX = "/api/v1/user/referral-code";

export async function generateReferralCode(userId: string) {
  if (!userId) throw new Error("userId wajib diisi.");

  try {
    const { data } = await API.post<ReferralCodeResponse>(
      `${BASE_URL}${REFERRAL_PATH_PREFIX}`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": userId,
        },
      }
    );

    if (data.error) throw new Error(data.error);
    if (!data.results) throw new Error(data.message || "Response tidak valid.");

    return data.results;
  } catch (err: any) {
    const apiMsg: string =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal generate referral code.";

    throw new Error(apiMsg);
  }
}
