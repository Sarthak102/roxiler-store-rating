import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/card";
import { getMyRatings } from "../services/storeOwnerService";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<any>(null);
  const COLORS = ["#4A70A9", "#6E8DC6", "#9EB5DE", "#C8D7F0", "#E2EAFB"];

  useEffect(() => {
    (async () => {
      const res = await getMyRatings();
      setData(res);
    })();
  }, []);

  if (!data) {
    return (
      <Layout>
        <div className="p-6 flex justify-center text-gray-600">Loading...</div>
      </Layout>
    );
  }

  const { store, ratings, distribution } = data;

  if (!store) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="p-6 rounded-xl text-center text-gray-600">
            You have not been assigned a store yet.
            <br />
            Please contact the administrator.
          </Card>
        </div>
      </Layout>
    );
  }

  const totalRatings = ratings.length;
  const avgRating =
    totalRatings === 0
      ? 0
      : (
          ratings.reduce((acc: number, r: any) => acc + r.rating, 0) /
          totalRatings
        ).toFixed(2);

  const donutData = distribution.map((item: any) => ({
    name: `${item.rating} star`,
    value: Number(item.count),
  }));

  const barData = distribution.map((item: any) => ({
    rating: item.rating,
    count: Number(item.count),
  }));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-semibold">Store Owner Dashboard</h1>

        {/* Store Card */}
        <Card className="p-6 space-y-2">
          <h2 className="text-xl font-semibold">{store.name}</h2>
          <p className="text-gray-500">{store.address}</p>

          <div className="flex items-center gap-12 mt-4">
            <div className="text-center">
              <p className="text-sm text-muted">Average Rating</p>
              <p className="text-4xl font-bold">{avgRating}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted">Total Ratings</p>
              <p className="text-4xl font-bold">{totalRatings}</p>
            </div>
          </div>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>

            {donutData.length === 0 ? (
              <p className="text-gray-500">No ratings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={70}
                    label
                  >
                    {donutData.map((entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ratings Breakdown</h3>

            {barData.length === 0 ? (
              <p className="text-gray-500">No ratings yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData}>
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#4A70A9"
                    radius={[6, 6, 0, 0]}
                  ></Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
