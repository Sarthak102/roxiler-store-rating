// frontend/src/components/StoreCard.tsx
import React from "react";
import type { Store } from "../services/storeService";
import Button from "./ui/button";
import { Star } from "lucide-react";

type Props = {
  store: Store;
  userRating?: number | null;
  onRate: () => void;
};

export default function StoreCard({ store, userRating = null, onRate }: Props) {
  const avg = store.avg_rating ?? 0;
  const avgRounded = avg ? Math.round(avg * 10) / 10 : null;

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{store.name}</h3>
        {store.address && (
          <p className="text-sm text-gray-600">{store.address}</p>
        )}
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{avgRounded ?? "—"}</span>
            <span className="text-gray-500">({store.ratings_count ?? 0})</span>
          </div>
          {userRating ? (
            <div className="text-sm text-green-600">
              Your rating: {userRating}★
            </div>
          ) : (
            <div className="text-sm text-gray-500">You haven't rated</div>
          )}
        </div>
      </div>

      <div>
        <Button variant="default" onClick={onRate}>
          Rate
        </Button>
      </div>
    </div>
  );
}
