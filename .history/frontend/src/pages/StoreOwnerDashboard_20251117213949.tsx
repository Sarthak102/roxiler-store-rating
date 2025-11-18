import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import { getMyStore } from "../services/storeOwnerService";

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const data = await getMyStore();
      setStore(data);
    })();
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Store Owner Dashboard</h1>

        {!store ? (
          <Layout>
            <div className="p-6">
              <div className="panel p-6 rounded-xl text-center text-gray-600">
                You have not been assigned a store yet. Please contact the
                administrator.
              </div>
            </div>
          </Layout>
        ) : (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">{store.name}</h2>
            <p className="text-gray-500">{store.address}</p>

            <div className="flex items-center gap-6 mt-4">
              <div className="text-center">
                <p className="text-sm text-muted">Average Rating</p>
                <p className="text-4xl font-bold">{store.avg_rating}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
