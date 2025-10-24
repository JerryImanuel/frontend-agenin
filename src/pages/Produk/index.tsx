import React, { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";
import PageAlertTop from "../../components/PageAlertTop";
import { useToken } from "../../context/AuthContext";
import { updateCommissions } from "../../services/AuthAPI/adminSetCommissions";
import { getProducts } from "../../services/AuthAPI/getProduct";
import { useInquiry } from "../../hooks/useOpenBankAccount";
import LatestTransactionCard from "../../components/LatestTransactionCard";

// ===== Types
type Product = {
  id: string;
  name: string;
  code: string;
  desc: string;
  price: number;
  commissionsValue: number;
};

// ===== Utils
function currency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

// ===== Local Storage Commission
const COMMISSION_LS_KEY = "product_commissions_v1";
function loadCommission(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(COMMISSION_LS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveCommission(data: Record<string, number>) {
  localStorage.setItem(COMMISSION_LS_KEY, JSON.stringify(data));
}

function AdminCommissionEditor({ products }: { products: Product[] }) {
  const { showAlert } = useAlert();
  const [commissions, setCommissions] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // ambil LS
    const loaded = loadCommission();

    // build map default: prefer LS, fallback ke backend commissionsValue
    const withDefault: Record<string, number> = {};
    for (const p of products) {
      const lsValRaw = loaded[p.id];
      const lsVal = typeof lsValRaw === "string" ? Number(lsValRaw) : lsValRaw;
      const backendVal = Number.isFinite(p.commissionsValue)
        ? Number(p.commissionsValue)
        : 0;

      withDefault[p.id] = Number.isFinite(lsVal) ? Number(lsVal) : backendVal;
    }

    setCommissions(withDefault);

    setInputs(
      Object.fromEntries(
        products.map((p) => [p.id, String(withDefault[p.id] ?? 0)])
      )
    );
  }, [products]);

  const onEdit = (id: string) => {
    setEditing((s) => ({ ...s, [id]: true }));
    setInputs((s) => ({ ...s, [id]: String(commissions[id] ?? 0) }));
  };
  const onCancel = (id: string) => {
    setEditing((s) => ({ ...s, [id]: false }));
    setInputs((s) => ({ ...s, [id]: String(commissions[id] ?? 0) }));
  };
  const onInput = (id: string, v: string) => {
    setInputs((s) => ({ ...s, [id]: v.replace(/[^\d]/g, "") }));
  };

  const onSave = async (id: string) => {
    console.log("onSave", id);
    const nextVal = Number(inputs[id] || 0);
    console.log(inputs, "next");

    if (Number.isNaN(nextVal) || nextVal < 0)
      return showAlert("Komisi tidak boleh kurang dari 0.", "error");

    if ((commissions[id] ?? 0) === nextVal) {
      console.log("tr sdsd");
      setEditing((s) => ({ ...s, [id]: false }));
      return showAlert("Tidak ada perubahan nilai komisi.", "info");
    }

    setSaving((s) => ({ ...s, [id]: true }));

    try {
      const resp = await updateCommissions(id, { commissionsValue: nextVal });
      const confirmed = Number(resp.results.commissionsValue);

      // sync state + LS
      const nextMap = { ...commissions, [id]: confirmed };
      setCommissions(nextMap);
      saveCommission(nextMap);

      setEditing((s) => ({ ...s, [id]: false }));
      showAlert(resp.message || "Komisi berhasil diperbarui.", "success");
    } catch (e: any) {
      showAlert(e?.message ?? "Gagal memperbarui komisi.", "error");
    } finally {
      setSaving((s) => ({ ...s, [id]: false }));
    }
    console.log({ nextVal });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-center mb-6">
        <img
          src="/src/assets/image/logo-agenin.png"
          className="h-10 mb-2"
          alt="Agenin"
        />
        <p className="text-sm">Administrator</p>
      </div>

      <p className="mb-3 font-semibold">Set Commission per Product</p>

      {products.map((p) => {
        const isEditing = !!editing[p.id];
        // ✅ tampilkan komisi dari state; fallback ke backend commissionsValue bila state kosong
        const valNum = commissions[p.id] ?? p.commissionsValue ?? 0;
        const valStr = inputs[p.id] ?? String(valNum);
        const isSaving = !!saving[p.id];
        return (
          <div
            key={p.id}
            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 bg-white"
          >
            <div className="flex flex-row items-start justify-between">
              <p className="text-sm font-semibold text-sky-900">{p.name}</p>
              <p className="text-sm font-semibold text-sky-900">
                {currency(p.price)}
              </p>
            </div>
            <p className="text-[10px] text-gray-500 mb-1">{p.code}</p>
            <p className="text-xs text-gray-700 mb-2">{p.desc}</p>

            {!isEditing ? (
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-lg bg-lime-200 text-lime-800 text-xs px-2 py-1">
                  Commission: {currency(valNum)}
                </span>
                <button
                  type="button"
                  onClick={() => onEdit(p.id)}
                  className="text-xs text-sky-900 underline"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    Commission Amount (IDR)
                  </label>
                  <input
                    inputMode="numeric"
                    placeholder="0"
                    value={valStr}
                    onChange={(e) => onInput(p.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                  />
                </div>

                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => onSave(p.id)}
                    className="h-9 w-full px-4 rounded-xl text-white text-sm bg-sky-900 hover:opacity-90 disabled:opacity-60"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onCancel(p.id)}
                    className="h-9 w-full px-4 rounded-xl text-sky-900 text-sm border-2 border-sky-900 hover:bg-sky-900 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProdukPage() {
  const { showAlert } = useAlert();
  const { user } = useToken();
  const isAdmin = (user as any)?.roleName === "ADMIN";
  const userId =
    (user as any)?.userId ||
    (user as any)?.id ||
    (user as any)?.results?.userId ||
    localStorage.getItem("userId") ||
    "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [message, setMessage] = useState<string>("");

  // form state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cid, setCid] = useState("");
  const [cname, setCname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cemail, setCemail] = useState("");
  const [caddr, setCaddr] = useState("");

  const {
    loading: inquiryLoading,
    latest,
    error,
    submitInquiry,
    reset,
  } = useInquiry();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingProducts(true);
        const resp = await getProducts();
        if (!mounted) return;

        if ((resp as any).error) {
          showAlert((resp as any).error, "error");
          setProducts([]);
          return;
        }

        setMessage((resp as any).message || "");

        // ✅ MAP commissionsValue dari backend (bukan commissionValue)
        const mapped: Product[] = ((resp as any).results ?? []).map(
          (p: any) => ({
            id: p.productId,
            name: p.productName,
            code: p.productCode,
            desc: p.productDesc,
            price: Number(p.productPrice),
            commissionsValue: Number(p.commissionsValue ?? 0), // ✅ penting
          })
        );
        setProducts(mapped);
      } catch (e: any) {
        if (!mounted) return;
        showAlert(e?.message ?? "Gagal memuat daftar produk.", "error");
        setProducts([]);
      } finally {
        if (mounted) setLoadingProducts(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [showAlert]);

  const nextFromStep1 = () => {
    if (!selectedProduct) return;
    setStep(2);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!cid || !cname || !cphone || !cemail || !caddr) {
      showAlert("Complete all customer data first.", "error");
      return;
    }
    try {
      await submitInquiry({
        userId,
        productId: selectedProduct.id,
        payload: {
          customerIdentityNumber: cid,
          customerName: cname,
          customerPhoneNumber: cphone,
          customerEmail: cemail,
          customerAddress: caddr,
        },
      });
      showAlert("Customer registration successful.", "success");
      setStep(3);
    } catch (e: any) {
      showAlert(
        e?.message ?? "Registration failed. Please try again.",
        "error"
      );
    }
  }

  function resetFlow() {
    setSelectedProduct(null);
    setCid("");
    setCname("");
    setCphone("");
    setCemail("");
    setCaddr("");
    reset();
    setStep(1);
  }

  return (
    <div className="mt-2 px-5">
      {isAdmin ? (
        loadingProducts ? (
          <div className="p-4 border rounded-2xl shadow-sm text-sm opacity-70">
            Loading products…
          </div>
        ) : (
          <AdminCommissionEditor products={products} />
        )
      ) : (
        <>
          <PageAlertTop />
          <div className="flex flex-col items-start mb-4">
            <p className="text-xs text-sky-950">
              Bank account opening service by Agenin. Select a product, then
              fill in the customer data.
            </p>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="mb-3 font-semibold">Select Bank Account</p>
                {message && (
                  <p className="text-[11px] text-gray-500 italic"></p>
                )}
              </div>
              {loadingProducts ? (
                <div className="p-4 border rounded-2xl shadow-sm text-sm opacity-70">
                  Loading products…
                </div>
              ) : products.length === 0 ? (
                <div className="p-4 border rounded-2xl shadow-sm text-sm">
                  No products available.
                </div>
              ) : (
                products.map((p) => {
                  const active = selectedProduct?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProduct(p)}
                      className={[
                        "w-full text-left rounded-2xl border-2 px-4 py-3 transition-all cursor-pointer",
                        active
                          ? "border-sky-800 bg-sky-100"
                          : "border-gray-200 bg-white",
                      ].join(" ")}
                    >
                      <div className="flex flex-row items-start justify-between">
                        <p className="text-sm font-semibold text-sky-900">
                          {p.name}
                        </p>
                        <p className="text-sm font-semibold text-sky-900">
                          {currency(p.price)}
                        </p>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-gray-500">{p.code}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-700">{p.desc}</p>
                    </button>
                  );
                })
              )}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={nextFromStep1}
                  className={`w-full rounded-2xl py-2 text-white text-sm transition ${
                    selectedProduct
                      ? "bg-sky-900 hover:opacity-90"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Fill Customer Data
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && selectedProduct && (
            <form onSubmit={onSubmit} className="space-y-3">
              <div className="rounded-2xl bg-white border border-gray-200 px-4 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Selected Bank</p>
                    <p className="text-sm font-semibold text-sky-900">
                      {selectedProduct.name} ·{" "}
                      <span className="font-normal text-gray-600">
                        {selectedProduct.code}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Deposit {currency(selectedProduct.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-sky-800 underline"
                    onClick={() => setStep(1)}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 px-4 py-4 space-y-3">
                <p className="text-xs font-semibold text-sky-900">
                  Customer Data
                </p>
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  placeholder="ID Number"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  required
                />
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  placeholder="Full Name"
                  value={cname}
                  onChange={(e) => setCname(e.target.value)}
                  required
                />
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  placeholder="Phone"
                  value={cphone}
                  onChange={(e) => setCphone(e.target.value)}
                  required
                />
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  placeholder="Email"
                  type="email"
                  value={cemail}
                  onChange={(e) => setCemail(e.target.value)}
                  required
                />
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm"
                  placeholder="Address"
                  value={caddr}
                  onChange={(e) => setCaddr(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={inquiryLoading}
                className="w-full rounded-2xl py-2 text-white text-sm transition bg-sky-900 hover:opacity-90 disabled:opacity-60"
              >
                {inquiryLoading ? "Processing..." : "Register"}
              </button>
              {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-xs">
                <div className="flex items-center gap-2">
                  <i className="bx bxs-check-circle text-lg" />
                  Success
                </div>
              </div>

              {latest && (
                <LatestTransactionCard
                  data={latest}
                  productPrice={selectedProduct?.price}
                />
              )}

              <button
                type="button"
                onClick={resetFlow}
                className="w-full border-2 border-sky-900 rounded-2xl py-2 text-sky-900 text-sm hover:bg-sky-900 hover:text-white"
              >
                Add Another
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
