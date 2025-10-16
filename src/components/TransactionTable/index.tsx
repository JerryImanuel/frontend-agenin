type Transaction = {
  id: string;
  productName: string;
  date: string;
  amount: number;
  status: "success";
};

type TransactionTableProps = {
  compact?: boolean;
};

const dummyTransactions: Transaction[] = [
  {
    id: "TX-001",
    productName: "Buka Akun Bank BCA",
    date: "2025-10-01",
    amount: 100000,
    status: "success",
  },
  {
    id: "TX-002",
    productName: "Buka Akun Bank Mandiri",
    date: "2025-10-03",
    amount: 250000,
    status: "success",
  },
  {
    id: "TX-003",
    productName: "Buka Akun Bank BTN",
    date: "2025-10-07",
    amount: 500000,
    status: "success",
  },
];

const TransactionTable = ({ compact = false }: TransactionTableProps) => {
  return (
    <div
      className={`w-full overflow-auto hide-scrollbar ${
        compact ? "max-h-100" : ""
      }`}
    >
      {dummyTransactions.length === 0 ? (
        <p className="px-3 py-3 text-sm text-gray-500 text-center italic">
          Tidak ada transaksi.
        </p>
      ) : (
        dummyTransactions.map((t, idx) => (
          <div
            key={t.id}
            className={`p-3 ${
              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
            } border-b border-gray-200 last:border-0`}
          >
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs font-medium text-sky-900 truncate">
                {t.productName}
              </p>
              <span className="text-xs font-semibold px-3 py-0.5 rounded-lg bg-emerald-100 text-emerald-700">
                Berhasil
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{new Date(t.date).toLocaleDateString("id-ID")}</span>
              <span className="font-semibold text-sky-900">
                Rp {t.amount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionTable;
