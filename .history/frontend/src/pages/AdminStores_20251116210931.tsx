// frontend/src/pages/AdminStores.tsx
import React, { useEffect, useState } from "react";
import { fetchStores, Store } from "../services/storeService";
import { fetchStores, Store } from "../services/storeService";
import { useLocation, Link } from "react-router-dom";

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const message = (location.state as any)?.message as string | undefined;

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchStores({ limit: 100 });
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Admin — Stores</h2>
        <Link
          to="/admin/create-store"
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Create store
        </Link>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {stores.length === 0 && <div>No stores yet.</div>}
          {stores.map((s) => (
            <div
              key={s.id}
              className="border rounded p-3 flex justify-between items-start"
            >
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600">{s.address}</div>
                <div className="text-sm text-gray-600">
                  {s.ratings_count ?? 0} ratings • {s.avg_rating ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
