// frontend/src/pages/StoresDashboard.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import Button from "../components/ui/button";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

type Store = {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  avg_rating?: number | null;
  user_rating?: number | null;
};

export default function StoresDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      await fetchStores();
    })();
  }, []);

  async function fetchStores(search = "") {
    try {
      setLoading(true);
      const res = await api.get("/stores", { params: { q: search } });
      // API expected to return { data: Store[], total: number } or { stores: [...] }
      // adapt depending on your backend - try common shapes:
      const payload = res.data;
      const list: Store[] = payload.data ?? payload.stores ?? payload;
      setStores(list);
    } catch (err) {
      console.error("Failed to load stores", err);
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  function onSearchSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    fetchStores(q);
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Stores</h1>

          <div className="flex gap-2 items-center">
            <form onSubmit={onSearchSubmit} className="flex gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name or address"
                className="border rounded px-3 py-2"
              />
              <Button onClick={() => fetchStores(q)}>Search</Button>
            </form>

            {/* If admin visits stores page, provide quick link to admin stores management */}
            {user?.role === "admin" && (
              <Link to="/admin/stores">
                <Button variant="outline">Admin Stores</Button>
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : stores.length === 0 ? (
          <div className="text-center text-gray-500">No stores found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((s) => (
              <Card key={s.id} className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{s.name}</h3>
                    <p className="text-sm text-gray-500">{s.address}</p>
                    <p className="text-sm text-muted mt-2">
                      Avg rating: {s.avg_rating ?? "—"}
                    </p>
                    <p className="text-sm text-muted">
                      Your rating: {s.user_rating ?? "You haven't rated"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* link to a store details / rating modal */}
                    <Link to={`/stores/${s.id}`}>
                      <Button>View</Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        /* open rating modal if you have one */
                      }}
                    >
                      Rate
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
