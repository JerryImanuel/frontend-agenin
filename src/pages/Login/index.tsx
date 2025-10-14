import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await loginWithPassword({ username, password, expiresInMins: 30 });
      navigate(location.state?.from || "/", { replace: true });
    } catch (e: any) {
      setErr(
        typeof e?.publicMessage === "string"
          ? e.publicMessage
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center justify-center mb-10 mt-30">
        <img
          src="/src/assets/image/logo-agenin.png"
          className="w-20 h-20"
          alt="Agenin"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col justify-between"
      >
        <div className="px-2">
          <label className="block text-xs font-medium mb-1">Username</label>
          <input
            className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-sky-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="emilys"
            required
          />
          <label className="block text-xs font-medium mb-1">Kata Sandi</label>
          <input
            type="password"
            className="w-full border text-sm border-gray-300 rounded-xl px-3 py-2 mb-1 focus:outline-none focus:ring-2 focus:ring-sky-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="emilyspass"
            required
          />

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-2 mt-3 mb-2">
              {err}
            </div>
          )}

          <div className="text-center">
            <small>
              Belum memiliki akun? Silahkan{" "}
              <Link
                to="/register"
                className="text-primary font-semibold underline underline-offset-2"
              >
                Daftar
              </Link>
            </small>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-900 border-2 border-sky-900 text-sm text-white py-2 rounded-2xl font-normal hover:bg-primary/90 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
