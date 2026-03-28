import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusColor(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    interviewing: "bg-blue-100 text-blue-800",
    in_progress: "bg-blue-100 text-blue-800",
    synthesizing: "bg-purple-100 text-purple-800",
    processing: "bg-purple-100 text-purple-800",
    complete: "bg-green-100 text-green-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-green-100 text-green-800",
    not_started: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
