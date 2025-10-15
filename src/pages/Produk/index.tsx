import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  code: string;
  desc: string;
  price: number;
};
const PRODUCTS: Product[] = [
  {
    id: "A",
    name: "Bank Central Asia",
    code: "PRD-A-001",
    desc: "Paling banyak di pakai di Asia",
    price: 100_000,
  },
  {
    id: "B",
    name: "Bank Mandiri",
    code: "PRD-B-002",
    desc: "Bank nomor satu di Indonesia",
    price: 250_000,
  },
  {
    id: "C",
    name: "Bank BTN",
    code: "PRD-C-003",
    desc: "Ideal untuk pengajuan KPR Rumah",
    price: 500_000,
  },
];

type BankKey = "BCA" | "MANDIRI" | "BRI";
const BANKS: Record<BankKey, { label: string; adminFee: number }> = {
  BCA: { label: "Bank BCA", adminFee: 2500 },
  MANDIRI: { label: "Bank Mandiri", adminFee: 2000 },
  BRI: { label: "Bank BRI", adminFee: 1500 },
};

function currency(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <div className="relative w-full px-4 mb-6" aria-label="Progress">
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200" />
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 h-[2px] bg-sky-600 transition-all duration-300"
        style={{ width: `calc((100% - 2rem) * ${progressPct / 100})` }}
      />

      <ol className="relative z-10 flex items-center justify-between w-full">
        {[1, 2, 3].map((i) => {
          const isCurrent = step === i;
          const isCompleted = step > i;

          const circleClass = isCurrent
            ? "bg-slate-300 text-sky-900 border border-sky-900"
            : isCompleted
            ? "bg-sky-800 text-white"
            : "bg-gray-200 text-gray-500";

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

export default function Produk() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankKey | null>(null);
  const [paying, setPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  function guardResetPayment(cb: () => void) {
    if (paymentDone) {
      setPaymentDone(false);
    }
    cb();
  }

  const total = useMemo(() => {
    if (!selectedProduct || !selectedBank) return 0;
    return selectedProduct.price + BANKS[selectedBank].adminFee;
  }, [selectedProduct, selectedBank]);

  const nextFromStep1 = () => {
    if (!selectedProduct) return;
    setStep(2);
  };
  const nextFromStep2 = () => {
    if (!selectedBank) return;
    setStep(3);
  };
  const backTo = (s: 1 | 2) => setStep(s);

  const handlePay = async () => {
    if (!selectedProduct || !selectedBank) return;
    setPaying(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setPaymentDone(true);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mt-2 px-5">
      <div className="flex flex-col items-start mb-5">
        <p className="text-xs text-sky-950">
          Berikut adalah layanan pembukaan akun bank yang disediakan oleh
          Agenin. Pilih beberapa produk atau akun bank di bawah ini.
        </p>
      </div>

      <Stepper step={step} />

      {step === 1 && (
        <div className="space-y-3">
          {PRODUCTS.map((p) => {
            const active = selectedProduct?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => guardResetPayment(() => setSelectedProduct(p))}
                className={[
                  "w-full text-left rounded-2xl border px-4 py-3 transition-all",
                  active
                    ? "border-sky-800 bg-white shadow-md"
                    : "border-gray-200 bg-white hover:shadow-sm",
                ].join(" ")}
              >
                <div className="flex flex-col justify-between">
                  <div className="flex flex-row justify-between">
                    <div>
                      <p className="text-sm font-semibold text-sky-900">
                        {p.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-sky-900">
                        {currency(p.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-between mt-1">
                    <div className="w-60">
                      <p className="text-[10px] text-gray-500">{p.code}</p>
                      <p className="text-xs text-gray-700">{p.desc}</p>
                    </div>
                    {active && (
                      <span className="text-[10px] text-sky-700 mt-1">
                        Dipilih
                      </span>
                    )}
                  </div>
                </div>
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
              Isi Saldo Pembukaan Akun
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">Produk dipilih</p>
                <p className="text-sm font-semibold text-sky-900">
                  {selectedProduct?.name} ·{" "}
                  <span className="font-normal text-gray-600">
                    {selectedProduct?.code}
                  </span>
                </p>
              </div>
              <button
                className="text-xs text-sky-800 underline"
                onClick={() => backTo(1)}
              >
                Ubah
              </button>
            </div>
          </div>

          {(Object.keys(BANKS) as BankKey[]).map((key) => {
            const b = BANKS[key];
            const active = selectedBank === key;
            const estTotal = (selectedProduct?.price ?? 0) + b.adminFee;
            return (
              <button
                key={key}
                type="button"
                onClick={() => guardResetPayment(() => setSelectedBank(key))}
                className={[
                  "w-full text-left rounded-2xl border px-4 py-3 transition-all bg-white",
                  active
                    ? "border-sky-800 shadow-md"
                    : "border-gray-200 hover:shadow-sm",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-sky-900">
                      {b.label}
                    </p>
                    <p className="text-xs text-gray-600">
                      Biaya admin {currency(b.adminFee)} · Estimasi bayar{" "}
                      {currency(estTotal)}
                    </p>
                  </div>
                  {active && (
                    <span className="text-[10px] text-sky-700">Dipilih</span>
                  )}
                </div>
              </button>
            );
          })}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => backTo(1)}
              className="w-full border-2 border-sky-900 rounded-2xl py-2 text-sky-900 text-sm hover:bg-sky-900 hover:text-white"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={nextFromStep2}
              className={`w-full rounded-2xl py-2 text-white text-sm transition ${
                selectedBank
                  ? "bg-sky-900 hover:opacity-90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">Produk</p>
                <p className="text-sm font-semibold text-sky-900">
                  {selectedProduct?.name} ·{" "}
                  <span className="font-normal text-gray-600">
                    {selectedProduct?.code}
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {selectedProduct?.desc}
                </p>
              </div>
              <button
                className="text-xs text-sky-800 underline"
                onClick={() => backTo(1)}
              >
                Ubah
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">Metode Pembayaran</p>
                <p className="text-sm font-semibold text-sky-900">
                  {selectedBank && BANKS[selectedBank].label}
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Mengganti produk/bank setelah bayar akan membuat transaksi
                  baru.
                </p>
              </div>
              <button
                className="text-xs text-sky-800 underline"
                onClick={() => backTo(2)}
              >
                Ubah
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700">Harga produk</span>
              <span className="font-medium text-sky-900">
                {selectedProduct ? currency(selectedProduct.price) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-gray-700">Biaya admin</span>
              <span className="font-medium text-sky-900">
                {selectedBank ? currency(BANKS[selectedBank].adminFee) : "-"}
              </span>
            </div>
            <div className="border-t border-gray-200 my-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-sky-900">Total bayar</span>
              <span className="font-bold text-sky-900">{currency(total)}</span>
            </div>
          </div>

          {!paymentDone ? (
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="w-full rounded-2xl py-2 text-white text-sm transition bg-sky-900 hover:opacity-90 disabled:opacity-60"
            >
              {paying ? "Memproses..." : "Bayar Sekarang"}
            </button>
          ) : (
            <div className="rounded-2xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
              <div className="flex items-center gap-2">
                <i className="bx bxs-check-circle text-lg" />
                Pembayaran berhasil. Terima kasih!
              </div>
              <p className="text-[11px] text-green-700 mt-1">
                Jika kamu mengganti produk atau bank, total akan dihitung ulang
                dan kamu perlu membayar lagi.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
