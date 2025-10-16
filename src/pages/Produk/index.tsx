import { useMemo, useState } from "react";
import { useAlert } from "../../context/AlertContext";
import PageAlertTop from "../../components/PageAlertTop";
import { useDownlineHistory } from "../../hooks/useDownlineHistory";

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

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;
  return (
    <div className="relative w-full px-4 mb-6" aria-label="Progress">
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300" />
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 h-[2px] bg-sky-600 transition-all duration-300"
        style={{ width: `calc((100% - 2rem) * ${progressPct / 100})` }}
      />
      <ol className="relative z-10 flex items-center justify-between w-full">
        {[1, 2, 3].map((i) => {
          const isCurrent = step === i;
          const isCompleted = step > i;
          const circleClass = isCurrent
            ? "bg-lime-600 text-white"
            : isCompleted
            ? "bg-sky-800 text-white"
            : "bg-white text-gray-500";
          return (
            <li key={i} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors duration-300 ${circleClass}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                {i}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function currency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Produk() {
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
  const backTo = (s: 1 | 2) => setStep(s);

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

      const res = {
        productId: selectedProduct.id,
        productName: `Buka Akun Bank - ${selectedProduct.name}`,
        customerIndetityNumber: cid,
        customerName: cname,
        customerPhoneNumber: cphone,
        customerEmail: cemail,
        customerAddress: caddr,
      };

      addItem({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        productId: res.productId,
        productName: res.productName,
        customerIdentityNumber: res.customerIndetityNumber,
        customerName: res.customerName,
        customerPhoneNumber: res.customerPhoneNumber,
        customerEmail: res.customerEmail,
        customerAddress: res.customerAddress,
        commissionAmount: 100_000,
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
      <PageAlertTop />

      <div className="flex flex-col items-start mb-4">
        <p className="text-xs text-sky-950">
          Bank account opening service by Agenin. Select a product, then fill in
          the customer data.
        </p>
      </div>

      {step !== 3 && <Stepper step={step} />}

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
                <p className="text-xs text-gray-500">Selected Bank Account</p>
                <p className="text-sm font-semibold text-sky-900">
                  {selectedProduct.name} ·{" "}
                  <span className="font-normal text-gray-600">
                    {selectedProduct.code}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Minimum Deposit {currency(selectedProduct.price)}
                </p>
              </div>
              <button
                type="button"
                className="text-xs text-sky-800 underline"
                onClick={() => backTo(1)}
              >
                Change
              </button>
            </div>
          </div>
          <div className="max-h-70 overflow-auto">
            <div className="rounded-2xl bg-white border border-gray-200 px-4 py-4 space-y-3">
              <p className="text-xs font-semibold text-sky-900">
                Customer Data
              </p>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  ID Number
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  placeholder="3201xxxxxxxxxxxx"
                  required
                  inputMode="numeric"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={cname}
                  onChange={(e) => setCname(e.target.value)}
                  placeholder="Name according to your ID"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                    value={cphone}
                    onChange={(e) => setCphone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    required
                    inputMode="tel"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                    value={cemail}
                    onChange={(e) => setCemail(e.target.value)}
                    placeholder="name@email.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Address
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={caddr}
                  onChange={(e) => setCaddr(e.target.value)}
                  placeholder="Street name, etc."
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pb-2">
            <button
              type="button"
              onClick={() => backTo(1)}
              className="w-full border-2 border-sky-900 rounded-2xl py-2 text-sky-900 text-sm hover:bg-sky-900 hover:text-white"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl py-2 text-white text-sm transition bg-sky-900 hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Register"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-xs">
            <div className="flex items-center gap-2">
              <i className="bx bxs-check-circle text-lg" />
              Customer Transaction Success
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-500 mb-1">Product</p>
            <p className="text-sm font-semibold text-sky-900">
              Open Bank Account - {selectedProduct?.name} ·{" "}
              <span className="font-normal text-gray-600">
                {selectedProduct?.code}
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {selectedProduct?.desc}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3 space-y-1">
            <p className="text-xs text-gray-500 mb-1">Customer Data</p>
            <p className="text-sm text-sky-900">Name: {cname}</p>
            <p className="text-sm text-sky-900">ID: {cid}</p>
            <p className="text-sm text-sky-900">Phone: {cphone}</p>
            <p className="text-sm text-sky-900">Email: {cemail}</p>
            <p className="text-sm text-sky-900">Address: {caddr}</p>
          </div>

          <button
            type="button"
            onClick={resetFlow}
            className="w-full border-2 border-sky-900 rounded-2xl py-2 text-sky-900 text-sm hover:bg-sky-900 hover:text-white"
          >
            Add Another Customer
          </button>
        </div>
      )}
    </div>
  );
}
