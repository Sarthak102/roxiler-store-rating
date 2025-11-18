// frontend/src/pages/StoresList.tsx
import React, { useEffect, useState } from "react";
import type { fetchStores, Store } from "../services/storeService";
import type { fetchStores, Store } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import useAuth from "../hooks/useAuth";

export default function StoresList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [userRatingsMap, setUserRatingsMap] = useState<
    Record<string, number | null>
  >({});
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchStores({ limit: 50 });
      setStores(data);
      setUserRatingsMap({});
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

  const handleOpenRate = (storeId: string) => {
    setActiveStoreId(storeId);
  };

  const handleSaved = async () => {
    await load();
  };

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
              userRating={userRatingsMap[s.id] ?? null}
              onRate={() => handleOpenRate(s.id)}
            />
          ))}
        </div>
      )}

      {activeStoreId && (
        <RatingModal
          storeId={activeStoreId}
          onClose={() => setActiveStoreId(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
