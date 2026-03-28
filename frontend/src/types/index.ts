export interface Organization {
  id: string;
  name: string;
  plan: string;
  created_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  tenure_years: number;
  last_day: string;
  status: "pending" | "interviewing" | "synthesizing" | "complete";
  role_context: string | null;
  created_at: string;
}

export interface InterviewSession {
  id: string;
  employee_id: string;
  session_number: number;
  topic: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  started_at: string | null;
  completed_at: string | null;
  summary: string | null;
  created_at: string;
}

export interface InterviewMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  sequence: number;
  created_at: string;
}

export interface InterviewSessionDetail extends InterviewSession {
  messages: InterviewMessage[];
}

export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string | null;
  source_session_id: string | null;
  created_at: string;
}

export interface KnowledgeBase {
  id: string;
  employee_id: string;
  status: "pending" | "processing" | "ready";
  synthesis_completed_at: string | null;
  created_at: string;
  entries: KnowledgeEntry[];
}

export interface SourceCitation {
  entry_id: string;
  title: string;
  category: string;
}

export interface ChatbotResponse {
  answer: string;
  sources: SourceCitation[];
}
