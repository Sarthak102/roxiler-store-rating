
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/card";
import Button from "../../components/ui/button";
import { getStoresAdmin } from "../../services/adminService";
import { Link } from "react-router-dom";

type Store = {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  avg_rating?: number | null;
};

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getStoresAdmin({ page: 1, limit: 50 });
        setStores(res.data ?? res);
      } catch (err) {
        console.error("Failed to load admin stores", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Stores (Admin)</h1>
          <Link to="/admin/create-store">
            <Button>Create store</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : stores.length === 0 ? (
          <div className="text-center text-gray-500">No stores found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {stores.map((s) => (
              <Card
                key={s.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm text-gray-500">{s.email}</div>
                  <div className="text-sm text-muted">{s.address}</div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="text-sm text-muted">
                    Rating: {s.avg_rating ?? "—"}
                  </div>
                  <Link to={`/admin/stores/${s.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
