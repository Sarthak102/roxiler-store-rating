// frontend/src/pages/StoresDashboard.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { fetchStores } from "../services/storeService";
import type { Store } from "../services/storeService";
import StoreCard from "../components/StoreCard";
import RatingModal from "../components/RatingModal";
import useAuth from "../hooks/useAuth";

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

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(query || undefined), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSavedOptimistic = (storeId: string, saved: { rating: number; comment?: string }) => {
    setStores(prev => prev.map(s => {
      if (s.id !== storeId) return s;
      const prevCount = s.ratings_count ?? 0;
      const prevAvg = s.avg_rating ?? 0;
      const prevUserRating = s.user_rating ?? null;

      let newCount = prevCount;
      let newAvg = prevAvg;

      if (prevUserRating === null || prevUserRating === undefined) {
        newCount = prevCount + 1;
        newAvg = ((prevAvg * prevCount) + saved.rating) / newCount;
      } else {
        newAvg = ((prevAvg * prevCount) - prevUserRating + saved.rating) / (prevCount || 1);
      }

      return {
        ...s,
        ratings_count: newCount,
        avg_rating: Number.isFinite(newAvg) ? Math.round(newAvg * 100) / 100 : newAvg,
        user_rating: saved.rating
      };
    }));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <Header onSearch={setQuery} />

        <div className="mt-6 grid gap-4">
          {loading && <div className="text-[var(--muted)]">Loading stores...</div>}
          {!loading && stores.length === 0 && <div className="text-[var(--muted)]">No stores yet.</div>}
          {stores.map(s => (
            <StoreCard key={s.id} store={s} userRating={s.user_rating ?? null} onRate={() => setActiveStoreId(s.id)} />
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