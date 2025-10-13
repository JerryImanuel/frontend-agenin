type Downline = {
  id: number;
  name: string;
  dateCreated: string;
};

type DownlineTableProps = {
  data: Downline[];
};

const DownlineTable = ({ data }: DownlineTableProps) => {
  return (
    <div className="w-full max-h-60 overflow-auto hide-scrollbar">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm captalize tracking-wide border-b border-gray-200 sticky top-0 bg-white">
            <th className="py-2 px-4">Nama</th>
            <th className="py-2 px-4">Tanggal</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DownlineTable;
