import type { Activity, ActivityResult, ExecutionPlanSectionId } from "../../models/types.js";

// ActivityResult.fields는 자유 구조(Record<string, unknown>)이므로,
// 폼에서 어떤 형태로 입력했는지에 따라 표/목록 중 적절한 형태로 렌더링한다.
// AI 보완 전 "기계적 정리" 단계의 출력이며, 문장화·요약은 하지 않는다.

function renderValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "_(없음)_";
    if (typeof value[0] === "object" && value[0] !== null) {
      return renderObjectArrayAsTable(value as Record<string, unknown>[]);
    }
    return value.map((v) => `- ${String(v)}`).join("\n");
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `- **${k}**: ${String(v)}`)
      .join("\n");
  }
  return String(value);
}

function renderObjectArrayAsTable(rows: Record<string, unknown>[]): string {
  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const header = `| ${columns.join(" | ")} |`;
  const divider = `|${columns.map(() => "---").join("|")}|`;
  const body = rows
    .map((row) => `| ${columns.map((c) => String(row[c] ?? "")).join(" | ")} |`)
    .join("\n");

  return [header, divider, body].join("\n");
}

function renderActivityResult(activity: Activity, result: ActivityResult): string {
  const task = activity.tasks.find((t) => t.task_id === result.task_id);
  const taskTitle = task?.title ?? result.task_id;

  const fieldEntries = Object.entries(result.fields);
  if (fieldEntries.length === 0) {
    return `### ${taskTitle}\n\n_(입력값 없음)_`;
  }

  const fieldBlocks = fieldEntries.map(
    ([key, value]) => `**${key}**\n\n${renderValue(value)}`
  );

  return `### ${taskTitle}\n\n${fieldBlocks.join("\n\n")}`;
}

export interface ActivityResultsByActivity {
  activity: Activity;
  results: ActivityResult[];
}

// 특정 섹션 ID에 매핑된 모든 활동의 결과를 모아 하나의 Markdown 본문으로 렌더링한다.
export function renderSectionFromResults(
  sectionId: ExecutionPlanSectionId,
  groups: ActivityResultsByActivity[]
): string {
  const relevant = groups.filter(
    (g) => g.activity.section_mapping.includes(sectionId) && g.results.length > 0
  );

  if (relevant.length === 0) {
    return `_(이 섹션에 매핑된 활동(${groups
      .map((g) => g.activity.code)
      .join(", ")})의 입력이 아직 없습니다.)_`;
  }

  return relevant
    .map((g) => {
      const body = g.results.map((r) => renderActivityResult(g.activity, r)).join("\n\n");
      return `**[${g.activity.code}] ${g.activity.title}**\n\n${body}`;
    })
    .join("\n\n---\n\n");
}
