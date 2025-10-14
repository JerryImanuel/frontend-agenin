// src/pages/Profile/index.tsx
import { useEffect, useState } from "react";
import { getProfileById, getMyProfile, type UserProfile } from "../../services/AuthAPI/getProfile";
import { getUserIdFromAuth } from "../../utils/auth";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const uid = getUserIdFromAuth();
        const res = uid ? await getProfileById(uid) : await getMyProfile();
        setProfile(res.results);
      } catch (e: any) {
        setError(e?.message || "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="px-5 py-3">Memuat profil...</div>;
  if (error) return <div className="px-5 py-3 text-red-500">{error}</div>;
  if (!profile) return <div className="px-5 py-3">Profil tidak ditemukan.</div>;

  return (
    <div className="px-5 py-4">
      <h1 className="text-lg font-semibold mb-4">Profil Saya</h1>
      <div className="space-y-2">
        <p><span className="font-medium">UserID:</span> {profile.userId}</p>
        <p><span className="font-medium">Nama:</span> {profile.userFullName}</p>
        <p><span className="font-medium">Email:</span> {profile.userEmail}</p>
        <p><span className="font-medium">Nomor HP:</span> {profile.userPhoneNumber}</p>
        <p><span className="font-medium">Role:</span> {profile.roleName}</p>
      </div>
    </div>
  );
}
