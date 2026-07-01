import type { ActivityResult, ActivityResultFile } from "../models/types.js";
import { readJson, writeJson } from "./jsonStore.js";
import { activityResultFilePath } from "./paths.js";

export async function getActivityResults(
  projectId: string,
  activityId: string
): Promise<ActivityResult[]> {
  const file = await readJson<ActivityResultFile>(
    activityResultFilePath(projectId, activityId)
  );
  return file?.results ?? [];
}

export interface SaveActivityResultInput {
  result_id?: string;
  project_id: string;
  activity_id: string;
  task_id: string;
  fields: Record<string, unknown>;
  status: "draft" | "saved";
  created_by: string;
}

// 같은 (activity_id, task_id) 입력은 갱신으로 처리하고, 신규 task_id는 추가한다.
// 입력값은 누적되며 절대 다른 task_id의 결과를 덮어쓰지 않는다.
export async function saveActivityResult(
  input: SaveActivityResultInput
): Promise<ActivityResult> {
  const filePath = activityResultFilePath(input.project_id, input.activity_id);
  const existing = await readJson<ActivityResultFile>(filePath);
  const results = existing?.results ?? [];

  const now = new Date().toISOString();
  const matchIndex = results.findIndex((r) => r.task_id === input.task_id);

  let saved: ActivityResult;
  if (matchIndex >= 0) {
    saved = {
      ...results[matchIndex],
      fields: input.fields,
      status: input.status,
      updated_at: now,
    };
    results[matchIndex] = saved;
  } else {
    saved = {
      result_id:
        input.result_id ?? `res-${input.activity_id}-${input.task_id}-${Date.now()}`,
      project_id: input.project_id,
      activity_id: input.activity_id,
      task_id: input.task_id,
      fields: input.fields,
      status: input.status,
      created_by: input.created_by,
      created_at: now,
      updated_at: now,
    };
    results.push(saved);
  }

  await writeJson(filePath, { activity_id: input.activity_id, results } satisfies ActivityResultFile);
  return saved;
}
