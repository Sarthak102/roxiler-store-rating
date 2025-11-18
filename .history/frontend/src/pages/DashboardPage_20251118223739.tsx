import React from "react";
import Layout from "../components/layout/Layout";
import ScheduleCard from "../components/schedule/ScheduleCard";
import { Button } from "../components/ui/button";

export default function DashboardPage() {
  const today = [
    {
      id: "1",
      from: "09:00 AM",
      to: "10:20 AM",
      title: "Behavioral Economics",
      subtitle: "Cognitive Biases and Decision Making",
      teacher: { name: "Julie Dawson", avatar: "/avatar1.jpg" },
      students: new Array(12)
        .fill(0)
        .map((_, i) => ({ name: `Student ${i + 1}` })),
      link: "https://meet.google.com/les02-efg",
    },
    {
      id: "2",
      from: "01:20 PM",
      to: "03:00 PM",
      title: "International Economics",
      teacher: { name: "Ida Aguirre", avatar: "/avatar2.jpg" },
      students: new Array(4).fill(0).map((_, i) => ({ name: `S${i}` })),
    },
  ];

  return (
    <Layout>
      <div className="panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Schedule</h1>
            <div className="mt-2 flex items-center gap-2">
              <button className="pill bg-blue-600 text-white">Upcoming</button>
              <button className="pill bg-white text-gray-700 border">
                Pending
              </button>
              <button className="pill bg-white text-gray-700 border">
                Past
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline">Filters</Button>
            <Button>Create appointment</Button>
          </div>
        </div>

        <div className="space-y-4">
          {today.map((t) => (
            <ScheduleCard
              key={t.id}
              from={t.from}
              to={t.to}
              title={t.title}
              subtitle={t.subtitle}
              teacher={t.teacher}
              students={t.students}
              link={t.link}
              actions={
                <div className="flex gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="default">Join meeting</Button>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
