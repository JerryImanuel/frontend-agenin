import { useMemo } from "react";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAlert } from "../../context/AlertContext";
import PageAlertTop from "../../components/PageAlertTop";

function getInitials(fullName?: string) {
  if (!fullName) return "U";
  const parts = fullName.trim().split(/\s+/);
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]];
  return (a ?? "").concat(b ?? "").toUpperCase() || "U";
}

export default function ProfilePage() {
  const { data, loading, error } = useUserProfile();
  const { showAlert } = useAlert();

  const initials = useMemo(() => getInitials(data?.userFullName), [data]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert(`${label} disalin.`, "success");
    } catch {
      showAlert(`Gagal menyalin ${label}.`, "error");
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <div className="mb-4">
          <div className="h-6 w-28 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-2">
            <i className="bx bxs-error-circle text-xl" />
            <div>
              <p className="font-medium">Gagal memuat profil</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <button
            className="mt-3 rounded-xl border border-red-300 px-3 py-2 text-sm hover:bg-red-100"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 text-gray-600">
          Profil kosong.
        </div>
      </div>
    );
  }

  return (
    <div className="px-5">
      <PageAlertTop />

      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-5 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-sky-900 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-sky-900">
              {data.userFullName}
            </p>
            <span className="inline-flex items-center rounded-lg bg-sky-100 text-sky-800 text-[11px] px-3 py-1 mt-1">
              {data.roleName || "User"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-5 shadow-sm">
        <div className="space-y-3 text-sm">
          <div className="flex flex-col justify-between gap-1 mb-3">
            <div className="text-gray-500 text-xs">Nama Lengkap</div>
            <div className="text-sky-950 font-medium">{data.userFullName}</div>
          </div>

          <div className="flex flex-col justify-between gap-1 mb-3">
            <div className="text-gray-500 text-xs">Email</div>
            <div className="flex items-center gap-2">
              <span className="text-sky-950">{data.userEmail || "-"}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-1 mb-3">
            <div className="text-gray-500 text-xs">Telepon</div>
            <div className="flex items-center gap-2">
              <span className="text-sky-950">
                {data.userPhoneNumber || "-"}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-1">
            <div className="text-gray-500 text-xs">Peran</div>
            <div className="text-sky-950">{data.roleName || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
