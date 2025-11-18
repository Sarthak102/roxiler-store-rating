// frontend/src/pages/StoresDashboard.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { fetchStores, Store } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/button";

export default function StoresDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  const load = async (q?: string) => {
    setLoading(true);
    try {
      const data = await fetchStores({ limit: 50, q });
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

  useEffect(() => {
    const t = setTimeout(() => load(query || undefined), 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSavedOptimistic = (
    storeId: string,
    saved: { rating: number; comment?: string }
  ) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id !== storeId) return s;
        const prevCount = s.ratings_count ?? 0;
        const prevAvg = s.avg_rating ?? 0;
        const prevUserRating = s.user_rating ?? null;

        let newCount = prevCount;
        let newAvg = prevAvg;

        if (prevUserRating === null || prevUserRating === undefined) {
          newCount = prevCount + 1;
          newAvg = (prevAvg * prevCount + saved.rating) / newCount;
        } else {
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
      })
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* SINGLE SEARCH BAR */}
        <div className="mb-6 flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stores by name or address..."
            className="header-search flex-1"
          />
          <Button variant="outline" onClick={() => load(query || undefined)}>
            Search
          </Button>
        </div>

        <div className="text-sm text-muted mb-4">Logged in as {user?.name}</div>

        <div className="space-y-4">
          {loading && <div className="text-muted">Loading stores...</div>}
          {!loading && stores.length === 0 && (
            <div className="text-muted">No stores yet.</div>
          )}
          {stores.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              userRating={s.user_rating ?? null}
              onRate={() => setActiveStoreId(s.id)}
            />
          ))}
        </div>

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
