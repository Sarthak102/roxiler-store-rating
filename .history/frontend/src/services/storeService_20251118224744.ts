
import api from "./api";

export type Store = {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  ratings_count?: number;
  avg_rating?: number | null;
  user_rating?: number | null;
};

export type RatingPayload = {
  rating: number; 
  comment?: string;
};

export async function fetchStores(
  params: { page?: number; limit?: number; q?: string } = {}
) {
  const res = await api.get("/stores", { params });
  return res.data.data as Store[];
}

export async function getStoreById(id: string) {
  const res = await api.get(`/stores/${id}`);
  return res.data;
}

export async function submitRating(storeId: string, payload: RatingPayload) {
  const res = await api.post(`/stores/${storeId}/ratings`, payload);
  return res.data;
}

export async function getRatingsForStore(storeId: string) {
  const res = await api.get(`/stores/${storeId}/ratings`);
  return res.data;
}
