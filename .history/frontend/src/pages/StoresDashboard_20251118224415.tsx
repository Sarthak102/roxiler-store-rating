// frontend/src/pages/StoresDashboard.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/card";
import Button from "../../components/ui/button";
import RatingModal from "../components/RatingModal";
import { fetchStores, submitRating } from "../../services/storeService";
import type { Store } from "../../services/storeService";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function StoresDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [activeInitialRating, setActiveInitialRating] = useState<number | null>(
    null
  );
  const [activeInitialComment, setActiveInitialComment] = useState<
    string | null
  >("");

  const { user } = useAuth();

  useEffect(() => {
    loadStores();
  }, []);

  async function loadStores(search = "") {
    try {
      setLoading(true);
      const list = await fetchStores({ q: search, limit: 100 });
      setStores(list ?? []);
    } catch (err) {
      console.error("Failed to load stores", err);
      toast.error("Failed to load stores");
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  function openRatingModal(store: Store) {
    setActiveStoreId(store.id);
    setActiveInitialRating(store.user_rating ?? null);
    setActiveInitialComment("");
    setModalOpen(true);
  }

  async function handleSaved(saved: { rating: number; comment?: string }) {
    if (!activeStoreId) return;

    // optimistic UI update
    setStores((prev) =>
      prev.map((s) =>
        s.id === activeStoreId ? { ...s, user_rating: saved.rating } : s
      )
    );

    try {
      await submitRating(activeStoreId, {
        rating: saved.rating,
        comment: saved.comment,
      });
      toast.success("Rating saved");
      await loadStores(q);
    } catch (err) {
      toast.error("Failed to submit rating");
      await loadStores(q);
    } finally {
      setModalOpen(false);
      setActiveStoreId(null);
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Stores</h1>

          <div className="flex gap-2 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or address"
              className="border rounded px-3 py-2"
            />
            <Button onClick={() => loadStores(q)}>Search</Button>
          </div>
        </div>

        {/* Stores */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : stores.length === 0 ? (
          <div className="text-center text-gray-500">No stores found.</div>
        ) : (
          <div className="space-y-4">
            {stores.map((s) => (
              <Card
                key={s.id}
                className="p-5 flex justify-between items-center"
              >
                {/* LEFT SIDE */}
                <div>
                  <h3 className="text-lg font-semibold">{s.name}</h3>
                  <p className="text-sm text-gray-500">{s.address}</p>

                  <p className="text-sm mt-2">
                    Avg rating: {s.avg_rating ?? "—"}
                  </p>
                  <p className="text-sm">
                    Your rating: {s.user_rating ?? "You haven't rated"}
                  </p>
                </div>

                {/* RIGHT SIDE — only Rate button */}
                {user?.role !== "admin" && (
                  <Button onClick={() => openRatingModal(s)}>
                    {s.user_rating ? "Update rating" : "Rate"}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && activeStoreId && (
        <RatingModal
          storeId={activeStoreId}
          initialRating={activeInitialRating ?? null}
          initialComment={activeInitialComment ?? ""}
          onClose={() => {
            setModalOpen(false);
            setActiveStoreId(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </Layout>
  );
}
