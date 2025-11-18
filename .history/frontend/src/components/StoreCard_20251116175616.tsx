// frontend/src/components/StoreCard.tsx
import type { Store } from "../services/storeService";

type Props = {
  store: Store;
  userRating?: number | null;
  onRate: () => void;
};

export default function StoreCard({ store, userRating = null, onRate }: Props) {
  const avg = store.avg_rating ?? 0;
  const avgRounded = avg ? Math.round(avg * 10) / 10 : null;

  return (
    <div className="border rounded-lg p-4 shadow-sm flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{store.name}</h3>
        {store.address && (
          <p className="text-sm text-gray-600">{store.address}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <div className="text-sm">
            <span className="font-semibold">{avgRounded ?? "—"}</span>
            <span className="text-gray-600">
              {" "}
              ({store.ratings_count ?? 0} ratings)
            </span>
          </div>
          {userRating ? (
            <div className="text-sm text-green-600">
              Your rating: {userRating}★
            </div>
          ) : (
            <div className="text-sm text-gray-500">You haven't rated</div>
          )}
        </div>
      </div>

      <div>
        <button
          onClick={onRate}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Rate
        </button>
      </div>
    </div>
  );
}
