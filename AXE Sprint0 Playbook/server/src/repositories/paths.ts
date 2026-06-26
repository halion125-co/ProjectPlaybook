import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// execution-plan-builder/ 루트 — server/src/repositories에서 두 단계 상위
export const ROOT_DIR = path.resolve(__dirname, "..", "..", "..");

// 테스트에서 실제 data/output 디렉터리를 건드리지 않도록 격리 경로를 주입할 수 있게 한다.
// EPB_DATA_ROOT가 설정되면 그 경로 하위에 projects/를 둔다.
const DATA_ROOT = process.env.EPB_DATA_ROOT ?? path.join(ROOT_DIR, "data");
const OUTPUT_ROOT = process.env.EPB_OUTPUT_ROOT ?? path.join(ROOT_DIR, "output");

export const DATA_DIR = path.join(DATA_ROOT, "projects");
export const OUTPUT_DIR = path.join(OUTPUT_ROOT, "projects");
export const TEMPLATE_PATH = path.join(
  ROOT_DIR,
  "server",
  "templates",
  "execution-plan.template.md"
);

export function projectDataDir(projectId: string): string {
  return path.join(DATA_DIR, projectId);
}

export function projectOutputDir(projectId: string): string {
  return path.join(OUTPUT_DIR, projectId);
}

export function projectFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "project.json");
}

export function activityResultsDir(projectId: string): string {
  return path.join(projectDataDir(projectId), "activity-results");
}

export function activityResultFilePath(
  projectId: string,
  activityId: string
): string {
  return path.join(activityResultsDir(projectId), `${activityId}.json`);
}

export function raidFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "raid.json");
}

export function decisionsFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "decisions.json");
}

export function actionItemsFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "action-items.json");
}

export function approvalsFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "approvals.json");
}

export function changeHistoryFilePath(projectId: string): string {
  return path.join(projectDataDir(projectId), "change-history.json");
}

export function executionPlanFilePath(projectId: string): string {
  return path.join(projectOutputDir(projectId), "execution-plan.md");
}

export function backupsDir(projectId: string): string {
  return path.join(projectOutputDir(projectId), "backups");
}
