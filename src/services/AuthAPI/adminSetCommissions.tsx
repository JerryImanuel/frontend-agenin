import API from "../api";

export type AdminUpdateCommissions = {
  roleName: string;
  userFullName: string;
  productName: string;
  commissionsValue: number | string;
  commissionsCreatedDate: string;
  commissionsUpdatedDate: string;
};

export type AdminUpdateCommissionsResponse = {
  status: number;
  message: string;
  error: string | null;
  results: AdminUpdateCommissions & { commissionsValue: number };
};

export interface AdminUpdateCommissionsRequest {
  commissionsValue: number | string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PATH = "/api/v1/user/update-commissions";

export async function updateCommissions(
  productId: string,
  body: AdminUpdateCommissionsRequest
): Promise<AdminUpdateCommissionsResponse> {
  if (!productId) throw new Error("productId wajib diisi.");
  if (body.commissionsValue === undefined || body.commissionsValue === null) {
    throw new Error("commissionsValue wajib diisi.");
  }

  try {
    const { data } = await API.patch<AdminUpdateCommissionsResponse>(
      `${BASE_URL}${PATH}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-PRODUCT-ID": productId,
        },
      }
    );

    if (!data || !data.results) {
      throw new Error(data?.message || "Response kosong dari server.");
    }

    const r = data.results;
    const normalized: AdminUpdateCommissions & { commissionsValue: number } = {
      ...r,
      commissionsValue:
        typeof r.commissionsValue === "string"
          ? Number(r.commissionsValue)
          : r.commissionsValue ?? 0,
    };

    return {
      status: data.status ?? 200,
      message: data.message ?? "SUCCESS UPDATE commissions",
      error: data.error ?? null,
      results: normalized,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal memperbarui komisi.";
    throw new Error(msg);
  }
}
