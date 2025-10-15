import { useUserProfile } from "../../hooks/useUserProfile";

export default function ProfilePage() {
  const { data, loading, error } = useUserProfile();

  if (loading) return <p>Loading profile…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data) return <p>Profile kosong.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-3">Profile</h1>
      <div className="space-y-1">
        <div>
          <b>ID:</b> {data.userId}
        </div>
        <div>
          <b>Full Name:</b> {data.userFullName}
        </div>
        <div>
          <b>Email:</b> {data.userEmail}
        </div>
        <div>
          <b>Phone:</b> {data.userPhoneNumber}
        </div>
        <div>
          <b>Role:</b> {data.roleName}
        </div>
      </div>
    </div>
  );
}
