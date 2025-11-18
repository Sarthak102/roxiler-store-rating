// frontend/src/main.tsx (excerpt)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>
);