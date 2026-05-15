"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";
import { api } from "@/lib/api-client";
import { statusColor } from "@/lib/utils";
import type { KnowledgeBase, KnowledgeEntry } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  workflows: "Workflows & Processes",
  decisions: "Decision Making",
  relationships: "Relationships & Stakeholders",
  workarounds: "Workarounds",
  history: "Historical Context",
};

const CATEGORY_COLORS: Record<string, string> = {
  workflows: "border-blue-200 bg-blue-50",
  decisions: "border-amber-200 bg-amber-50",
  relationships: "border-green-200 bg-green-50",
  workarounds: "border-red-200 bg-red-50",
  history: "border-purple-200 bg-purple-50",
};

export default function KnowledgeBasePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("Dashboard coming soon.");

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <div className="text-gray-500">Loading knowledge base...</div>;
  if (error) return (
    <div className="text-center">
      <p className="mb-4 text-gray-500">{error}</p>
      <Link href={`/dashboard/employees/${employeeId}`} className="text-brand-600 hover:underline">
        Back to Employee
      </Link>
    </div>
  );
  if (!kb) return null;

  const categories = [...new Set(kb.entries.map((e) => e.category))];
  const filteredEntries = activeCategory
    ? kb.entries.filter((e) => e.category === activeCategory)
    : kb.entries;

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/employees/${employeeId}`}
          className="mb-2 inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Employee
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-gray-500">
              {kb.entries.length} knowledge entries captured
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(kb.status)}`}>
            {kb.status}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-brand-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({kb.entries.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {CATEGORY_LABELS[cat] || cat} (
            {kb.entries.filter((e) => e.category === cat).length})
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className={`rounded-xl border p-6 shadow-sm transition-colors ${
              CATEGORY_COLORS[entry.category] || "bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="mb-1 inline-block rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {CATEGORY_LABELS[entry.category] || entry.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
              </div>
              <button
                onClick={() =>
                  setExpandedEntry(expandedEntry === entry.id ? null : entry.id)
                }
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedEntry === entry.id ? "Collapse" : "Expand"}
              </button>
            </div>
            <div
              className={`mt-3 whitespace-pre-wrap text-sm text-gray-700 ${
                expandedEntry === entry.id ? "" : "line-clamp-3"
              }`}
            >
              {entry.content}
            </div>
            {entry.tags && (
              <div className="mt-3 flex flex-wrap gap-1">
                {JSON.parse(entry.tags).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/80 px-2 py-0.5 text-xs text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
