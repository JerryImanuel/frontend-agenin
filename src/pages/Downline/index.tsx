import { useEffect, useMemo, useState } from "react";
import DownlineTable from "../../components/DownlineTable";
import {
  generateReferralCode,
  type ReferralCode,
} from "../../services/AuthAPI/generateReferralCode";
import { getToken, getUserIdFromAuth } from "../../utils/auth";
import {
  getUserDownline,
  type DownlineUser,
} from "../../services/AuthAPI/getUserDownline";

const LS_REFERRAL = "referralCode";

export default function Downline() {
  const [referral, setReferral] = useState<ReferralCode | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [refErr, setRefErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [downlines, setDownlines] = useState<DownlineUser[]>([]);
  const [dlLoading, setDlLoading] = useState(true);
  const [dlErr, setDlErr] = useState<string | null>(null);

  const referralCode = referral?.userReferralCode ?? "";
  const hasCode = Boolean(referralCode);

  useEffect(() => {
    const saved = localStorage.getItem(LS_REFERRAL);
    if (saved) {
      try {
        setReferral(JSON.parse(saved) as ReferralCode);
      } catch {}
    }
  }, []);

  useEffect(() => {
    (async () => {
      setDlLoading(true);
      setDlErr(null);
      try {
        const token = getToken() || undefined;
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");
        const data = await getUserDownline(userId, token);
        setDownlines(data || []);
      } catch (e) {
        setDlErr((e as Error).message);
      } finally {
        setDlLoading(false);
      }
    })();
  }, []);

  const handleGenerate = async () => {
    if (hasCode) return;
    setRefLoading(true);
    setRefErr(null);
    try {
      const token = getToken() || undefined;
      const userId = getUserIdFromAuth();
      if (!userId)
        throw new Error("User ID not found. Make sure you are logged in.");

      const res = await generateReferralCode(userId, token);
      setReferral(res);
      localStorage.setItem(LS_REFERRAL, JSON.stringify(res));
    } catch (e) {
      const msg = (e as Error).message || "Failed to generate referral code";
      if (!msg.toLowerCase().includes("Already Have")) {
        setRefErr(msg);
      } else {
        const saved = localStorage.getItem(LS_REFERRAL);
        if (saved) {
          try {
            setReferral(JSON.parse(saved) as ReferralCode);
          } catch {}
        }
      }
    } finally {
      setRefLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const tableData = useMemo(
    () =>
      (downlines || []).map((d) => ({
        inviteeUserId: d.inviteeUserId,
        inviteeUserFullName: d.inviteeUserFullName,
        inviteeCommissionValue: Number(d.inviteeCommissionValue || 0),
      })),
    [downlines]
  );

  return (
    <div className="mt-2 px-5">
      {!hasCode && (
        <div className="card bg-gray-50/30 border border-dashed px-4 py-3 rounded-2xl mb-3">
          <p className="text-xs text-sky-950 font-normal mb-2">
            Generate codes to share with agents; each transaction will generate
            commission income.
          </p>
          <button
            onClick={handleGenerate}
            disabled={refLoading}
            className={`bg-sky-950 text-white px-4 py-2 font-normal rounded-xl transition ${
              refLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-900"
            }`}
          >
            {refLoading ? "Processing..." : "Generate Referral Code"}
          </button>
          {refErr && <p className="text-red-600 text-xs mt-2">{refErr}</p>}
        </div>
      )}

      {/* Kartu kode referral: tampil HANYA jika sudah ada */}
      {hasCode && (
        <div className="card bg-white px-5 py-3 rounded-2xl mb-3 shadow relative">
          <div className="flex flex-row items-center justify-between">
            <div>
              <p className="text-xs text-slate-700 font-normal mb-1">
                Referral Code
              </p>
              <h1 className="font-bold text-slate-700 text-lg">
                {referralCode}
              </h1>
              {referral?.userReferralCreatedAt && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Dibuat:{" "}
                  {new Date(referral.userReferralCreatedAt).toLocaleString(
                    "id-ID",
                    { dateStyle: "medium", timeStyle: "short" }
                  )}
                </p>
              )}
            </div>
            <div>
              <button
                onClick={handleCopy}
                className="text-sky-900 font-medium hover:text-sky-700 transition"
                title="Salin kode"
              >
                {copied ? (
                  <span className="font-medium text-xs">Copied!</span>
                ) : (
                  <i className="bx bx-copy text-2xl"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-white p-3 rounded-2xl shadow">
        <span className="mb-1 font-medium">List Downline</span>
        <div>
          {dlLoading ? (
            <p className="px-3 pb-3 text-sm text-gray-500">
              Loading downlines...
            </p>
          ) : dlErr ? (
            <p className="px-3 pb-3 text-sm text-red-600">{dlErr}</p>
          ) : tableData.length === 0 ? (
            <div className="h-90 w-full flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <img
                  src="/src/assets/image/empty.png"
                  className="w-27"
                  alt="Empty"
                />
              </div>
              <p className="px-3 py-3 text-sm text-gray-500">
                No Downline Available
              </p>
            </div>
          ) : (
            <DownlineTable data={tableData} />
          )}
        </div>
      </div>
    </div>
  );
}
