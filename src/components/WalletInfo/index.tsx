type WalletInfoProps = {
  balance?: number | null;
  loading?: boolean;
  error?: string | null;
  className?: string;
};

export default function WalletInfo({
  balance,
  loading = false,
  error = null,
}: WalletInfoProps) {
  return (
    <div className="card bg-sky-900 text-white py-4 px-5 rounded-2xl shadow w-full transition">
      {loading ? (
        <div className="flex items-center justify-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
        </div>
      ) : error ? (
        <p className="text-red-200 text-sm text-center">{error}</p>
      ) : (
        <>
          <p className="mb-1 font-light text-xs">Balance Total</p>
          <h1 className="font-semibold text-lg">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(balance || 0)}
          </h1>
        </>
      )}
    </div>
  );
}
