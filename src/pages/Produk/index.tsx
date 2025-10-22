import { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";
import PageAlertTop from "../../components/PageAlertTop";
import { useDownlineHistory } from "../../hooks/useDownlineHistory";
import { useToken } from "../../context/AuthContext";

type Product = {
  id: string;
  name: string;
  code: string;
  desc: string;
  price: number;
};

const PRODUCTS: Product[] = [
  {
    id: "001",
    name: "Bank Central Asia",
    code: "PRD-A-001",
    desc: "Most widely used in Asia",
    price: 100_000,
  },
  {
    id: "002",
    name: "Bank Mandiri",
    code: "PRD-B-002",
    desc: "The number one bank in Indonesia",
    price: 250_000,
  },
  {
    id: "003",
    name: "Bank BTN",
    code: "PRD-C-003",
    desc: "Ideal for applying for a home mortgage",
    price: 500_000,
  },
];

function currency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const COMMISSION_LS_KEY = "product_commissions_v1";

function loadCommission(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COMMISSION_LS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}
function saveCommission(data: Record<string, number>) {
  localStorage.setItem(COMMISSION_LS_KEY, JSON.stringify(data));
}
function readCommission(prodId: string): number {
  try {
    const raw = localStorage.getItem(COMMISSION_LS_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    return map[prodId] ?? 0;
  } catch {
    return 0;
  }
}

function AdminCommissionEditor({ products }: { products: Product[] }) {
  const [commissions, setCommissions] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loaded = loadCommission();
    const withDefault: Record<string, number> = { ...loaded };
    for (const p of products) {
      if (withDefault[p.id] == null) withDefault[p.id] = 100_000;
    }
    setCommissions(withDefault);
    setInputs(
      Object.fromEntries(
        products.map((p) => [p.id, String(withDefault[p.id] ?? 0)])
      )
    );
  }, [products]);

  const onEdit = (id: string) => {
    setEditing((prev) => ({ ...prev, [id]: true }));
    setInputs((prev) => ({ ...prev, [id]: String(commissions[id] ?? 0) }));
  };
  const onCancel = (id: string) => {
    setEditing((prev) => ({ ...prev, [id]: false }));
    setInputs((prev) => ({ ...prev, [id]: String(commissions[id] ?? 0) }));
  };
  const onInput = (id: string, v: string) => {
    const onlyNum = v.replace(/[^\d]/g, "");
    setInputs((prev) => ({ ...prev, [id]: onlyNum }));
  };
  const onSave = async (id: string) => {
    const nextVal = Number(inputs[id] || 0);
    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      await new Promise((r) => setTimeout(r, 300));
      const nextMap = { ...commissions, [id]: nextVal };
      setCommissions(nextMap);
      saveCommission(nextMap);
      setEditing((prev) => ({ ...prev, [id]: false }));
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
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
        const valNum = commissions[p.id] ?? 0;
        const valStr = inputs[p.id] ?? String(valNum);
        const isSaving = !!saving[p.id];

        return (
          <div
            key={p.id}
            className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 bg-white"
          >
            <div>
              <div className="flex flex-row items-start justify-between">
                <p className="text-sm font-semibold text-sky-900">{p.name}</p>
                <p className="text-sm font-semibold text-sky-900">
                  {currency(p.price)}
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] text-gray-500">{p.code}</p>
              </div>
            </div>
            <p className="text-xs text-gray-700 mb-2">{p.desc}</p>

            {!isEditing ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-lime-200 text-lime-800 text-xs px-2 py-1">
                    Commission: {currency(valNum)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(p.id)}
                  className="text-xs text-sky-900 underline hover:text-sky-700"
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

export default function Produk() {
  const { user } = useToken();
  const isAdmin = user?.roleName === "ADMIN";

  const { showAlert } = useAlert();
  const { addItem } = useDownlineHistory();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cid, setCid] = useState("");
  const [cname, setCname] = useState("");
  const [cphone, setCphone] = useState("");
  const [cemail, setCemail] = useState("");
  const [caddr, setCaddr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nextFromStep1 = () => {
    if (!selectedProduct) return;
    setStep(2);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!cid || !cname || !cphone || !cemail || !caddr) {
      showAlert("Complete all customer data first.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      addItem({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        customerIdentityNumber: cid,
        customerName: cname,
        customerPhoneNumber: cphone,
        customerEmail: cemail,
        customerAddress: caddr,
        commissionAmount: readCommission(selectedProduct.id) || 100_000,
      });
      showAlert("Customer registration successful.", "success");
      setStep(3);
    } catch {
      showAlert("Registration failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetFlow = () => {
    setSelectedProduct(null);
    setCid("");
    setCname("");
    setCphone("");
    setCemail("");
    setCaddr("");
    setStep(1);
  };

  return (
    <div className="mt-2 px-5">
      {isAdmin ? (
        <AdminCommissionEditor products={PRODUCTS} />
      ) : (
        <>
          <PageAlertTop />
          <div className="flex flex-col items-start mb-4">
            <p className="text-xs text-sky-950">
              Bank account opening service by Agenin. Select a product, then
              fill in the customer data.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="mb-3 font-semibold">Select Bank Account</p>
              {PRODUCTS.map((p) => {
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
                    <div>
                      <div className="flex flex-row items-start justify-between">
                        <p className="text-sm font-semibold text-sky-900">
                          {p.name}
                        </p>
                        <p className="text-sm font-semibold text-sky-900">
                          {currency(p.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] text-gray-500">{p.code}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700">{p.desc}</p>
                  </button>
                );
              })}
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

          {step === 2 && selectedProduct && (
            <form onSubmit={submitRegistration} className="space-y-3">
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
                disabled={submitting}
                className="w-full rounded-2xl py-2 text-white text-sm transition bg-sky-900 hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Register"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-xs">
                <div className="flex items-center gap-2">
                  <i className="bx bxs-check-circle text-lg" />
                  Success
                </div>
              </div>
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
