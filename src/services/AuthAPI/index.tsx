// src/services/authApi.ts
import type { User } from "../../types/User";

export type LoginPayload = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type LoginResponse = User & {
  accessToken: string;
  refreshToken: string;
};

const BASE = "https://dummyjson.com";

class AuthError extends Error {
  status: number;
  constructor(status: number, message?: string) {
    super(message || "Terjadi kesalahan.");
    this.name = "AuthError";
    this.status = status;
  }
  get publicMessage() {
    if (this.status === 400) return "Username atau kata sandi salah.";
    if (this.status === 401) return "Sesi kamu berakhir. Silakan masuk lagi.";
    if (this.status >= 500) return "Server sedang bermasalah. Coba lagi nanti.";
    if (this.status === 0)
      return "Gagal terhubung ke server. Periksa koneksi internet kamu.";
    return "Terjadi kesalahan. Silakan coba lagi.";
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
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

export async function getMe(accessToken: string): Promise<User> {
  try {
    const res = await fetch(`${BASE}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
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
