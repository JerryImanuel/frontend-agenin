import axios from "axios";

export type DownlineUser = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

export interface DownlineResponse {
  status: number;
  message: string;
  error: string | null;
  results: DownlineUser;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const DOWNLINE_PATH = "/api/v1/user/downline";

function normalizeOne(o: any): DownlineUser | null {
  if (!o) return null;

  if (o.inviteeUserId || o.inviteeUserFullName || o.inviteeCommissionValue) {
    return {
      inviteeUserId: String(o.inviteeUserId ?? ""),
      inviteeUserFullName: String(o.inviteeUserFullName ?? ""),
      inviteeCommissionValue: Number(o.inviteeCommissionValue ?? 0),
    };
  }

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

export async function getUserDownline(
  referenceUserId: string,
  token?: string
): Promise<DownlineUser[]> {
  if (!referenceUserId) throw new Error("referenceUserId is required.");

  try {
    const { data } = await axios.get<DownlineResponse>(
      `${BASE_URL}${DOWNLINE_PATH}/${referenceUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );

    const raw =
      (data as any)?.results ?? (data as any)?.restAPIResponseResults ?? null;

    const list = normalizeArray(raw);
    if (list.length >= 0) return list;

    return [];
  } catch (err: any) {
    const res = err?.response;
    const body = res?.data;

    const rawErr =
      body?.results ??
      body?.restAPIResponseResults ??
      body?.data?.results ??
      null;
    const fromErr = normalizeArray(rawErr);
    if (fromErr.length > 0) return fromErr;

    const msgText: string = body?.message || body?.error || err?.message || "";
    if (
      typeof msgText === "string" &&
      msgText.toLowerCase().includes("downline tidak ditemukan")
    ) {
      return [];
    }

    const msg =
      body?.message ||
      body?.error ||
      err?.message ||
      "Failed to fetch user downline.";
    throw new Error(msg);
  }
}
