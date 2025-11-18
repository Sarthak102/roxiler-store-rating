// frontend/src/services/adminService.ts
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
  avg_rating?: number | null;
};

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get("/admin/stats");
  return res.data;
}

export async function getUsers(params: {
  q?: string;
  role?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/admin/users", { params });
  return res.data as { data: User[]; total: number };
}

export async function getUser(id: string) {
  const res = await api.get(`/admin/users/${id}`);
  return res.data as User;
}


export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  address?: string;
  role?: string;
}) {
  const res = await api.post("/admin/users", payload);
  return res.data;
}

export async function getStoresAdmin(params: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get("/stores", { params });
  return res.data as { data: Store[]; total: number };
}
