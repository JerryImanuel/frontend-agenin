type Downline = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

type DownlineTableProps = {
  data: Downline[];
};

export default function DownlineTable({ data }: DownlineTableProps) {
  if (!data || data.length === 0) {
    return (
      <p className="px-3 py-3 text-sm text-gray-500 text-center italic">
        No downline data available.
      </p>
    );
  }

  return (
    <div className="w-full">
      {data.map((d, idx) => (
        <div
          key={d.inviteeUserId}
          className={`p-3 border-b border-gray-300 ${
            idx % 2 === 0 ? "bg-gray-50" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-500">Downline Name</p>
              <p className="text-sm text-sky-900 font-medium">
                {d.inviteeUserFullName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">Commission Downline</p>
              <span className="font-medium text-gray-700">Rp 1.000.000</span>
            </div>
          </div>

          <div className="w-full py-1 mt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Your Commission</span>
              <div className="font-semibold text-emerald-600 flex items-center gap-1">
                <i className="bx bx-plus text-[15px]" />
                <span className="text-sm">
                  Rp {d.inviteeCommissionValue.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
