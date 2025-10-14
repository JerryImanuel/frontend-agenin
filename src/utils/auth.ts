function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([$()*+./?[\\\]^{|}])/g, "\\$1") + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

export function getToken(): string | null {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    readCookie("token") || 
    null
  );
}

export function getUserIdFromAuth(): string | null {
  const direct = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  if (direct) return direct;

  try {
    const raw = localStorage.getItem("results") || sessionStorage.getItem("results");
    if (raw) {
      const obj = JSON.parse(raw);
      return obj?.userId || obj?.userEntityDTOId || obj?.id || null;
    }
  } catch {}

  const token = getToken();
  if (token && token.split(".").length === 3) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      return payload?.USER_ID || payload?.sub || null;
    } catch {}
  }

  return null;
}
