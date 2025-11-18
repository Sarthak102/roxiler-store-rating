import React from "react";
import { Button } from "./ui/button";
import Card from "./ui/card";

/**
 * props simplified — adapt to your store data: date/time, course, teacher, students, actions
 */
export default function ScheduleCard({
  from,
  to,
  title,
  subtitle,
  students,
  teacher,
  link,
  actions,
}: {
  from: string;
  to: string;
  title: string;
  subtitle?: string;
  students?: { name: string; avatar?: string }[];
  teacher?: { name: string; avatar?: string };
  link?: string;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl panel soft-shadow">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2">
          <div className="text-xs text-gray-500">From</div>
          <div className="font-semibold">{from}</div>
          <div className="text-xs text-gray-500 mt-2">To</div>
          <div className="font-semibold">{to}</div>
        </div>

        <div className="col-span-7">
          <div className="text-sm text-gray-500">Course</div>
          <div className="font-bold text-lg">{title}</div>
          {subtitle && (
            <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
          )}
          {link && (
            <div className="text-xs text-blue-600 mt-2 break-all">{link}</div>
          )}
          <div className="flex items-center gap-2 mt-3">
            {students?.slice(0, 5).map((s, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full overflow-hidden border"
              >
                <img
                  src={s.avatar ?? "/avatar-placeholder.png"}
                  alt={s.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {students && students.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600">
                +{students.length - 5}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-3 flex items-center justify-end gap-3">
          <div className="text-sm text-gray-500 text-right">
            <div className="text-xs">Teacher</div>
            <div className="font-medium">{teacher?.name}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div>{actions}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
