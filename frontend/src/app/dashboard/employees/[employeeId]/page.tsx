"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import { statusColor, formatDate } from "@/lib/utils";
import type { Employee, InterviewSession } from "@/types";

const TOPICS = [
  { value: "general", label: "General Overview", desc: "Broad overview of role and responsibilities" },
  { value: "workflows", label: "Workflows & Processes", desc: "Step-by-step processes and procedures" },
  { value: "decisions", label: "Decision Making", desc: "How they make judgment calls and decisions" },
  { value: "relationships", label: "Relationships", desc: "Key stakeholders and communication patterns" },
  { value: "history", label: "Historical Context", desc: "Why things are the way they are" },
];

export default function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { user } = useUser();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [synthesizing, setSynthesizing] = useState(false);

  useEffect(() => {
    if (user?.id && employeeId) {
      api.setUserId(user.id);
      loadData();
    }
  }, [user, employeeId]);

  async function loadData() {
    try {
      const [emp, sess] = await Promise.all([
        api.getEmployee(employeeId),
        api.listInterviewSessions(employeeId),
      ]);
      setEmployee(emp);
      setSessions(sess);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function startInterview(topic: string) {
    try {
      const session = await api.createInterviewSession(employeeId, topic);
      window.location.href = `/dashboard/employees/${employeeId}/interview?session=${session.id}`;
    } catch {
      alert("Failed to start interview");
    }
  }

  async function handleSynthesize() {
    setSynthesizing(true);
    try {
      await api.triggerSynthesis(employeeId);
      loadData();
    } catch {
      alert("Synthesis failed");
    } finally {
      setSynthesizing(false);
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!employee) return <div className="text-gray-500">Employee not found.</div>;

  const completedSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/employees" className="mb-2 inline-block text-sm text-gray-500 hover:text-gray-700">
          &larr; Back to Employees
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.full_name}</h1>
            <p className="text-gray-500">
              {employee.job_title} &middot; {employee.department} &middot; {employee.tenure_years} years
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(employee.status)}`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Info + Actions */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium">{employee.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Day</dt>
                <dd className="font-medium">{formatDate(employee.last_day)}</dd>
              </div>
              {employee.role_context && (
                <div>
                  <dt className="text-gray-500">Role Context</dt>
                  <dd className="font-medium">{employee.role_context}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Actions</h2>
            <div className="space-y-2">
              {completedSessions.length > 0 && (
                <>
                  <button
                    onClick={handleSynthesize}
                    disabled={synthesizing}
                    className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {synthesizing ? "Synthesizing..." : "Synthesize Knowledge"}
                  </button>
                  <Link
                    href={`/dashboard/knowledge/${employeeId}`}
                    className="block w-full rounded-lg border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Knowledge Base
                  </Link>
                  <Link
                    href={`/dashboard/chatbot?employee=${employeeId}`}
                    className="block w-full rounded-lg border px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Ask AI About This Employee
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interview Sessions */}
        <div className="lg:col-span-2">
          {/* Start New Interview */}
          <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Start Interview Session</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TOPICS.map((topic) => {
                const existing = sessions.find((s) => s.topic === topic.value);
                return (
                  <button
                    key={topic.value}
                    onClick={() => startInterview(topic.value)}
                    disabled={existing?.status === "in_progress"}
                    className="rounded-lg border p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
                  >
                    <div className="font-medium text-gray-900">{topic.label}</div>
                    <div className="mt-1 text-xs text-gray-500">{topic.desc}</div>
                    {existing && (
                      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(existing.status)}`}>
                        {existing.status}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session History */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Interview Sessions</h2>
            </div>
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No interviews yet. Start one above.
              </div>
            ) : (
              <div className="divide-y">
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/dashboard/employees/${employeeId}/interview?session=${session.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium capitalize text-gray-900">
                        Session #{session.session_number}: {session.topic}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.started_at ? formatDate(session.started_at) : "Not started"}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(session.status)}`}>
                      {session.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
