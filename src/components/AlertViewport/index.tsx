import { useAlert } from "../../context/AlertContext";
import { useEffect, useState } from "react";

export default function AlertViewport() {
  const { state, hideAlert } = useAlert();
  const [show, setShow] = useState(false);

  // animasi fade/slide ringan
  useEffect(() => {
    setShow(state.open);
  }, [state.open]);

  const colorByVariant =
    state.variant === "success"
      ? "bg-green-600 text-white"
      : state.variant === "error"
      ? "bg-red-600 text-white"
      : "bg-gray-900 text-white";

  return (
    <div
      // parent RootLayout harus punya container relatif
      className={`pointer-events-none absolute left-3 right-3 bottom-24 z-50 flex justify-center`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`
          pointer-events-auto max-w-[320px] w-full rounded-2xl shadow-lg ${colorByVariant}
          px-4 py-3 transition-all duration-300
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        `}
        role="alert"
      >
        <div className="flex items-start gap-3">
          <span className="text-sm leading-5">{state.message}</span>
          <button
            onClick={hideAlert}
            className="ml-auto -m-1 p-1 rounded hover:bg-white/10"
            aria-label="Tutup"
            type="button"
          >
            <i className="bx bx-x text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
