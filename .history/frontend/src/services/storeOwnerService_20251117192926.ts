import api from "./api";

export async function getMyStore() {
  const res = await api.get("/store-owner/store");
  return res.data;
}

export async function getMyRatings() {
  const res = await api.get("/store-owner/ratings");
  return res.data;
}
