import { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";

export default function PageAlertTop() {
  const { state, hideAlert } = useAlert();
  const [show, setShow] = useState(false);

  useEffect(() => setShow(state.open), [state.open]);

  const colorByVariant =
    state.variant === "success"
      ? "bg-sky-800 text-white"
      : state.variant === "error"
      ? "bg-red-500 text-white"
      : "bg-gray-900 text-white";

  return (
    <div className="absolute bottom-21 inset-x-3 z-40 pointer-events-none">
      <div
        className={[
          colorByVariant,
          "rounded-2xl shadow-lg px-4 py-3 transition-all duration-300",
          show
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
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
