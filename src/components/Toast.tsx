import { useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let toasts: ToastMessage[] = [];

export function toast(message: string, type: ToastType = "success") {
  toasts = [...toasts, { id: ++toastId, message, type }];
  window.dispatchEvent(new CustomEvent("toast-update"));
}

export function ToastContainer() {
  const [toastList, setToastList] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = () => {
      setToastList([...toasts]);
    };
    window.addEventListener("toast-update", handler);
    handler();
    return () => window.removeEventListener("toast-update", handler);
  }, []);

  useEffect(() => {
    if (toastList.length > 0) {
      const timer = setTimeout(() => {
        toasts = toasts.slice(1);
        setToastList([...toasts]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastList]);

  return (
    <div className="toast-container">
      {toastList.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === "success" && <span>✓ </span>}
          {t.type === "error" && <span>✕ </span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}