import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Variant = "success" | "error" | "info";
type AlertState = { open: boolean; message: string; variant: Variant };

type Ctx = {
  showAlert: (message: string, variant?: Variant, durationMs?: number) => void;
  hideAlert: () => void;
  state: AlertState;
};

const AlertContext = createContext<Ctx | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  // ⬅️ pakai ReactNode
  const [state, setState] = useState<AlertState>({
    open: false,
    message: "",
    variant: "info",
  });

  // Lebih aman lintas-env
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideAlert = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const showAlert = useCallback(
    (message: string, variant: Variant = "info", durationMs = 2200) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setState({ open: true, message, variant });
      timerRef.current = setTimeout(() => {
        setState((s) => ({ ...s, open: false }));
        timerRef.current = null;
      }, durationMs);
    },
    []
  );

  const value = useMemo(
    () => ({ showAlert, hideAlert, state }),
    [showAlert, hideAlert, state]
  );

  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
}

export function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used within AlertProvider");
  return ctx;
}
