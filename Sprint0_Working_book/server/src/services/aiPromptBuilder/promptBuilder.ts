import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ExecutionPlanSectionId } from "../../models/types.js";
import { loadActivityCatalog } from "../../repositories/activityCatalog.js";
import { getActivityResults } from "../../repositories/activityResultRepository.js";
import { executionPlanFilePath } from "../../repositories/paths.js";
import { extractSectionText } from "../markdownEngine/sectionMarkers.js";
import { renderSectionFromResults, type ActivityResultsByActivity } from "../markdownEngine/sectionRenderer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const SECTION_GUIDES_PATH = path.join(
  ROOT_DIR,
  "server",
  "templates",
  "activity-schema",
  "section-guides.json"
);

let guidesCache: Record<ExecutionPlanSectionId, string> | null = null;

async function loadSectionGuides(): Promise<Record<ExecutionPlanSectionId, string>> {
  if (guidesCache) return guidesCache;
  const raw = await fs.readFile(SECTION_GUIDES_PATH, "utf-8");
  guidesCache = JSON.parse(raw) as Record<ExecutionPlanSectionId, string>;
  return guidesCache;
}

const TONE_GUIDE =
  "문서 전체는 공식 수행계획서 톤(개조식 또는 표 형식, 1인칭 주어 생략, 추측성 표현 금지)으로 작성한다. " +
  "입력에 없는 사실을 임의로 추가하지 않는다. 불확실하거나 누락된 항목은 본문에 단정적으로 채우지 말고 missing_inputs로 분리한다.";

const OUTPUT_FORMAT_GUIDE = `다음 JSON 형식으로만 응답한다. 다른 텍스트를 덧붙이지 않는다.
{
  "section_id": "<섹션 ID>",
  "suggested_text": "<Markdown 본문>",
  "change_summary": "<무엇을 어떻게 정리/병합했는지 1~2문장>",
  "missing_inputs": ["<입력 데이터에 없어서 본문에 채우지 못한 항목>"],
  "clarifying_questions": ["<사용자에게 추가로 확인이 필요한 질문>"]
}`;

export interface SectionPromptContext {
  section_id: ExecutionPlanSectionId;
  prompt: string;
  has_existing_text: boolean;
  has_input_results: boolean;
}

// PRD 8.2 — AI에게 전달되는 입력 컨텍스트를 조립한다.
// manual:{id} 영역은 절대 포함하지 않는다(8.6 — AI가 덮어쓰면 안 되는 영역이므로 컨텍스트로도 주지 않음).
export async function buildSectionPrompt(
  projectId: string,
  sectionId: ExecutionPlanSectionId
): Promise<SectionPromptContext> {
  const [guides, catalog] = await Promise.all([
    loadSectionGuides(),
    loadActivityCatalog(),
  ]);

  const groups: ActivityResultsByActivity[] = await Promise.all(
    catalog.map(async (activity) => ({
      activity,
      results: await getActivityResults(projectId, activity.activity_id),
    }))
  );

  const relevantActivities = catalog.filter((a) => a.section_mapping.includes(sectionId));
  const rawInputSummary = renderSectionFromResults(sectionId, groups);
  const hasInputResults = groups.some(
    (g) => g.activity.section_mapping.includes(sectionId) && g.results.length > 0
  );

  const markdown = await fs.readFile(executionPlanFilePath(projectId), "utf-8");
  const existingText = extractSectionText(markdown, sectionId);
  // 템플릿 초기 placeholder("_(...)_" 형태의 안내문)는 실제 기존 텍스트로 취급하지 않는다.
  const isPlaceholderText = /^_\(.*\)_$/s.test(existingText);
  const hasExistingText = existingText.length > 0 && !isPlaceholderText;

  const prompt = `당신은 수행계획서 작성을 보조하는 어시스턴트입니다.

## 섹션 정보
- 섹션 ID: ${sectionId}
- 섹션 목적: ${guides[sectionId] ?? "(가이드 없음)"}
- 연결된 Sprint0 활동: ${relevantActivities.map((a) => `${a.code} ${a.title}`).join(", ") || "(없음)"}

## 기존 섹션 텍스트 (병합 대상)
${hasExistingText ? existingText : "(기존 텍스트 없음 — 최초 생성)"}

## 사용자 입력 원문 (이 데이터 안에서만 본문을 구성할 것)
${rawInputSummary}

## 작성 지침
${TONE_GUIDE}

## 출력 형식
${OUTPUT_FORMAT_GUIDE}`;

  return {
    section_id: sectionId,
    prompt,
    has_existing_text: hasExistingText,
    has_input_results: hasInputResults,
  };
}
