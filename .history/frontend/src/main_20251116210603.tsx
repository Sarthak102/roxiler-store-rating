// frontend/src/main.tsx (example)

import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import "./index.css"; // tailwind import (see below)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </AuthProvider>
);
