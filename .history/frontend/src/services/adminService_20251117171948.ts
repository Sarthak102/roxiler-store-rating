import api from "./api";

export async function getAdminStats() {
  const res = await api.get("/admin/stats");
  return res.data;
}

export async function getUsers(params: any) {
  const res = await api.get("/admin/users", { params });
  return res.data; // { data, total }
}

export async function getUser(id: string) {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
}

export async function createUser(payload: any) {
  const res = await api.post("/admin/users", payload);
  return res.data;
}
