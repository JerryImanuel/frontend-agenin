type Downline = {
  id: number;
  name: string;
  jumlahKomisi: string;
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
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm captalize tracking-wide border-b border-gray-200 sticky top-0 bg-white">
            <th className="py-2 px-4 font-semibold">Nama Lengkap</th>
            <th className="py-2 px-4 font-semibold">Komisi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
            <tr
              key={d.id}
              className={`${
                idx % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-gray-100 transition`}
            >
              <td className="py-2 px-4">{d.name}</td>
              <td className="py-2 px-4">{d.jumlahKomisi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownlineTable;
