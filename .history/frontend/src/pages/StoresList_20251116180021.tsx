// frontend/src/pages/StoresList.tsx
import React, { useEffect, useState } from "react";
import { fetchStores, Store } from "../services/storeService";
import { fetchStores } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import useAuth from "../hooks/useAuth";

export default function StoresList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchStores({ limit: 50 });
      setStores(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Optimistic update handler invoked by RatingModal when save succeeds
  const handleSavedOptimistic = (
    storeId: string,
    saved: { rating: number; comment?: string }
  ) => {
    setStores((prev) => {
      return prev.map((s) => {
        if (s.id !== storeId) return s;

        const prevCount = s.ratings_count ?? 0;
        const prevAvg = s.avg_rating ?? 0;

        // If user previously had a rating, we should adjust average differently.
        // If backend returned user_rating previously, use it; otherwise assume new.
        const prevUserRating = s.user_rating ?? null;
        let newCount = prevCount;
        let newAvg = prevAvg;

        if (prevUserRating === null || prevUserRating === undefined) {
          // new rating added
          newCount = prevCount + 1;
          newAvg = (prevAvg * prevCount + saved.rating) / newCount;
        } else {
          // updating existing rating: replace previous rating in average
          newAvg =
            (prevAvg * prevCount - prevUserRating + saved.rating) /
            (prevCount || 1);
        }

        return {
          ...s,
          ratings_count: newCount,
          avg_rating: Number.isFinite(newAvg)
            ? Math.round(newAvg * 100) / 100
            : newAvg,
          user_rating: saved.rating,
        };
      });
    });
  };

  const openRateFor = (id: string) => setActiveStoreId(id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Stores</h2>
        <div className="text-sm text-gray-600">
          {user ? `Logged in as ${user.name}` : "Not logged in"}
        </div>
      </div>

      {loading ? (
        <div>Loading stores...</div>
      ) : (
        <div className="grid gap-4">
          {stores.length === 0 && <div>No stores yet.</div>}
          {stores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              userRating={s.user_rating ?? null}
              onRate={() => openRateFor(s.id)}
            />
          ))}
        </div>
      )}

      {activeStoreId && (
        <RatingModal
          storeId={activeStoreId}
          onClose={() => setActiveStoreId(null)}
          onSaved={(saved) => {
            // optimistic UI
            handleSavedOptimistic(activeStoreId, saved);
          }}
        />
      )}
    </div>
  );
}
