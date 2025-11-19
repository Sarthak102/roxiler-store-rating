import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Card from "../../components/ui/card";
import Button from "../../components/ui/button";
import { getAdminStats } from "../../services/adminService";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type Stats = {
  users_count: number;
  stores_count: number;
  ratings_count: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAdminStats();
        setStats(res);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.error || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chartData = stats
    ? [
        { name: "Users", value: stats.users_count },
        { name: "Stores", value: stats.stores_count },
        { name: "Ratings", value: stats.ratings_count },
      ]
    : [];

  const colors = ["#4A70A9", "#1DBF73", "#F6C85F"];

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
          <Card className="card-lg">
            <div className="text-sm text-muted">Total users</div>
            <div className="text-3xl font-bold">
              {stats ? stats.users_count : "—"}
            </div>
          </Card>

          <Card className="card-lg">
            <div className="text-sm text-muted">Total stores</div>
            <div className="text-3xl font-bold">
              {stats ? stats.stores_count : "—"}
            </div>
          </Card>

          <Card className="card-lg">
            <div className="text-sm text-muted">Total ratings submitted</div>
            <div className="text-3xl font-bold">
              {stats ? stats.ratings_count : "—"}
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold">Activity overview</h3>
              <div className="text-sm text-muted">
                Recent totals across the system
              </div>
            </div>
            <div className="text-sm text-muted">Live</div>
          </div>

          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 12, left: -12, bottom: 8 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" barSize={36}>
                  {chartData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={colors[idx % colors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
