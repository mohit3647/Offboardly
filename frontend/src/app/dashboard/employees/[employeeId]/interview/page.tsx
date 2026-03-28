"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { InterviewMessage, InterviewSessionDetail, Employee } from "@/types";

export default function InterviewPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const { user } = useUser();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [session, setSession] = useState<InterviewSessionDetail | null>(null);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [ended, setEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id && sessionId) {
      api.setUserId(user.id);
      loadSession();
    }
  }, [user, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadSession() {
    try {
      const [emp, sess] = await Promise.all([
        api.getEmployee(employeeId),
        api.getInterviewSession(sessionId!),
      ]);
      setEmployee(emp);
      setSession(sess);
      setMessages(sess.messages || []);
      setEnded(sess.status === "completed");
    } catch {
      alert("Failed to load session");
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending || !sessionId) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    // Optimistic UI: add user message immediately
    const userMsg: InterviewMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      sequence: messages.length + 1,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const { response } = await api.sendInterviewMessage(sessionId, userMessage);
      const assistantMsg: InterviewMessage = {
        id: `temp-${Date.now() + 1}`,
        role: "assistant",
        content: response,
        sequence: messages.length + 2,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleEndSession() {
    if (!sessionId) return;
    try {
      const { summary } = await api.endInterviewSession(sessionId);
      setEnded(true);
      alert("Session ended. Summary generated.");
    } catch {
      alert("Failed to end session");
    }
  }

  if (!session) return <div className="text-gray-500">Loading interview...</div>;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div>
          <Link
            href={`/dashboard/employees/${employeeId}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to {employee?.full_name}
          </Link>
          <h1 className="text-lg font-semibold capitalize">
            Interview: {session.topic}
            <span className="ml-2 text-sm font-normal text-gray-500">
              Session #{session.session_number}
            </span>
          </h1>
        </div>
        <div className="flex gap-2">
          {!ended && (
            <button
              onClick={handleEndSession}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-white border shadow-sm text-gray-900"
                }`}
              >
                <div className="mb-1 text-xs font-medium opacity-70">
                  {msg.role === "user" ? employee?.full_name || "You" : "Offboardly AI"}
                </div>
                <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
                <div className="text-sm text-gray-400">Thinking...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!ended ? (
        <div className="border-t bg-white px-6 py-4">
          <form onSubmit={handleSend} className="mx-auto flex max-w-3xl gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your knowledge..."
              disabled={sending}
              className="flex-1 rounded-xl border px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-gray-50"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="border-t bg-green-50 px-6 py-4 text-center text-sm text-green-700">
          This interview session has been completed. View the{" "}
          <Link href={`/dashboard/employees/${employeeId}`} className="font-medium underline">
            employee page
          </Link>{" "}
          to synthesize knowledge or start another session.
        </div>
      )}
    </div>
  );
}
