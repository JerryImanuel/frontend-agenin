import API from "../api";

export interface CustomerOpenBankAccount {
  productName: string;
  productPrice: number;
  customerName: string | null;
  customerPhoneNumber: string | null;
  customerEmail: string | null;
  customerAddress: string | null;
  transactionDate: string;
  transactionStatus: string;
}

export interface CustomerOpenBankAccountResponse {
  status: number;
  message: string;
  error: string | null;
  results: CustomerOpenBankAccount[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const TRANSACTION_PATH = "/api/v1/transaction/customers";

export async function getAllTransactionsByUser(
  userId: string
): Promise<CustomerOpenBankAccountResponse> {
  if (!userId) throw new Error("userId wajib diisi");

  try {
    const { data } = await API.get<CustomerOpenBankAccountResponse>(
      `${BASE_URL}${TRANSACTION_PATH}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId, // UUID user
        },
      }
    );

    // Pastikan results selalu array
    const raw = Array.isArray(data.results) ? data.results : [];

    // Normalisasi hasil
    const normalizedResults: CustomerOpenBankAccount[] = raw.map((t) => ({
      productName: t.productName ?? "",
      productPrice:
        typeof t.productPrice === "string"
          ? Number(t.productPrice)
          : t.productPrice ?? 0,
      customerName: t.customerName ?? null,
      customerPhoneNumber: t.customerPhoneNumber ?? null,
      customerEmail: t.customerEmail ?? null,
      customerAddress: t.customerAddress ?? null,
      transactionDate: t.transactionDate ?? "",
      transactionStatus: t.transactionStatus ?? "",
    }));

    return {
      status: data.status ?? 200,
      message: data.message ?? "SUCCESS GET user transactions",
      error: data.error ?? null,
      results: normalizedResults,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.restApiResponseMessage ||
      err?.message ||
      "Gagal memuat transaksi pengguna.";
    throw new Error(msg);
  }
}
