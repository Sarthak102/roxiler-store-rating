// frontend/src/components/Header.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function Header({
  onSearch,
}: {
  onSearch?: (q: string) => void;
}) {
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(q);
  };

  return (
    <div className="flex items-center justify-between">
      <form onSubmit={submit} className="flex items-center gap-3">
        <div className="relative w-[420px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stores by name or address..."
            className="pl-10 pr-4 py-2 w-full rounded-full panel text-[var(--brand-100)] placeholder:[var(--muted)] border border-transparent focus:border-[var(--brand-700)]"
          />
        </div>
        <button type="submit" className="pill">
          Search
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="text-sm text-[var(--muted)]">
          Hi, {user?.name?.split(" ")[0] ?? "Guest"}
        </div>
      </div>
    </div>
  );
}
