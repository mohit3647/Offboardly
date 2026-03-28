"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { statusColor, formatDate } from "@/lib/utils";
import type { Employee } from "@/types";

export default function EmployeesPage() {
  const { user } = useUser();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    job_title: "",
    department: "",
    tenure_years: 0,
    last_day: "",
    role_context: "",
  });

  useEffect(() => {
    if (user?.id) {
      api.setUserId(user.id);
      loadEmployees();
    }
  }, [user]);

  async function loadEmployees() {
    try {
      const data = await api.listEmployees();
      setEmployees(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.createEmployee(formData);
      setShowForm(false);
      setFormData({
        full_name: "",
        email: "",
        job_title: "",
        department: "",
        tenure_years: 0,
        last_day: "",
        role_context: "",
      });
      loadEmployees();
    } catch (err) {
      alert("Failed to create employee");
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500">Manage offboarding employees and their knowledge capture.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "+ New Offboarding"}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">New Offboarding Employee</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Tenure (years)</label>
              <input
                type="number"
                step="0.5"
                value={formData.tenure_years}
                onChange={(e) => setFormData({ ...formData, tenure_years: parseFloat(e.target.value) })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Last Day</label>
              <input
                type="date"
                required
                value={formData.last_day}
                onChange={(e) => setFormData({ ...formData, last_day: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Role Context (what do they do that others depend on?)
              </label>
              <textarea
                rows={3}
                value={formData.role_context}
                onChange={(e) => setFormData({ ...formData, role_context: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="Describe what this person does, key processes they own, and what would be lost if they left without a knowledge transfer..."
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Create Offboarding
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      <div className="rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No employees yet. Click &quot;+ New Offboarding&quot; to get started.
          </div>
        ) : (
          <div className="divide-y">
            {employees.map((employee) => (
              <Link
                key={employee.id}
                href={`/dashboard/employees/${employee.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <div>
                  <div className="font-medium text-gray-900">{employee.full_name}</div>
                  <div className="text-sm text-gray-500">
                    {employee.job_title} &middot; {employee.department} &middot;{" "}
                    {employee.tenure_years} years
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
