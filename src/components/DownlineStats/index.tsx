type StatItem = {
  label: string;
  value: number | string;
  bg: string;
};

type DownlineStatsProps = {
  stats?: StatItem[];
};

const DownlineStats = ({ stats }: DownlineStatsProps) => {
  const defaultStats: StatItem[] = [
    { label: "Total Downline", value: 50, bg: "bg-primary" },
    { label: "Transaksi Berhasil", value: 40, bg: "bg-success" },
    { label: "Transaksi Ditunda", value: 30, bg: "bg-warning" },
    { label: "Transaksi Gagal", value: 7, bg: "bg-danger" },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="flex flex-col items-start justify-between gap-4">
      {displayStats.map((item, idx) => (
        <div
          key={idx}
          className={`card ${item.bg} p-5 rounded-2xl shadow w-full`}
        >
          <p className="text-white text-sm mb-1">{item.label}</p>
          <p className="text-white text-xl font-semibold">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DownlineStats;
