// frontend/src/components/StoreCard.tsx
import React from "react";
import type { Store } from "../services/storeService";
import Button from "./ui/button";
import { Star } from "lucide-react";

type Props = {
  store: Store;
  userRating?: number | null;
  onRate: () => void; // opens modal
};

export default function StoreCard({ store, userRating = null, onRate }: Props) {
  const avg = store.avg_rating ?? null;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {store.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">{avg ?? "—"}</span>
              <span className="text-xs text-muted">
                ({store.ratings_count ?? 0})
              </span>
            </div>
          </div>

          {store.address && (
            <div className="text-sm text-muted mt-2">{store.address}</div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <div className="text-sm text-muted">
              {userRating ? (
                <>
                  Your rating: <strong>{userRating}★</strong>
                </>
              ) : (
                "You haven't rated"
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
      
          <Button onClick={onRate}>
            {userRating ? "Update rating" : "Rate"}
          </Button>
        </div>
      </div>
    </div>
  );
}
