import type { UserProfileResponse } from "../../types/User/userprofile";
import { getUserIdFromAuth } from "../../utils/auth";
import API from "../api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PROFILE_PATH = "/api/v1/user/profile";

export async function fetchUserProfile(): Promise<
  UserProfileResponse["results"]
> {
  const userId = getUserIdFromAuth();

  if (!userId) {
    throw new Error(
      "User ID tidak ditemukan dari auth (localStorage/cookie/JWT)."
    );
  }

  try {
    const { data } = await API.get<UserProfileResponse>(
      `${BASE_URL}${PROFILE_PATH}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId,
        },
      }
    );

    if (!data?.results) {
      const msg =
        data?.message || data?.error || "Response tidak berisi data profile.";
      throw new Error(msg);
    }

    return data.results;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal mengambil data profil.";
    throw new Error(msg);
  }
}
