const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

class ApiClient {
  private baseUrl: string;
  private userId: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.userId = "";
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": this.userId,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || "API request failed");
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  // Organizations
  createOrganization(data: { name: string }) {
    return this.fetch<any>("/api/organizations/", { method: "POST", body: JSON.stringify(data) });
  }

  // Employees
  listEmployees(status?: string) {
    const params = status ? `?status=${status}` : "";
    return this.fetch<any[]>(`/api/employees/${params}`);
  }

  getEmployee(id: string) {
    return this.fetch<any>(`/api/employees/${id}`);
  }

  createEmployee(data: any) {
    return this.fetch<any>("/api/employees/", { method: "POST", body: JSON.stringify(data) });
  }

  updateEmployee(id: string, data: any) {
    return this.fetch<any>(`/api/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  }

  deleteEmployee(id: string) {
    return this.fetch<void>(`/api/employees/${id}`, { method: "DELETE" });
  }

  // Interviews
  createInterviewSession(employeeId: string, topic: string = "general") {
    return this.fetch<any>(`/api/interviews/employees/${employeeId}/sessions`, {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  }

  listInterviewSessions(employeeId: string) {
    return this.fetch<any[]>(`/api/interviews/employees/${employeeId}/sessions`);
  }

  getInterviewSession(sessionId: string) {
    return this.fetch<any>(`/api/interviews/${sessionId}`);
  }

  sendInterviewMessage(sessionId: string, message: string) {
    return this.fetch<{ response: string }>(`/api/interviews/${sessionId}/message`, {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  endInterviewSession(sessionId: string) {
    return this.fetch<{ summary: string }>(`/api/interviews/${sessionId}/end`, {
      method: "POST",
    });
  }

  // Knowledge
  triggerSynthesis(employeeId: string) {
    return this.fetch<any>(`/api/knowledge/employees/${employeeId}/synthesize`, {
      method: "POST",
    });
  }

  getKnowledgeBase(employeeId: string) {
    return this.fetch<any>(`/api/knowledge/employees/${employeeId}`);
  }

  // Chatbot
  queryChat(employeeId: string, question: string) {
    return this.fetch<any>("/api/chatbot/query", {
      method: "POST",
      body: JSON.stringify({ employee_id: employeeId, question }),
    });
  }

  // WebSocket URL for interview streaming
  getInterviewWsUrl(sessionId: string) {
    const wsBase = this.baseUrl.replace("http", "ws");
    return `${wsBase}/api/interviews/${sessionId}/ws`;
  }
}

export const api = new ApiClient(BACKEND_URL);
