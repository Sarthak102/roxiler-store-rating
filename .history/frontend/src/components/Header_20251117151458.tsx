import React from "react";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative w-[560px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            placeholder="Search"
            className="pl-10 pr-4 py-2 w-full rounded-full border panel focus:ring-2 focus:ring-green-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="px-3 py-2">
            Filters
          </Button>
          <Button className="px-3 py-2">Create appointment</Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-600">
          Hi, {user?.name.split(" ")[0] ?? "Guest"}
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border">
          <img
            src="/avatar-placeholder.png"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
