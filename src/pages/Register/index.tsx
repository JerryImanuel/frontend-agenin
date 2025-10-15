import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/AuthAPI/register";

type Step1 = { fullName: string; email: string; phone: string };
type Step2 = { referral: string };
type Step3 = { password: string; confirm: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{8,}$/;

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [s1, setS1] = useState<Step1>({ fullName: "", email: "", phone: "" });
  const [s2, setS2] = useState<Step2>({ referral: "" });
  const [s3, setS3] = useState<Step3>({ password: "", confirm: "" });

  const s1Error = useMemo(() => {
    const e: Partial<Record<keyof Step1, string>> = {};
    if (!s1.fullName.trim()) e.fullName = "Nama lengkap wajib diisi.";
    if (!s1.email.trim()) e.email = "Email wajib diisi.";
    else if (!emailRegex.test(s1.email)) e.email = "Format email tidak valid.";
    if (!s1.phone.trim()) e.phone = "Nomor telepon wajib diisi.";
    else if (!phoneRegex.test(s1.phone)) e.phone = "Nomor telepon tidak valid.";
    return e;
  }, [s1]);

  const s2Error = useMemo(() => ({}), [s2]);

  const s3Error = useMemo(() => {
    const e: Partial<Record<keyof Step3, string>> = {};
    if (!s3.password) e.password = "Kata sandi wajib diisi.";
    else if (s3.password.length < 8) e.password = "Minimal 8 karakter.";
    if (!s3.confirm) e.confirm = "Konfirmasi kata sandi wajib diisi.";
    else if (s3.confirm !== s3.password) e.confirm = "Konfirmasi tidak cocok.";
    return e;
  }, [s3]);

  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canNext1 = Object.keys(s1Error).length === 0;
  const canNext2 = Object.keys(s2Error).length === 0;
  const canSubmit = Object.keys(s3Error).length === 0;

  const handleNext = () => {
    setTouched(true);
    if (step === 1 && !canNext1) return;
    if (step === 2 && !canNext2) return;
    setTouched(false);
    setStep(step === 1 ? 2 : 3);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await registerUser({
        userFullName: s1.fullName.trim(),
        userEmail: s1.email.trim(),
        userPhoneNumber: s1.phone.trim(),
        userPassword: s3.password,
        userReferralCode: s2.referral?.trim() || null,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setSubmitError((err as Error).message || "Registrasi gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center mb-8 mt-8">
        <img
          src="/src/assets/image/logo-agenin.png"
          className="w-16 h-16"
          alt="Agenin"
        />
        <p className="mt-2 font-semibold">Daftar Akun</p>
      </div>

      <div className="relative w-full px-4 mb-4" aria-label="Progress">
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200" />
        {(() => {
          const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;
          return (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-[2px] bg-sky-600 transition-all duration-300"
              style={{ width: `calc((100% - 2rem) * ${progressPct / 100})` }}
            />
          );
        })()}
        <ol className="relative z-10 flex items-center justify-between w-full">
          {[1, 2, 3].map((i) => {
            const isCurrent = step === i;
            const isCompleted = step > i;
            const circleClass = isCurrent
              ? "bg-slate-300 text-sky-900"
              : isCompleted
              ? "bg-sky-800 text-white"
              : "bg-gray-200 text-gray-500";
            return (
              <li key={i} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold ${circleClass}`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {i}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="px-2">
          {step === 1 && (
            <>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-2">
                  Nama Lengkap
                </label>
                <input
                  className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={s1.fullName}
                  onChange={(e) =>
                    setS1((v) => ({ ...v, fullName: e.target.value }))
                  }
                  placeholder="Nama lengkap"
                  required
                />
                {touched && s1Error.fullName && (
                  <p className="text-red-500 text-xs mb-2">
                    {s1Error.fullName}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={s1.email}
                  onChange={(e) =>
                    setS1((v) => ({ ...v, email: e.target.value }))
                  }
                  placeholder="nama@email.com"
                  required
                />
                {touched && s1Error.email && (
                  <p className="text-red-500 text-xs mb-2">{s1Error.email}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium mb-2">
                  Nomor Telepon
                </label>
                <input
                  className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={s1.phone}
                  onChange={(e) =>
                    setS1((v) => ({ ...v, phone: e.target.value }))
                  }
                  placeholder="08xxxxxxxxxx"
                  required
                />
                {touched && s1Error.phone && (
                  <p className="text-red-500 text-xs mb-2">{s1Error.phone}</p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="mb-3">
              <label className="block text-xs font-medium mb-2">
                Kode Referral
              </label>
              <input
                className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                value={s2.referral}
                onChange={(e) => setS2({ referral: e.target.value })}
                placeholder="Masukkan kode referral (opsional)"
              />
            </div>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label className="block text-xs font-medium mb-2">
                  Buat Kata Sandi
                </label>
                <input
                  type="password"
                  className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={s3.password}
                  onChange={(e) =>
                    setS3((v) => ({ ...v, password: e.target.value }))
                  }
                  placeholder="Minimal 8 karakter"
                />
                {touched && s3Error.password && (
                  <p className="text-red-500 text-xs mb-2">
                    {s3Error.password}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <input
                  type="password"
                  className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
                  value={s3.confirm}
                  onChange={(e) =>
                    setS3((v) => ({ ...v, confirm: e.target.value }))
                  }
                  placeholder="Ulangi kata sandi"
                  required
                />
                {touched && s3Error.confirm && (
                  <p className="text-red-500 text-xs mb-2">{s3Error.confirm}</p>
                )}
              </div>
            </>
          )}
        </div>

        {submitError && (
          <p className="text-red-500 text-xs text-center mb-2">{submitError}</p>
        )}

        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-full border-2 border-sky-900 text-sky-900 py-2 text-sm rounded-2xl hover:bg-sky-900 hover:text-white transition"
            >
              Kembali
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              aria-disabled={
                (step === 1 && !canNext1) || (step === 2 && !canNext2)
              }
              className={`w-full bg-sky-900 border-2 border-sky-900 text-white text-sm py-2 rounded-2xl font-normal transition ${
                (step === 1 && !canNext1) || (step === 2 && !canNext2)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-sky-900"
              }`}
            >
              Lanjut
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              aria-disabled={!canSubmit || submitting}
              className={`w-full bg-sky-900 border-2 border-sky-900 text-white text-sm py-2 rounded-2xl font-normal transition ${
                !canSubmit || submitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-sky-900"
              }`}
            >
              {submitting ? "Memproses..." : "Daftar"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
