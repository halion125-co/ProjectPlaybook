import type {
  Activity,
  ActivityResult,
  ChangeHistory,
  ExecutionPlanSectionId,
  Project,
} from "../models/types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `요청 실패: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Projects ─────────────────────────────────────────────────
export function listProjects(): Promise<Project[]> {
  return request<Project[]>("/projects");
}

export function getProject(projectId: string): Promise<Project> {
  return request<Project>(`/projects/${projectId}`);
}

export interface CreateProjectInput {
  project_id: string;
  name: string;
  customer: string;
  pm: string;
  start_date: string;
  end_date: string;
}

export function createProject(input: CreateProjectInput): Promise<Project> {
  return request<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ── Activities ───────────────────────────────────────────────
export function listActivities(): Promise<Activity[]> {
  return request<Activity[]>("/activities");
}

export function getActivity(activityId: string): Promise<Activity> {
  return request<Activity>(`/activities/${activityId}`);
}

export function getActivityResults(
  activityId: string,
  projectId: string
): Promise<ActivityResult[]> {
  return request<ActivityResult[]>(
    `/activities/${activityId}/projects/${projectId}/results`
  );
}

export interface SaveActivityResultInput {
  task_id: string;
  fields: Record<string, unknown>;
  status: "draft" | "saved";
  created_by?: string;
}

export function saveActivityResult(
  activityId: string,
  projectId: string,
  input: SaveActivityResultInput
): Promise<ActivityResult> {
  return request<ActivityResult>(
    `/activities/${activityId}/projects/${projectId}/results`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

// ── Execution Plan ───────────────────────────────────────────
export async function getExecutionPlanMarkdown(projectId: string): Promise<string> {
  const res = await fetch(`${BASE}/execution-plan/${projectId}`);
  if (!res.ok) throw new Error(`수행계획서 조회 실패: ${res.status}`);
  return res.text();
}

export interface SectionUpdatePreview {
  section_id: ExecutionPlanSectionId;
  before_text: string;
  after_text: string;
  changed: boolean;
}

export function previewSection(
  projectId: string,
  sectionId: ExecutionPlanSectionId
): Promise<SectionUpdatePreview> {
  return request<SectionUpdatePreview>(
    `/execution-plan/${projectId}/sections/${sectionId}/preview`
  );
}

export function applySection(
  projectId: string,
  sectionId: ExecutionPlanSectionId,
  newText: string,
  triggeredBy: string
): Promise<ChangeHistory> {
  return request<ChangeHistory>(
    `/execution-plan/${projectId}/sections/${sectionId}/apply`,
    {
      method: "POST",
      body: JSON.stringify({ new_text: newText, triggered_by: triggeredBy }),
    }
  );
}

// ── AI ───────────────────────────────────────────────────────
export interface SectionPromptContext {
  section_id: ExecutionPlanSectionId;
  prompt: string;
  has_existing_text: boolean;
  has_input_results: boolean;
}

export function getSectionPrompt(
  projectId: string,
  sectionId: ExecutionPlanSectionId
): Promise<SectionPromptContext> {
  return request<SectionPromptContext>(
    `/ai/projects/${projectId}/sections/${sectionId}/prompt`
  );
}

// ── Change History ───────────────────────────────────────────
export function listChangeHistory(projectId: string): Promise<ChangeHistory[]> {
  return request<ChangeHistory[]>(`/change-history/${projectId}`);
}
