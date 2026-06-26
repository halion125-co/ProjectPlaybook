import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Activity, ActivityTask, ExecutionPlanSectionId } from "../models/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..", "..", "..");

// 기존 mock 원본 — 읽기 전용으로만 참조하며 절대 수정하지 않는다.
const MOCK_ACTIVITY_DATA_PATH = path.join(
  ROOT_DIR,
  "..",
  "sprint0-activities",
  "activity_data.json"
);
const SECTION_MAPPING_PATH = path.join(
  ROOT_DIR,
  "server",
  "templates",
  "activity-schema",
  "section-mapping.json"
);

interface MockActivity {
  id: string;
  code: string;
  title: string;
  short: string;
  purpose: string;
  chapters: string;
  level?: string;
  template?: string;
  tasks: [string, string][];
  play?: string[];
  decisions: [string, string][];
  owners: [string, string, string][];
  info: string[];
  outputs: [string, string][];
  checklist: string[];
}

interface MockActivityData {
  activities: MockActivity[];
}

type SectionMapping = Record<string, ExecutionPlanSectionId[]>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function toTasks(raw: [string, string][]): ActivityTask[] {
  return raw.map(([title, description]) => ({
    task_id: slugify(title),
    title,
    description,
  }));
}

let cache: Activity[] | null = null;

// activity_data.json(mock 원본)을 Activity 타입으로 변환한다.
// 변환 결과는 서버 메모리에만 캐시되며, mock 파일이나 신규 시스템 어디에도 다시 쓰지 않는다.
export async function loadActivityCatalog(): Promise<Activity[]> {
  if (cache) return cache;

  const [mockRaw, mappingRaw] = await Promise.all([
    fs.readFile(MOCK_ACTIVITY_DATA_PATH, "utf-8"),
    fs.readFile(SECTION_MAPPING_PATH, "utf-8"),
  ]);

  const mock = JSON.parse(mockRaw) as MockActivityData;
  const mapping = JSON.parse(mappingRaw) as SectionMapping;

  cache = mock.activities.map((a): Activity => ({
    activity_id: a.id,
    code: a.code,
    title: a.title,
    short: a.short,
    purpose: a.purpose,
    chapters: a.chapters,
    level: a.level,
    template: a.template,
    play: a.play ?? [],
    tasks: toTasks(a.tasks),
    decisions: a.decisions.map(([title, description]) => ({ title, description })),
    owners: a.owners.map(([role, raci, responsibility]) => ({
      role,
      raci,
      responsibility,
    })),
    info: a.info,
    outputs: a.outputs.map(([template_code, description]) => ({
      template_code,
      description,
    })),
    checklist: a.checklist,
    section_mapping: mapping[a.id] ?? [],
  }));

  return cache;
}

export async function getActivity(activityId: string): Promise<Activity | null> {
  const catalog = await loadActivityCatalog();
  return catalog.find((a) => a.activity_id === activityId) ?? null;
}

// 테스트 등에서 mock 파일 변경 후 재로딩이 필요할 때만 사용.
export function clearActivityCatalogCache(): void {
  cache = null;
}
