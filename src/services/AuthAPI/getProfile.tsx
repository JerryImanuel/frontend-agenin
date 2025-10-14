import type { UserProfileResponse } from "../../types/User/userprofile";

const BASE = "http://localhost:8989";

export async function getProfile(userId: string): Promise<UserProfileResponse> {
  const token = localStorage.getItem("token"); 

  const res = await fetch(`${BASE}/api/v1/user/profile/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`HTTP ${res.status}: ${body || res.statusText}`);
  }

  return res.json();
}
