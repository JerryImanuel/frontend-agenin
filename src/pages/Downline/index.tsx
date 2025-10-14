import { useState } from "react";
import DownlineTable from "../../components/DownlineTable";

const downlineData = [
  { id: 1, name: "Budi Santoso", jumlahKomisi: "Rp 100.000" },
  { id: 2, name: "Siti Aisyah", jumlahKomisi: "Rp 100.000" },
  { id: 3, name: "Andi Pratama", jumlahKomisi: "Rp 100.000" },
  { id: 4, name: "Ahmad Bustomi", jumlahKomisi: "Rp 100.000" },
  { id: 5, name: "Tardi Manalu", jumlahKomisi: "Rp 100.000" },
  { id: 6, name: "David Corenswet", jumlahKomisi: "Rp 100.000" },
  { id: 7, name: "Andrew Garfield", jumlahKomisi: "Rp 100.000" },
];

const Downline = () => {
  const referralCode = "A7DHSNE63TG";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Gagal menyalin kode:", err);
    }
  };

  return (
    <div className="mt-2 px-5">
      <div className="card bg-gray-50/30 border border-dashed px-4 py-3 rounded-2xl mb-3">
        <p className="text-xs text-sky-950 font-normal mb-2">
          Generate kode untuk dibagikan kepada agen, tiap transaksi akan
          menghasilkan pendapatan komisi
        </p>
        <button className="bg-sky-950 text-white px-4 py-2 font-normal rounded-xl">
          Buat Kode Referral
        </button>
      </div>
      <div className="card bg-white px-5 py-3 rounded-2xl mb-3 shadow relative">
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-xs text-slate-700 font-normal mb-1">
              Kode Referall
            </p>
            <h1 className="font-bold text-slate-700 text-lg">{referralCode}</h1>
          </div>
          <div>
            <button
              onClick={handleCopy}
              className="text-sky-900 font-medium hover:text-sky-700 transition"
            >
              {copied ? (
                <span className="font-medium">Kode disalin!</span>
              ) : (
                <i className="bx bx-copy text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-white text-sky-900 px-2 pb-4 pt-1 rounded-2xl shadow">
        <DownlineTable data={downlineData} />
      </div>
    </div>
  );
};

export default Downline;
