// frontend/src/pages/StoresList.tsx
import React, { useEffect, useState } from "react";
import { fetchStores, Store } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

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
      // Optionally get user's ratings per store if backend provides endpoint; otherwise, we fetch per store when opening modal.
      // Clear map for fresh data
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

  const handleOpenRate = async (storeId: string) => {
    // try to fetch current user's rating for this store, if any (optional)
    try {
      // backend doesn't expose endpoint to get current user's rating directly for list; we'll try a GET /stores/:id which returns stats only
      // For now attempt to GET /stores/:id/ratings and catch 403 if user isn't owner/admin; but that endpoint requires owner/admin
      // So we rely on the store list not providing user rating by default.
      setActiveStoreId(storeId);
    } catch (err) {
      console.error(err);
      setActiveStoreId(storeId);
    }
  };

  const handleSaved = async () => {
    // reload stores to refresh avg/rating counts
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
