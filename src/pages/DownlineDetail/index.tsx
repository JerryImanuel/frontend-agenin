import { useLocation, useNavigate, useParams } from "react-router-dom";

type Downline = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

export default function DownlineDetail() {
  const { inviteeUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { item?: Downline } };
  const item = location.state?.item;

  // TODO: jika ingin support direct-load tanpa state:
  // const { data, loading } = useDownlineItem(inviteeUserId) // fetch by id

  if (!item) {
    return (
      <div className="px-5">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 text-sm">
          Data tidak ditemukan untuk ID <b>{inviteeUserId}</b>.
          <div className="mt-3">
            <button
              onClick={() => navigate("/downline")}
              className="rounded-xl border border-yellow-300 px-3 py-1.5 hover:bg-yellow-100"
            >
              Kembali ke Downline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-3">
      <button
        onClick={() => navigate(-1)}
        className="mb-3 inline-flex items-center gap-1 text-sm text-sky-900 hover:underline"
      >
        <i className="bx bx-left-arrow-alt text-lg" /> Kembali
      </button>

      <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
        <h2 className="text-base font-semibold text-sky-900">
          Detail Downline
        </h2>
        <p className="text-xs text-gray-500 mt-1">ID: {item.inviteeUserId}</p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500">Nama</span>
            <span className="font-medium text-sky-900">
              {item.inviteeUserFullName}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500">Komisi Downline</span>
            <span>Rp 1.000.000</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-gray-500">Komisi Anda</span>
            <span className="font-semibold text-emerald-600">
              Rp {item.inviteeCommissionValue.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* (Opsional) Riwayat transaksi / detail tambahan */}
        {/* <div className="mt-4 border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500 mb-2">Riwayat Transaksi</p>
          ...
        </div> */}
      </div>
    </div>
  );
}
