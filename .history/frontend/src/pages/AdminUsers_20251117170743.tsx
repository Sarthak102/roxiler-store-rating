// frontend/src/pages/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getUsers, getUser, User } from "../services/adminService";
import { getUsers, getUser, User } from "../services/adminService";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Input from "../components/ui/input";
import { useToast } from "../contexts/ToastContext";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        q: q || undefined,
        role: role || undefined,
        page,
        limit,
      });
      setUsers(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleSearch = async () => {
    setPage(1);
    await load();
  };

  const openDetails = async (id: string) => {
    try {
      const u = await getUser(id);
      setSelectedUser(u);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search name or email"
              value={q}
              onChange={(e: any) => setQ(e.target.value)}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded px-3 py-2 border"
            >
              <option value="">All roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <Button onClick={handleSearch}>Filter</Button>
          </div>
        </div>

        <div className="space-y-3">
          {loading && <div>Loading...</div>}
          {!loading &&
            users.map((u) => (
              <Card
                key={u.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{u.name}</div>
                  <div className="text-sm text-muted">
                    {u.email} • {u.address ?? "—"}
                  </div>
                  <div className="text-xs mt-1">
                    Role: {u.role}
                    {u.role === "store_owner" && u.rating
                      ? ` • Rating: ${u.rating}`
                      : ""}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => openDetails(u.id)}>
                    View
                  </Button>
                </div>
              </Card>
            ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted">{`Showing ${users.length} of ${total}`}</div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="px-3 py-2 rounded bg-white/50">{page}</div>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={users.length === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">User details</h3>
            <div>
              <strong>Name:</strong> {selectedUser.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div>
              <strong>Address:</strong> {selectedUser.address ?? "—"}
            </div>
            <div>
              <strong>Role:</strong> {selectedUser.role}
            </div>
            {selectedUser.role === "store_owner" && (
              <div>
                <strong>Owner rating:</strong> {selectedUser.rating ?? "—"}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
