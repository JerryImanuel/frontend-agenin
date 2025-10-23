import API from "../api";
export interface TransactionRequest {
  customerIdentityNumber: string;
  customerName: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerAddress: string;
}

export interface Transaction {
  transactionId: string;
  productName: string;
  customerName: string | null;
  customerPhoneNumber: string | null;
  customerEmail: string | null;
  customerAddress: string | null;
  transactionDate: string;
  transactionStatus: string;
}

export interface TransactionResponse {
  status: number;
  message: string;
  error: string | null;
  results: Transaction | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const INQUIRY_PATH = "/api/v1/transaction/mock-open-bank-account";

export async function createInquiry(
  userId: string,
  productId: string,
  payload: TransactionRequest
): Promise<TransactionResponse> {
  if (!userId) throw new Error("userId wajib diisi");
  if (!productId) throw new Error("productId wajib diisi");

  const { data, status } = await API.post<TransactionResponse>(
    `${BASE_URL}${INQUIRY_PATH}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": userId,
        "X-PRODUCT-ID": productId,
      },
      validateStatus: () => true,
    }
  );

  if (status >= 400) {
    const msg = (data as any)?.message || `HTTP ${status}`;
    throw new Error(msg);
  }

  return data;
}
