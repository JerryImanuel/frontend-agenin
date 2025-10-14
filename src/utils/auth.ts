export function getUserIdFromAuth(): string | null {
  const direct = localStorage.getItem("userId");
  if (direct) return direct;

  try {
    const raw = localStorage.getItem("results");
    if (raw) {
      const obj = JSON.parse(raw);
      return (
        obj?.userId ||
        obj?.userEntityDTOId ||
        obj?.id ||
        null
      );
    }
  } catch {
  }

  const token = localStorage.getItem("token");
  if (token && token.split(".").length === 3) {
    try {
      const payloadJson = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return payloadJson?.USER_ID || payloadJson?.sub || null;
    } catch {
    }
  }

  return null;
}
