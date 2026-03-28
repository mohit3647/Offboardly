"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "@/lib/api-client";
import type { Employee, ChatbotResponse, SourceCitation } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: SourceCitation[];
}

export default function ChatbotPage() {
  const searchParams = useSearchParams();
  const preselectedEmployee = searchParams.get("employee");
  const { user } = useUser();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(preselectedEmployee || "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      api.setUserId(user.id);
      api.listEmployees("complete").then(setEmployees).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedEmployeeId || loading) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const response: ChatbotResponse = await api.queryChat(selectedEmployeeId, question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer, sources: response.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process your question. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">Successor AI Assistant</h1>
          <p className="text-xs text-gray-500">
            Ask questions about a departed employee&apos;s knowledge
          </p>
        </div>
        <select
          value={selectedEmployeeId}
          onChange={(e) => {
            setSelectedEmployeeId(e.target.value);
            setMessages([]);
          }}
          className="ml-auto rounded-lg border px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Select an employee...</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.full_name} — {emp.job_title}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {!selectedEmployeeId && (
            <div className="py-16 text-center text-gray-400">
              Select an employee above to start asking questions about their knowledge.
            </div>
          )}
          {selectedEmployeeId && messages.length === 0 && (
            <div className="py-16 text-center">
              <div className="mb-4 text-4xl">💡</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Ask about {selectedEmployee?.full_name}&apos;s knowledge
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Try questions like:
              </p>
              <div className="mx-auto flex max-w-md flex-col gap-2">
                {[
                  "What were their key processes and workflows?",
                  "How did they handle escalations?",
                  "Who are the key stakeholders I should know about?",
                  "What workarounds did they use?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="rounded-lg border px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "border bg-white shadow-sm text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 border-t pt-2">
                    <div className="text-xs font-medium text-gray-500">Sources:</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.sources.map((src) => (
                        <span
                          key={src.entry_id}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {src.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
                <div className="text-sm text-gray-400">Searching knowledge base...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white px-6 py-4">
        <form onSubmit={handleSend} className="mx-auto flex max-w-3xl gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedEmployeeId
                ? "Ask a question..."
                : "Select an employee first..."
            }
            disabled={!selectedEmployeeId || loading}
            className="flex-1 rounded-xl border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={!selectedEmployeeId || loading || !input.trim()}
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
