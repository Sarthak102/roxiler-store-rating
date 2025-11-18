import api from "./api";

export type AdminStats = {
  users_count: number;
  stores_count: number;
  ratings_count: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  role: string;
  created_at?: string;
  rating?: number | null;
};

export type Store = {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  owner_id?: string | null;
  avg_rating?: number | null;
};

/* ---------- ADMIN STATS ---------- */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get("/admin/stats");
  return res.data;
}

/* ---------- GET USERS ---------- */
export async function getUsers(params: {
  q?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/admin/users", { params });
  return res.data as { data: User[]; total: number };
}

/* ---------- GET SINGLE USER ---------- */
export async function getUser(id: string) {
  const res = await api.get(`/admin/users/${id}`);
  return res.data as User;
}

/* ---------- GET STORE OWNERS (dropdown) ---------- */
export async function getStoreOwners() {
  const res = await api.get("/admin/store-owners");
  return res.data as { id: string; name: string; email: string }[];
}

/* ---------- CREATE STORE ---------- */
export async function createStore(data: {
  name: string;
  email?: string;
  address?: string;
  owner_id?: string | null;
}) {
  const res = await api.post("/admin/stores", data);
  return res.data;
}