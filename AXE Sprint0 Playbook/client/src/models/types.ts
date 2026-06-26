// Execution Plan Builder — 공유 데이터 모델 (PRD v0.1 7장 기준)
// client/server 양쪽에서 동일 타입을 참조한다. server가 단일 소스이며,
// client는 이 파일을 그대로 import하거나 빌드 시 복사해 사용한다.

export type ISODateString = string; // "2026-06-19"
export type ISODateTimeString = string; // "2026-06-19T10:00:00+09:00"

// ── 7.1 Project ──────────────────────────────────────────────
export interface Project {
  project_id: string;
  name: string;
  customer: string;
  pm: string;
  start_date: ISODateString;
  end_date: ISODateString;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
}

// ── 7.2 Phase ────────────────────────────────────────────────
export interface Phase {
  phase_id: string; // 예: "sprint0"
  project_id: string;
  name: string;
  order: number;
}

// ── 7.3 Activity (activity_data.json 기반, 읽기 전용 참조) ──────
export interface ActivityTask {
  task_id: string; // slug화한 task 제목, 예: "hybrid-scope-decision"
  title: string;
  description: string;
}

export interface ActivityDecisionItem {
  title: string;
  description: string;
}

export interface ActivityOwner {
  role: string;
  raci: string; // 예: "A", "R/C"
  responsibility: string;
}

export interface ActivityOutput {
  template_code: string; // 예: "09_WoW_DoR_DoD"
  description: string;
}

export interface Activity {
  activity_id: string; // "way-of-working" 등 — activity_data.json의 id와 동일
  code: string; // "A1"
  title: string;
  short: string;
  purpose: string;
  chapters: string; // 연결된 사업수행계획서 Chapter (원문 그대로)
  level?: string;
  template?: string;
  play?: string[];
  tasks: ActivityTask[];
  decisions: ActivityDecisionItem[];
  owners: ActivityOwner[];
  info: string[];
  outputs: ActivityOutput[];
  checklist: string[];
  section_mapping: ExecutionPlanSectionId[]; // 6장 매핑 — 본 시스템에서 추가 부여
}

// ── 6장 표준 목차 섹션 ID ────────────────────────────────────────
export type ExecutionPlanSectionId =
  | "doc-info"
  | "overview"
  | "background"
  | "scope"
  | "governance"
  | "raci"
  | "methodology"
  | "schedule"
  | "communication"
  | "deliverables"
  | "acceptance"
  | "environment"
  | "raid"
  | "transition"
  | "quality"
  | "change-management"
  | "appendix";

// ── 7.4 ActivityResult ──────────────────────────────────────────
export type ActivityResultStatus = "draft" | "saved";

export interface ActivityResult {
  result_id: string;
  project_id: string;
  activity_id: string;
  task_id: string;
  fields: Record<string, unknown>; // 폼 필드의 자유 구조 입력값
  status: ActivityResultStatus;
  created_by: string;
  created_at: ISODateTimeString;
  updated_at: ISODateTimeString;
}

// ── 7.5 ExecutionPlan ────────────────────────────────────────────
export interface ExecutionPlan {
  plan_id: string;
  project_id: string;
  file_path: string; // 예: "output/projects/{id}/execution-plan.md"
  version: number;
  last_generated_at: ISODateTimeString;
}

// ── 7.6 ExecutionPlanSection ───────────────────────────────────
export type SectionUpdateStatus = "synced" | "pending" | "conflict";

export interface ExecutionPlanSection {
  section_id: ExecutionPlanSectionId;
  plan_id: string;
  current_text: string;
  source_result_ids: string[]; // traceability
  last_updated_at: ISODateTimeString;
  update_status: SectionUpdateStatus;
}

// ── 7.7 DecisionLog ──────────────────────────────────────────────
export interface DecisionLog {
  decision_id: string;
  project_id: string;
  title: string;
  description: string;
  decided_by: string;
  decided_at: ISODateString;
  related_section_id?: ExecutionPlanSectionId;
}

// ── 7.8 RAIDItem ─────────────────────────────────────────────────
export type RAIDType = "risk" | "assumption" | "issue" | "dependency";
export type RAIDImpact = "High" | "Medium" | "Low";
export type RAIDStatus = "open" | "mitigating" | "closed";

export interface RAIDItem {
  raid_id: string;
  project_id: string;
  type: RAIDType;
  description: string;
  impact: RAIDImpact;
  owner: string;
  status: RAIDStatus;
  mitigation?: string;
  due_date?: ISODateString;
}

// ── 7.9 ActionItem ───────────────────────────────────────────────
export type ActionItemStatus = "open" | "in-progress" | "done";

export interface ActionItem {
  action_id: string;
  project_id: string;
  title: string;
  owner: string;
  due_date: ISODateString;
  status: ActionItemStatus;
  source_activity_id?: string;
}

// ── 7.10 Artifact ─────────────────────────────────────────────────
export type ArtifactStatus = "draft" | "in-review" | "approved" | "rejected";

export interface Artifact {
  artifact_id: string;
  project_id: string;
  name: string;
  template_ref: string; // 예: "02_Sprint0Plan" — activity_data.json outputs 코드 참조
  file_link?: string;
  status: ArtifactStatus;
}

// ── 7.11 Approval ─────────────────────────────────────────────────
export type ApprovalTargetType = "artifact" | "section" | "ai_suggestion";
export type ApprovalDecision = "approved" | "rejected";

export interface Approval {
  approval_id: string;
  target_type: ApprovalTargetType;
  target_id: string;
  approver: string;
  decision: ApprovalDecision;
  decided_at: ISODateTimeString;
  comment?: string;
}

// ── 7.12 ChangeHistory ───────────────────────────────────────────
export interface ChangeHistory {
  change_id: string;
  project_id: string;
  section_id: ExecutionPlanSectionId;
  before_text: string;
  after_text: string;
  triggered_by: string; // result_id 또는 approval_id
  changed_at: ISODateTimeString;
  backup_file: string; // 예: "backups/execution-plan.v11.md"
}

// ── AI 제안 (8장 — Approval과 함께 사용되는 임시 객체) ─────────────
export interface AISuggestion {
  suggestion_id: string;
  project_id: string;
  section_id: ExecutionPlanSectionId;
  suggested_text: string;
  change_summary: string;
  missing_inputs: string[];
  clarifying_questions: string[];
  created_at: ISODateTimeString;
}

// ── 프로젝트 데이터 폴더의 파일 단위 컨테이너 타입 ──────────────────
// data/projects/{id}/activity-results/{activity_id}.json
export interface ActivityResultFile {
  activity_id: string;
  results: ActivityResult[];
}

// data/projects/{id}/raid.json
export interface RAIDFile {
  items: RAIDItem[];
}

// data/projects/{id}/decisions.json
export interface DecisionLogFile {
  items: DecisionLog[];
}

// data/projects/{id}/action-items.json
export interface ActionItemFile {
  items: ActionItem[];
}

// data/projects/{id}/approvals.json
export interface ApprovalFile {
  items: Approval[];
}

// data/projects/{id}/change-history.json
export interface ChangeHistoryFile {
  items: ChangeHistory[];
}
