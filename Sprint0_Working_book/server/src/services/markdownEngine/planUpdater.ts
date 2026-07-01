import fs from "node:fs/promises";
import type { ChangeHistory, ChangeHistoryFile, ExecutionPlanSectionId } from "../../models/types.js";
import { readJson, writeJson } from "../../repositories/jsonStore.js";
import {
  backupsDir,
  changeHistoryFilePath,
  executionPlanFilePath,
} from "../../repositories/paths.js";
import { loadActivityCatalog } from "../../repositories/activityCatalog.js";
import { getActivityResults } from "../../repositories/activityResultRepository.js";
import { extractSectionText, replaceSectionText } from "./sectionMarkers.js";
import { renderSectionFromResults, type ActivityResultsByActivity } from "./sectionRenderer.js";

async function loadAllResultsByActivity(
  projectId: string
): Promise<ActivityResultsByActivity[]> {
  const catalog = await loadActivityCatalog();
  return Promise.all(
    catalog.map(async (activity) => ({
      activity,
      results: await getActivityResults(projectId, activity.activity_id),
    }))
  );
}

export interface SectionUpdatePreview {
  section_id: ExecutionPlanSectionId;
  before_text: string;
  after_text: string;
  changed: boolean;
}

// 파일에 쓰지 않고, 현재 입력 데이터를 반영했을 때의 섹션 본문 변화만 계산한다.
// PRD 4장 흐름 5 (Markdown 미리보기)와 9.4 (diff 확인)에 사용된다.
export async function previewSectionUpdate(
  projectId: string,
  sectionId: ExecutionPlanSectionId
): Promise<SectionUpdatePreview> {
  const markdown = await fs.readFile(executionPlanFilePath(projectId), "utf-8");
  const before = extractSectionText(markdown, sectionId);

  const groups = await loadAllResultsByActivity(projectId);
  const after = renderSectionFromResults(sectionId, groups);

  return {
    section_id: sectionId,
    before_text: before,
    after_text: after,
    changed: before !== after,
  };
}

async function appendChangeHistory(
  projectId: string,
  entry: ChangeHistory
): Promise<void> {
  const filePath = changeHistoryFilePath(projectId);
  const existing = await readJson<ChangeHistoryFile>(filePath);
  const items = existing?.items ?? [];
  items.push(entry);
  await writeJson(filePath, { items } satisfies ChangeHistoryFile);
}

async function nextBackupVersion(projectId: string): Promise<number> {
  const dir = backupsDir(projectId);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  const versions = entries
    .map((f) => /execution-plan\.v(\d+)\.md$/.exec(f))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => Number(m[1]));
  return (versions.length > 0 ? Math.max(...versions) : 0) + 1;
}

export interface ApplySectionUpdateInput {
  project_id: string;
  section_id: ExecutionPlanSectionId;
  new_text: string;
  triggered_by: string; // result_id 또는 approval_id
}

// 승인된 텍스트만 이 함수로 들어와야 한다 — 호출 전 승인 여부 확인은 caller(route) 책임.
// section 마커 영역만 교체하고, manual 영역과 다른 섹션은 그대로 보존한다.
export async function applySectionUpdate(
  input: ApplySectionUpdateInput
): Promise<ChangeHistory> {
  const planPath = executionPlanFilePath(input.project_id);
  const beforeMarkdown = await fs.readFile(planPath, "utf-8");
  const beforeText = extractSectionText(beforeMarkdown, input.section_id);

  const afterMarkdown = replaceSectionText(
    beforeMarkdown,
    input.section_id,
    input.new_text
  );

  // 전체 파일 스냅샷 백업 — 마커 손상 등 예기치 못한 상황에서도 복구 가능하게 갱신 직전 상태를 보존
  const version = await nextBackupVersion(input.project_id);
  const backupPath = `${backupsDir(input.project_id)}/execution-plan.v${version}.md`;
  await fs.mkdir(backupsDir(input.project_id), { recursive: true });
  await fs.writeFile(backupPath, beforeMarkdown, "utf-8");

  await fs.writeFile(planPath, afterMarkdown, "utf-8");

  const changeEntry: ChangeHistory = {
    change_id: `chg-${input.project_id}-${input.section_id}-${Date.now()}`,
    project_id: input.project_id,
    section_id: input.section_id,
    before_text: beforeText,
    after_text: input.new_text,
    triggered_by: input.triggered_by,
    changed_at: new Date().toISOString(),
    backup_file: `backups/execution-plan.v${version}.md`,
  };
  await appendChangeHistory(input.project_id, changeEntry);

  return changeEntry;
}
