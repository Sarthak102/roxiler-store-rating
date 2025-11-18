import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import { getMyRatings } from "../services/storeOwnerService";

export default function StoreOwnerRatings() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getMyRatings();
      setData(res);
    })();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Ratings from Users</h1>

        {!data ? (
          <div className="p-6">
        <div className="panel p-6 rounded-xl text-center text-gray-600">
          You have not been assigned a store yet.  
          No ratings to show.
        </div>
      </div>
        ) : (
          <>
            <Card className="p-4">
              <h2 className="text-xl font-semibold">{data.store.name}</h2>
              <p className="text-gray-500">{data.store.address}</p>
            </Card>

            <div className="space-y-3">
              {data.ratings.length === 0 ? (
                <div>No ratings submitted yet.</div>
              ) : (
                data.ratings.map((r: any, idx: number) => (
                  <Card key={idx} className="p-4">
                    <div className="font-medium">{r.user_name}</div>
                    <div className="text-sm text-gray-500">{r.user_email}</div>
                    <div className="mt-1">
                      Rating: <b>{r.rating}</b>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
