// src/services/authApi.ts
import type { User } from "../../types/User";

export type LoginPayload = {
  userIdentifier: string;
  userPassword: string;
};

export interface LoginResponse {
  status: number;
  message: string;
  error: string | null;
  results: User & {
    token: string;
    refreshToken?: string;
  };
}

const BASE = "http://localhost:8989";

class AuthError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || "Terjadi kesalahan.");
    this.name = "AuthError";
    this.status = status;
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE}/api/v1/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let apiMsg: string | undefined;
      try {
        const data = await res.json();
        apiMsg = typeof data?.message === "string" ? data.message : undefined;
      } catch {}
      throw new AuthError(res.status, apiMsg);
    }

    return res.json();
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    throw new AuthError(
      0,
      "Gagal terhubung ke server. Periksa koneksi internet kamu."
    );
  }
}