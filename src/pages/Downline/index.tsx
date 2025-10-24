// src/pages/Downline.tsx
import { useEffect, useMemo, useState } from "react";
import DownlineTable from "../../components/DownlineTable";
import { useAlert } from "../../context/AlertContext";
import PageAlertTop from "../../components/PageAlertTop";
import {
  generateReferralCode,
  type ReferralCode,
} from "../../services/AuthAPI/generateReferralCode";
import { getUserIdFromAuth } from "../../utils/auth";
import {
  getUserDownline,
  type DownlineUser,
} from "../../services/AuthAPI/getUserDownline";
import { getReferralCode } from "../../services/AuthAPI/getReferralCode";

const LS_REFERRAL = "referralCode";

export default function Downline() {
  const { showAlert } = useAlert();

  const [referral, setReferral] = useState<ReferralCode | null>(null);
  const [refLoading, setRefLoading] = useState(false);
  const [refErr, setRefErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [downlines, setDownlines] = useState<DownlineUser[]>([]);
  const [dlLoading, setDlLoading] = useState(true);
  const [dlErr, setDlErr] = useState<string | null>(null);

  const referralCode = referral?.userReferralCode ?? "";
  const hasCode = Boolean(referralCode);

  // 1) Hydrate dari LocalStorage lalu refresh dari API agar data terbaru
  useEffect(() => {
    const saved = localStorage.getItem(LS_REFERRAL);
    if (saved) {
      try {
        setReferral(JSON.parse(saved) as ReferralCode);
      } catch {
        // ignore JSON error
      }
    }
    (async () => {
      try {
        const userId = getUserIdFromAuth();
        if (!userId) return;
        const fromApi = await getReferralCode(userId);
        if (fromApi) {
          setReferral(fromApi);
          localStorage.setItem(LS_REFERRAL, JSON.stringify(fromApi));
        }
      } catch {
        // silent: biarkan user generate manual
      }
    })();
  }, []);

  // 2) Load downline
  useEffect(() => {
    (async () => {
      setDlLoading(true);
      setDlErr(null);
      try {
        const userId = getUserIdFromAuth();
        if (!userId) throw new Error("User not logged in.");
        const data = await getUserDownline(userId);
        setDownlines(data || []);
      } catch (e: any) {
        const msg = (e?.message || "").toLowerCase();
        // Anggap kosong saat data tidak ditemukan
        if (
          msg.includes("downline not found") ||
          msg.includes("downline tidak ditemukan")
        ) {
          setDownlines([]);
          setDlErr(null);
        } else {
          setDlErr(e?.message || "Failed to fetch downlines.");
          // opsional: tampilkan toast
          // showAlert(e?.message || "Failed to fetch downlines.", "error");
        }
      } finally {
        setDlLoading(false);
      }
    })();
  }, []);

  // 3) Generate lalu fetch via getReferralCode agar format konsisten
  const handleGenerate = async () => {
    if (hasCode || refLoading) return; // cegah double-click
    setRefLoading(true);
    setRefErr(null);
    try {
      const userId = getUserIdFromAuth();
      if (!userId)
        throw new Error("User ID not found. Make sure you are logged in.");

      await generateReferralCode(userId); // trigger generate di backend
      const fresh = await getReferralCode(userId); // ambil hasil yang sudah ternormalisasi
      if (!fresh) throw new Error("Referral code is not available yet.");

      setReferral(fresh);
      localStorage.setItem(LS_REFERRAL, JSON.stringify(fresh));
      showAlert("Referral code generated.", "success");
    } catch (e: any) {
      setRefErr(e?.message || "Failed to generate referral code");
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
      <PageAlertTop />

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
                  Created:{" "}
                  {new Date(referral.userReferralCreatedAt).toLocaleString(
                    "id-ID",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )}
                </p>
              )}
            </div>
            <div>
              <button
                onClick={handleCopy}
                className="text-sky-900 font-medium hover:text-sky-700 transition"
                title="Copy code"
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
