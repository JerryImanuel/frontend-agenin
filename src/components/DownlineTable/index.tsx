type Downline = {
  id: number;
  name: string;
  dateCreated: string;
  status: "Jumlah" | "Persen";
};

type DownlineTableProps = {
  data: Downline[];
};

const DownlineTable = ({ data }: DownlineTableProps) => {
  const getBadgeClass = (status: Downline["status"]) => {
    switch (status) {
      case "Jumlah":
        return "bg-blue-100 text-blue-800";
      case "Persen":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-h-70 overflow-y-auto mt-5">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm captalize tracking-wide border-b border-gray-200 sticky top-0 bg-white">
            <th className="py-2 px-4">Nama Downline</th>
            <th className="py-2 px-4">Tanggal Dibuat</th>
            <th className="py-2 px-4">Status Komisi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr
              key={d.id}
              className={`${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="py-2 px-4 text-sm">{d.name}</td>
              <td className="py-2 px-4 text-sm">{d.dateCreated}</td>
              <td className="py-2 px-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm text-center font-medium w-25 ${getBadgeClass(
                    d.status
                  )}`}
                >
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownlineTable;
