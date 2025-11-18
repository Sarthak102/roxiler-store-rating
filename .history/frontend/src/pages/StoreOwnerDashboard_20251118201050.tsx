// frontend/src/pages/StoreOwnerDashboard.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import { OwnerStore } from "../services/storeOwnerService";
import { getMyStores } from "../services/storeOwnerService";
import toast from "react-hot-toast";

export default function StoreOwnerDashboard() {
  const [stores, setStores] = useState<OwnerStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await getMyStores();
        setStores(list ?? []);
      } catch (err) {
        console.error("Failed to load owner stores", err);
        toast.error("Failed to load your stores");
        setStores([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Store Owner Dashboard</h1>

        {loading ? (
          <div className="panel p-6 rounded-xl text-center text-gray-600">
            Loading your stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="panel p-6 rounded-xl text-center text-gray-600">
            You have not been assigned any stores yet. Please contact the
            administrator.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((s) => (
              <Card key={s.id} className="p-5 space-y-3">
                <div>
                  <h2 className="text-lg font-semibold">{s.name}</h2>
                  <p className="text-sm text-gray-500">{s.address}</p>
                </div>

                <div className="flex items-center gap-8 mt-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Average Rating
                    </p>
                    <p className="text-2xl font-bold">{s.avg_rating ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Total Ratings
                    </p>
                    <p className="text-2xl font-bold">{s.ratings_count ?? 0}</p>
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
