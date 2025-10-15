import { useEffect, useState } from "react";
import type { UserProfile } from "../../types/User/userprofile";
import { fetchUserProfile } from "../../services/AuthAPI/getProfile";

export function useUserProfile() {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const profile = await fetchUserProfile();
        if (mounted) setData(profile);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
