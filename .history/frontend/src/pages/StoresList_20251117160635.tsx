import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchStores } from "../services/storeService";
import type { Store } from "../services/storeService";
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSavedOptimistic = (
    storeId: string,
    saved: { rating: number; comment?: string }
  ) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              user_rating: saved.rating,
              ratings_count: (s.ratings_count ?? 0) + (s.user_rating ? 0 : 1),
              avg_rating: s.avg_rating
                ? Math.round(
                    (((s.avg_rating ?? 0) * (s.ratings_count ?? 0) +
                      saved.rating) /
                      ((s.ratings_count ?? 0) + (s.user_rating ? 0 : 1))) *
                      100
                  ) / 100
                : saved.rating,
            }
          : s
      )
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Stores</h2>
          <div className="text-sm text-gray-600">
            {user ? `Logged in as ${user.name}` : "Not logged in"}
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {stores.length === 0 && <div>No stores yet.</div>}
            {stores.map((s) => (
              <StoreCard
                key={s.id}
                store={s}
                userRating={s.user_rating ?? null}
                onRate={() => setActiveStoreId(s.id)}
              />
            ))}
          </div>
        )}

        {activeStoreId && (
          <RatingModal
            storeId={activeStoreId}
            onClose={() => setActiveStoreId(null)}
            onSaved={(saved) => handleSavedOptimistic(activeStoreId!, saved)}
          />
        )}
      </div>
    </Layout>
  );
}
