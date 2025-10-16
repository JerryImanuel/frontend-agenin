type Downline = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

type DownlineTableProps = {
  data: Downline[];
  compact?: boolean;
};

const DownlineTable = ({ data, compact = false }: DownlineTableProps) => {
  return (
    <div
      className={`w-full overflow-auto hide-scrollbar ${
        compact ? "max-h-100" : ""
      }`}
    >
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500 text-sm capitalize tracking-wide border-b border-gray-200 sticky top-0 bg-white">
            <th className="py-2 px-4 font-semibold">Full Name</th>
            <th className="py-2 px-4 font-semibold">Commission</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="text-center py-4 text-gray-500 text-sm italic"
              >
                No downline data available.
              </td>
            </tr>
          ) : (
            data.map((d, idx) => (
              <tr
                key={d.inviteeUserId}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="py-2 px-4">{d.inviteeUserFullName}</td>
                <td className="py-2 px-4">
                  Rp {d.inviteeCommissionValue.toLocaleString("id-ID")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DownlineTable;
