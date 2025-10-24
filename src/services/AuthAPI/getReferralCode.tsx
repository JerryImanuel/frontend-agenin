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
  results: unknown;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const REFERRAL_PATH = "/api/v1/user/referral-code";

function normalize(obj: any): ReferralCode | null {
  if (!obj) return null;

  if (obj.userReferralCode) {
    return {
      userReferralId: String(obj.userReferralId ?? obj.id ?? "unknown"),
      userReferralCode: String(obj.userReferralCode),
      userReferralCreatedAt: String(
        obj.userReferralCreatedAt ?? new Date().toISOString()
      ),
    };
  }

  if (obj.userReferralEntityDTOCode) {
    return {
      userReferralId: String(
        obj.userReferralEntityDTOId ??
          obj.userReferralEntityDTOUserId ??
          "unknown"
      ),
      userReferralCode: String(obj.userReferralEntityDTOCode),
      userReferralCreatedAt: String(
        obj.userReferralEntityDTOCreatedAt ?? new Date().toISOString()
      ),
    };
  }

  return null;
}

export async function getReferralCode(
  userId: string
): Promise<ReferralCode | null> {
  if (!userId) throw new Error("userId is required.");

  try {
    const { data } = await API.get<ReferralCodeResponse>(
      `${BASE_URL}${REFERRAL_PATH}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId,
        },
      }
    );

    const raw =
      (data as any)?.results ??
      (data as any)?.restAPIResponseResults ??
      (data as any)?.restApiResponseResults ??
      null;

    const ok = normalize(raw);
    if (!ok) {
      return null;
    }
    return ok;
  } catch (err: any) {
    const body = err?.response?.data;

    const msg: string =
      body?.message ||
      body?.restAPIResponseMessage ||
      body?.error ||
      err?.message ||
      "Failed to fetch referral code.";

    if (msg.toLowerCase().includes("tidak ditemukan")) {
      return null;
    }

    const rawErr =
      body?.results ??
      body?.restAPIResponseResults ??
      body?.data?.results ??
      null;
    const fromErr = normalize(rawErr);
    if (fromErr) return fromErr;

    throw new Error(msg);
  }
}
