import React, { useState } from "react";
import type { Store } from "../services/storeService";
import Button from "./ui/button";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  store: Store;
  userRating?: number | null;
  onRate: () => void;
};

export default function StoreCard({ store, userRating = null, onRate }: Props) {
  const [open, setOpen] = useState(false);
  const avg = store.avg_rating ?? 0;
  const avgRounded = avg ? Math.round(avg * 10) / 10 : null;

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{store.name}</h3>
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{avgRounded ?? "—"}</span>
              <span className="text-xs text-gray-400">
                ({store.ratings_count ?? 0})
              </span>
            </div>
          </div>
          {store.address && (
            <div className="text-sm text-gray-600 mt-2">{store.address}</div>
          )}
          <div className="mt-3 text-sm text-gray-500">
            {userRating ? `Your rating: ${userRating}★` : "You haven't rated"}
          </div>
        </div>

        <div className="flex items-start flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            <Button onClick={onRate} size="sm">
              Rate
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28 }}
            className="mt-3 overflow-hidden"
          >
            <div className="border-t pt-3 text-sm text-gray-700">
              <div>
                <strong>Details:</strong>
              </div>
              <div className="mt-2">
                Ratings count: {store.ratings_count ?? 0}
              </div>
              <div className="mt-1">Avg rating: {avgRounded ?? "—"}</div>
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" size="sm">
                  View
                </Button>
                <Button variant="outline" size="sm">
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
