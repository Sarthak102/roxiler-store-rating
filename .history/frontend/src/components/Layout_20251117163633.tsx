// frontend/src/components/Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen app-bg antialiased">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-6">
        <div className="flex gap-6">
          <aside className="w-64">
            <Sidebar />
          </aside>

          <main className="flex-1">
            {/* Pages render their own content (including exactly one search in StoresDashboard) */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
