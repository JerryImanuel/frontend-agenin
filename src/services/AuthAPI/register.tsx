import axios from "axios";

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
  } | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const REGISTER_PATH = "/api/v1/user/create";

export async function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse["results"]> {
  try {
    const { data } = await axios.post<RegisterResponse>(
      `${BASE_URL}${REGISTER_PATH}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (data.status !== 200 && data.status !== 201) {
      throw new Error(data.message || "Registration failed.");
    }

    if (!data.results) {
      throw new Error(data.message || "Invalid registration response.");
    }

    return data.results;
  } catch (err: any) {
    const msg =
      typeof err.response?.data?.message === "string"
        ? err.response.data.message
        : err.message || "Registration failed.";
    throw new Error(msg);
  }
}
