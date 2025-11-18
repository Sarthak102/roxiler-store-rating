import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/card";
import {
  getMyStores,
  getRatingsForOwnedStore,
} from "../../services/storeOwnerService";
import type { OwnerStore, OwnerRating } from "../../services/storeOwnerService";
import toast from "react-hot-toast";

export default function StoreOwnerRatings() {
  const [stores, setStores] = useState<OwnerStore[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [storeInfo, setStoreInfo] = useState<OwnerStore | null>(null);
  const [ratings, setRatings] = useState<OwnerRating[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        setLoadingStores(true);
        const list = await getMyStores();
        setStores(list ?? []);
        
        if (list && list.length > 0) {
          setSelectedStoreId(list[0].id);
        }
      } catch (err) {
        console.error("Failed to load owner stores", err);
        toast.error("Failed to load stores");
      } finally {
        setLoadingStores(false);
      }
    })();
  }, []);

  
  useEffect(() => {
    if (!selectedStoreId) {
      setStoreInfo(null);
      setRatings([]);
      return;
    }

    (async () => {
      try {
        setLoadingRatings(true);
        const res = await getRatingsForOwnedStore(selectedStoreId);
        setStoreInfo(res.store);
        setRatings(res.ratings ?? []);
      } catch (err) {
        console.error("Failed to load ratings for store", err);
        toast.error("Failed to load ratings");
        setStoreInfo(null);
        setRatings([]);
      } finally {
        setLoadingRatings(false);
      }
    })();
  }, [selectedStoreId]);

  
  const numericAvg: number | null = (() => {
    if (
      storeInfo &&
      storeInfo.avg_rating !== null &&
      storeInfo.avg_rating !== undefined
    ) {
      return Number(storeInfo.avg_rating);
    }
    if (!ratings.length) return null;
    const sum = ratings.reduce((acc, r) => acc + Number(r.rating), 0);
    return sum / ratings.length;
  })();

  const totalRatings = storeInfo?.ratings_count ?? ratings.length;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Ratings from Users</h1>

       
        <Card className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">Select a store</div>
            {loadingStores ? (
              <div className="text-gray-500 text-sm mt-1">
                Loading stores...
              </div>
            ) : stores.length === 0 ? (
              <div className="text-gray-500 text-sm mt-1">
                You have no stores assigned yet.
              </div>
            ) : (
              <div className="text-gray-700 text-sm mt-1">
                You own {stores.length} store{stores.length > 1 ? "s" : ""}.
              </div>
            )}
          </div>

          {stores.length > 0 && (
            <select
              className="border rounded px-3 py-2 text-sm w-full md:w-64"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </Card>

 
        {loadingRatings || !storeInfo ? (
          <Card className="p-4 mt-2">
            <div className="text-gray-500 text-sm">
              {selectedStoreId
                ? "Loading ratings..."
                : "Select a store to see its ratings."}
            </div>
          </Card>
        ) : (
          <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="font-semibold">{storeInfo.name}</div>
                <div className="text-sm text-gray-500">{storeInfo.address}</div>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Average Rating</div>
                  <div className="text-lg font-semibold">
                    {numericAvg !== null ? numericAvg.toFixed(2) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Ratings</div>
                  <div className="text-lg font-semibold">{totalRatings}</div>
                </div>
              </div>
            </div>
          </Card>
        )}

      
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-3">Users who rated</h2>

          {!selectedStoreId ? (
            <div className="text-gray-500 text-sm">
              Select a store to see its ratings.
            </div>
          ) : loadingRatings ? (
            <div className="text-gray-500 text-sm">Loading ratings...</div>
          ) : ratings.length === 0 ? (
            <div className="text-gray-500 text-sm">
              This store has not received any ratings yet.
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map((r) => (
                <div
                  key={`${r.user_id}-${r.created_at}`}
                  className="border rounded-lg px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <div className="font-medium">{r.user_name}</div>
                    <div className="text-xs text-gray-500">{r.user_email}</div>
                    {r.comment && (
                      <div className="text-sm mt-1 text-gray-700">
                        “{r.comment}”
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{r.rating} ★</div>
                    <div className="text-xs text-gray-500">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}
