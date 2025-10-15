export type RegisterPayload = {
  userFullName: string;
  userEmail: string;
  userPhoneNumber: string;
  userPassword: string;
  userReferralCode?: string | null;
};

export interface RegisterResponse {
  status: number;
  message: string;
  error: string | null;
  results: {
    userId: string;
    userFullName: string;
    userEmail: string;
    userPhoneNumber: string;
    roleName: string;
    userCreatedDate: string;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const REGISTER_PATH = "/api/v1/user/create";

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${BASE_URL}${REGISTER_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok || (res.status !== 200 && res.status !== 201)) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }

  const data = (await res.json()) as RegisterResponse;

  if (data.error) throw new Error(data.error);
  if (!data.results) throw new Error(data.message || "Registrasi gagal");

  return data.results;
}
