import { useEffect, useState } from "react";
import { getProfile } from "../../services/AuthAPI/getProfile";
import { getUserIdFromAuth } from "../../utils/auth";
import type { UserProfile } from "../../types/User/userprofile";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = getUserIdFromAuth(); 

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setError("User belum login atau userId tidak ditemukan.");
        setLoading(false);
        return;
      }
      try {
        const res = await getProfile(userId);
        setProfile(res.results);
      } catch (err: any) {
        setError(err?.message || "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

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
