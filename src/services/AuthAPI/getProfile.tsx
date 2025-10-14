import type { User } from "../../types/User";
import { getToken } from "../../utils/auth";

export type UserProfile = User & {
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoneNumber: string;
  roleName: string;
};
export interface UserProfileResponse {
  status: number;
  message: string;
  error: string | null;
  results: UserProfile;
}

const BASE = "http://localhost:8989";

function authHeaders() {
  const t = getToken();
  return {
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

export async function getProfileById(userId: string): Promise<UserProfileResponse> {
  const res = await fetch(`${BASE}/api/v1/user/profile/${userId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getMyProfile(): Promise<UserProfileResponse> {
  const res = await fetch(`${BASE}/api/v1/user/profile/me`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json();
}
