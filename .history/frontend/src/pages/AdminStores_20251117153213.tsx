// frontend/src/pages/AdminStores.tsx
import React, { useEffect, useState } from "react";
import type { Store } from "../services/storeService";
import { fetchStores } from "../services/storeService";
import { Link, useLocation } from "react-router-dom";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import { Star } from "lucide-react";

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
    <Layout>
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Admin — Stores</h2>
        <div className="flex gap-2">
          <Link to="/admin/create-store">
            <Button>Create store</Button>
          </Link>
          <Link to="/admin/create-user">
            <Button variant="outline">Create user</Button>
          </Link>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      <div className="space-y-3">
        {loading && <div>Loading...</div>}
        {!loading && stores.length === 0 && <div>No stores yet.</div>}
        {!loading &&
          stores.map((s) => (
            <Card key={s.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.address}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <Star className="inline w-4 h-4 text-yellow-400" />{" "}
                    {s.avg_rating ?? "—"} • {s.ratings_count ?? 0} ratings
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
    <Layout></Layout>
  );
}
