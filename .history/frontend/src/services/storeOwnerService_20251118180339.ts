// frontend/src/services/storeOwnerService.ts
import api from "./api";

export type OwnerStore = {
  id: string;
  name: string;
  address?: string | null;
  avg_rating?: number | null;
  ratings_count?: number;
};

export type OwnerRating = {
  user_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment?: string | null;
  created_at: string;
};

export async function getMyStores(): Promise<OwnerStore[]> {
  const res = await api.get("/store-owner/stores");
  return res.data as OwnerStore[];
}

export async function getRatingsForOwnedStore(storeId: string): Promise<{
  store: OwnerStore;
  ratings: OwnerRating[];
}> {
  const res = await api.get(`/store-owner/stores/${storeId}/ratings`);
  return res.data as { store: OwnerStore; ratings: OwnerRating[] };
}

// (keep your existing getMyRatings() here if StoreOwnerDashboard uses it)
