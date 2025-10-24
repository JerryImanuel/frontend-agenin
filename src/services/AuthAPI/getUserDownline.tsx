import API from "../api";

export type DownlineUser = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

export interface DownlineResponse {
  status: number;
  message: string;
  error: string | null;
  results: DownlineUser[] | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const DOWNLINE_PATH = "/api/v1/user/downlines";

// Normalizer: dukung dua bentuk payload (flat & *DTO)
function normalizeOne(o: any): DownlineUser | null {
  if (!o) return null;

  // Bentuk flat
  if (o.inviteeUserId || o.inviteeUserFullName || o.inviteeCommissionValue) {
    return {
      inviteeUserId: String(o.inviteeUserId ?? ""),
      inviteeUserFullName: String(o.inviteeUserFullName ?? ""),
      inviteeCommissionValue: Number(o.inviteeCommissionValue ?? 0),
    };
  }

  // Bentuk DTO backend
  const idDTO = o?.usersReferralEntityDTOInviteeUserId;
  const nameDTO = o?.usersReferralEntityDTOInviteeUserFullName;
  const commDTO = o?.usersReferralEntityDTOInviteeCommissionValue;

  if (idDTO !== undefined || nameDTO !== undefined || commDTO !== undefined) {
    return {
      inviteeUserId: String(idDTO ?? ""),
      inviteeUserFullName: String(nameDTO ?? ""),
      inviteeCommissionValue: Number(commDTO ?? 0),
    };
  }

  return null;
}

function normalizeArray(arr: any): DownlineUser[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeOne).filter(Boolean) as DownlineUser[];
}

/**
 * Ambil downline by referenceUserId.
 * - 200 + results[]: kembalikan list
 * - 404 "Downline not found": kembalikan []
 * - 500/unknown: lempar Error dg pesan backend
 */
export async function getUserDownline(
  referenceUserId: string
): Promise<DownlineUser[]> {
  if (!referenceUserId) throw new Error("referenceUserId is required.");

  try {
    const { data } = await API.get<DownlineResponse>(
      `${BASE_URL}${DOWNLINE_PATH}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-REFERENCE-USER-ID": referenceUserId,
        },
      }
    );

    const raw = data?.results ?? (data as any)?.restAPIResponseResults ?? null;
    return normalizeArray(raw);
  } catch (err: any) {
    const res = err?.response;
    const body = res?.data;

    // Coba normalisasi data error kalau backend tetap kirim "results" di error
    const rawErr =
      body?.results ??
      body?.restAPIResponseResults ??
      body?.data?.results ??
      null;
    const fromErr = normalizeArray(rawErr);
    if (fromErr.length > 0) return fromErr;

    const msg: string =
      body?.message ||
      body?.restAPIResponseMessage ||
      body?.error ||
      err?.message ||
      "Failed to fetch user downline.";

    // ✅ Treat 404 (not found) sebagai list kosong
    if (res?.status === 404) return [];

    // ✅ Tangani pesan dalam bahasa Inggris/Indonesia
    const lc = msg.toLowerCase();
    if (
      lc.includes("downline not found") ||
      lc.includes("downline tidak ditemukan")
    ) {
      return [];
    }

    throw new Error(msg);
  }
}
