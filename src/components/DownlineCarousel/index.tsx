// src/components/DownlineCarousel.tsx
type Downline = {
  inviteeUserId: string;
  inviteeUserFullName: string;
  inviteeCommissionValue: number;
};

type Props = { data: Downline[] };

export default function DownlineCarousel({ data }: Props) {
  const displayData = data.slice(0, 3);

  if (!displayData || displayData.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-sm text-gray-500">
        Downline belum tersedia.
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="
          flex gap-2 px-1 py-2
          overflow-x-auto scroll-smooth
          snap-x snap-mandatory
          hide-scrollbar
          touch-pan-x overscroll-x-contain
        "
        // momentum scroll utk iOS Safari
        style={{ WebkitOverflowScrolling: "touch" as any }}
      >
        {data.map((d) => (
          <div
            key={d.inviteeUserId}
            className="
              snap-start shrink-0
              w-[260px] rounded-2xl bg-white p-4 shadow-sm
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] text-gray-500">Nama Downline</p>
                <p className="text-sm font-semibold text-sky-900 truncate">
                  {d.inviteeUserFullName}
                </p>
              </div>
              <span className="inline-block bg-emerald-600 text-white px-2 py-1.5 rounded-xl text-xs font-semibold">
                Rp {d.inviteeCommissionValue.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
