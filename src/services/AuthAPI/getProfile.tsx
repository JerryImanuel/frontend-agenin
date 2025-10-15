import type { UserProfileResponse } from "../../types/User/userprofile";
import { getToken, getUserIdFromAuth } from "../../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PROFILE_PATH = "/api/v1/user/profile";

export async function fetchUserProfile(): Promise<
  UserProfileResponse["results"]
> {
  const token = getToken();
  const userId = getUserIdFromAuth();

  if (!userId) {
    throw new Error(
      "User ID tidak ditemukan dari auth (localStorage/cookie/JWT)."
    );
  }

  const res = await fetch(`${BASE_URL}${PROFILE_PATH}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": userId,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Gagal fetch profile (${res.status}): ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as UserProfileResponse;

  if (!data.results) {
    throw new Error(
      data.error || data.message || "Response tidak berisi data profile"
    );
  }

  return data.results;
}
