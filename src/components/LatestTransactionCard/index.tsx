import type { Transaction } from "../../services/AuthAPI/openBankAccount";

function formatIDR(n?: number) {
  if (typeof n !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

function formatDate(d?: string | null) {
  if (!d) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));
  } catch {
    return d ?? "-";
  }
}

type Props = {
  data?: Transaction | null;
  productPrice?: number;
  showPlaceholderWhenEmpty?: boolean;
};

export default function LatestTransactionCard({
  data,
  productPrice,
  showPlaceholderWhenEmpty = true,
}: Props) {
  const status = data?.transactionStatus ?? "-";

  const statusClass =
    status === "SUCCESS"
      ? "bg-green-100 text-green-800"
      : status === "PENDING"
      ? "bg-yellow-100 text-yellow-800"
      : status === "FAILED" || status === "ERROR"
      ? "bg-red-100 text-red-800"
      : "bg-gray-100 text-gray-800";

  const EmptyState = (
    <div className="rounded-2xl bg-white border border-gray-200 px-4 py-6 text-center">
      <p className="text-sm font-semibold mb-1">Latest Transaction</p>
      <p className="text-xs text-gray-500">Belum ada transaksi.</p>
    </div>
  );

  if (!data && showPlaceholderWhenEmpty) return EmptyState;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 px-4 py-4">
      <p className="text-sm font-semibold mb-2">Latest Transaction</p>

      <div className="text-xs space-y-1.5">
        <Row label="Transaction ID">
          <span className="font-mono break-all">
            {data?.transactionId ?? "-"}
          </span>
        </Row>

        <Row label="Date">{formatDate(data?.transactionDate)}</Row>

        <Row label="Product">
          <span className="font-medium">{data?.productName ?? "-"}</span>
        </Row>

        {typeof productPrice === "number" && (
          <Row label="Price">
            <span className="font-medium">{formatIDR(productPrice)}</span>
          </Row>
        )}

        <div className="mt-2">
          <div className="text-gray-500">Customer</div>
          <div className="font-medium">{data?.customerName ?? "-"}</div>
          <div className="text-[11px] text-gray-500">
            {(data?.customerPhoneNumber ?? "-") +
              " · " +
              (data?.customerEmail ?? "-")}
          </div>
          <div className="text-[11px] text-gray-500">
            {data?.customerAddress ?? "-"}
          </div>
        </div>

        <div className="mt-2">
          <span
            className={["px-2 py-1 rounded-lg text-[11px]", statusClass].join(
              " "
            )}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-right">{children}</span>
    </div>
  );
}
