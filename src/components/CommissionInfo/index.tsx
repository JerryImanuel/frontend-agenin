type CommissionInfoProps = {
  commission?: number | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
};

export default function CommissionInfo({
  commission,
  loading = false,
  error = null,
  className = "",
}: CommissionInfoProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="card bg-emerald-600 text-white py-4 px-5 rounded-2xl shadow w-full transition">
        {loading ? (
          <div className="flex items-center justify-center h-12">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          </div>
        ) : error ? (
          <p className="text-red-200 text-sm text-center">{error}</p>
        ) : (
          <>
            <p className="mb-1 font-light text-xs">Total Pendapatan Komisi</p>
            <h1 className="font-semibold text-lg">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(commission || 0)}
            </h1>
          </>
        )}
      </div>
    </div>
  );
}
