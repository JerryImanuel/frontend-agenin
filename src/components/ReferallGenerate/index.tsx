import { useState } from "react";

type ReferralGenerateProps = {
  code: string;
  className?: string;
};

export default function ReferralGenerate({
  code,
  className = "",
}: ReferralGenerateProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const t = document.createElement("textarea");
      t.value = code;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <p className="font-medium mb-2 text-xs">Kode Referral</p>
      <div className="card bg-blue-100 text-primary py-2 px-4 rounded-2xl shadow w-full active:scale-[0.99] transition">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-sm tracking-wide">{code}</h1>

          <div className="flex flex-row items-center">
            {copied && (
              <div className="text-sm mr-2 text-blue">Kode disalin</div>
            )}
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Salin kode referral"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl hover:bg-blue-200 active:scale-[0.98] transition"
              title="Salin"
            >
              <i className="bx bx-copy text-xl text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
