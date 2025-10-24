import axios from "axios";

export type LoginPayload = {
  userIdentifier: string;
  userPassword: string;
};

export interface LoginResponse {
  status: number;
  message: string;
  error: string | null;
  results: {
    token: string;
    userId: string;
    userFullName?: string;
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
    const { data } = await axios.post<LoginResponse>(
      `${BASE}/api/v1/user/login`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return data;
  } catch (err: any) {
    const status = err.response?.status ?? 0;
    const apiMsg =
      typeof err.response?.data?.message === "string"
        ? err.response.data.message
        : "Gagal terhubung ke server. Periksa koneksi internet kamu.";

    throw new AuthError(status, apiMsg);
  }
}
