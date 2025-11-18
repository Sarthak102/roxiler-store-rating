import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import Button from "../components/ui/button";
import { getAdminStats } from "../services/adminService";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    users_count?: number;
    stores_count?: number;
    ratings_count?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAdminStats();
        setStats(res);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load stats");
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/admin/create-user">
              <Button>Create user</Button>
            </Link>
            <Link to="/admin/create-store">
              <Button variant="outline">Create store</Button>
            </Link>
          </div>
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-sm text-muted">Total users</div>
            <div className="text-3xl font-bold">
              {stats ? stats.users_count ?? 0 : "—"}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted">Total stores</div>
            <div className="text-3xl font-bold">
              {stats ? stats.stores_count ?? 0 : "—"}
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted">Total ratings submitted</div>
            <div className="text-3xl font-bold">
              {stats ? stats.ratings_count ?? 0 : "—"}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
