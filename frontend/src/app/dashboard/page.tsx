"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api-client";
import { statusColor, formatDate } from "@/lib/utils";
import type { Employee } from "@/types";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const stats = {
    total: employees.length,
    interviewing: employees.filter((e) => e.status === "interviewing").length,
    complete: employees.filter((e) => e.status === "complete").length,
    pending: employees.filter((e) => e.status === "pending").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          Manage offboarding knowledge capture across your organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Offboardings", value: stats.total, color: "text-gray-900" },
          { label: "In Progress", value: stats.interviewing, color: "text-blue-600" },
          { label: "Completed", value: stats.complete, color: "text-green-600" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Offboardings */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Recent Offboardings</h2>
          <Link
            href="/dashboard/employees"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            + New Offboarding
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mb-4 text-4xl">📋</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No offboardings yet</h3>
            <p className="mb-4 text-gray-500">
              Start capturing institutional knowledge from your first departing employee.
            </p>
            <Link
              href="/dashboard/employees"
              className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {employees.slice(0, 5).map((employee) => (
              <Link
                key={employee.id}
                href={`/dashboard/employees/${employee.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{employee.full_name}</div>
                  <div className="text-sm text-gray-500">
                    {employee.job_title} &middot; {employee.department}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Last day: {formatDate(employee.last_day)}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(employee.status)}`}
                  >
                    {employee.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
