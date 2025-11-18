/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = {
  id: number;
  type: "success" | "error" | "info";
  message: string;
};
type ToastContextType = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Date.now() }]);
    // remove after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3500);
  }, []);

  const value = {
    success: (msg: string) => push({ type: "success", message: msg }),
    error: (msg: string) => push({ type: "error", message: msg }),
    info: (msg: string) => push({ type: "info", message: msg }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              marginBottom: 8,
              padding: "10px 14px",
              borderRadius: 8,
              background:
                t.type === "success"
                  ? "#1DBF73"
                  : t.type === "error"
                  ? "#F56565"
                  : "#CBD5E1",
              color: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const c = useContext(ToastContext);
  if (!c) throw new Error("useToast must be used inside ToastProvider");
  return c;
}
