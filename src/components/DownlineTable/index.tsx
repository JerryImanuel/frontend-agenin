import { useNavigate } from "react-router-dom";

type Downline = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

type DownlineTableProps = {
  data: Downline[];
  compact?: boolean;
  variant?: "default" | "dashboard";
  interactive?: boolean;
};

const DownlineTable = ({
  data,
  compact = false,
  variant = "default",
  interactive = true,
}: DownlineTableProps) => {
  const navigate = useNavigate();

  const isDashboard = variant === "dashboard";
  const isClickable = !isDashboard && interactive;

  const goDetail = (item: Downline) => {
    if (!isClickable) return;
    navigate(`/downline/${item.inviteeUserId}`, { state: { item } });
  };

  if (data.length === 0) {
    return (
      <p className="px-3 py-3 text-sm text-gray-500">
        No downline data available.
      </p>
    );
  }

  return (
    <div
      className={`w-full overflow-auto hide-scrollbar ${
        compact ? "max-h-100" : ""
      }`}
    >
      {data.map((d, idx) => {
        const base = "p-3 rounded transition";
        const bg = idx % 2 === 0 ? "bg-gray-100" : "bg-white";
        const hover = isClickable
          ? "hover:bg-sky-100 active:scale-[0.99] cursor-pointer"
          : "";
        const focusRing = isClickable
          ? "focus:outline-none focus:ring-2 focus:ring-sky-900"
          : "";

        const commonProps = {
          className: `${base} ${bg} ${hover} ${focusRing}`,
          key: d.inviteeUserId,
          ...(isClickable
            ? {
                role: "button" as const,
                tabIndex: 0,
                onClick: () => goDetail(d),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") goDetail(d);
                },
                "aria-label": `Lihat detail ${d.inviteeUserFullName}`,
              }
            : {}),
        };

        return (
          <div {...commonProps}>
            <div className="w-full flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500">Nama Downline</p>
                <p className="text-sm text-sky-900 font-medium">
                  {d.inviteeUserFullName}
                </p>
              </div>

              {/* Dashboard: hanya “Komisi Anda” singkat */}
              {isDashboard ? (
                <span className="inline-block bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                  Rp {d.inviteeCommissionValue.toLocaleString("id-ID")}
                </span>
              ) : (
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Komisi Downline</p>
                  <span>Rp 1.000.000</span>
                </div>
              )}
            </div>

            {!isDashboard && (
              <div className="w-full py-1 mt-1 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">Komisi Anda</span>
                  <div className="font-semibold text-emerald-600 flex items-center gap-1">
                    <i className="bx bx-plus text-[15px]" />
                    <span className="text-sm">
                      Rp {d.inviteeCommissionValue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DownlineTable;
