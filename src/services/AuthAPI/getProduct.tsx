import API from "../api";

export type Products = {
  productId: string;
  productName: string;
  productCode: string;
  productDesc: string;
  productPrice: string | number;
  commissionsValue: string | number;
};

export interface ProductsResponse {
  status: number;
  message: string;
  error: string | null;
  results: Products[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8989";
const PATH = "/api/v1/transaction/products";

export async function getProducts(): Promise<ProductsResponse> {
  try {
    const { data } = await API.get<ProductsResponse>(`${BASE_URL}${PATH}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!data?.results) {
      throw new Error(
        data?.message || data?.error || "Produk tidak ditemukan."
      );
    }

    const normalizedResults = data.results.map((p) => ({
      ...p,
      productPrice:
        typeof p.productPrice === "string"
          ? Number(p.productPrice)
          : p.productPrice,
    }));

    return {
      status: data.status,
      message: data.message,
      error: data.error,
      results: normalizedResults,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Gagal memuat daftar produk.";
    throw new Error(msg);
  }
}
