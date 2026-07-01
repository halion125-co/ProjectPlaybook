import { describe, expect, it } from "vitest";
import type { Activity, ActivityResult } from "../../models/types.js";
import { renderSectionFromResults } from "./sectionRenderer.js";

function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    activity_id: "team-raci",
    code: "A2",
    title: "수행팀 투입 및 R&R 정렬",
    short: "",
    purpose: "",
    chapters: "",
    tasks: [{ task_id: "raci-matrix", title: "RACI 작성", description: "" }],
    decisions: [],
    owners: [],
    info: [],
    outputs: [],
    checklist: [],
    section_mapping: ["governance", "raci"],
    ...overrides,
  };
}

function makeResult(overrides: Partial<ActivityResult> = {}): ActivityResult {
  return {
    result_id: "res-1",
    project_id: "PJT-1",
    activity_id: "team-raci",
    task_id: "raci-matrix",
    fields: {},
    status: "saved",
    created_by: "tester",
    created_at: "2026-06-19T00:00:00Z",
    updated_at: "2026-06-19T00:00:00Z",
    ...overrides,
  };
}

describe("renderSectionFromResults", () => {
  it("매핑된 활동에 입력이 없으면 안내 placeholder를 반환한다", () => {
    const activity = makeActivity();
    const text = renderSectionFromResults("raci", [{ activity, results: [] }]);

    expect(text).toContain("입력이 아직 없습니다");
  });

  it("객체 배열 필드는 Markdown 표로 렌더링한다", () => {
    const activity = makeActivity();
    const result = makeResult({
      fields: {
        members: [
          { name: "홍길동", role: "PM", raci: "A" },
          { name: "고객측 김OO", role: "고객PM", raci: "A/R" },
        ],
      },
    });

    const text = renderSectionFromResults("raci", [{ activity, results: [result] }]);

    expect(text).toContain("| name | role | raci |");
    expect(text).toContain("홍길동");
    expect(text).toContain("고객측 김OO");
  });

  it("section_mapping에 해당 섹션이 없는 활동은 결과에서 제외한다", () => {
    const activity = makeActivity({ section_mapping: ["communication"] });
    const result = makeResult();

    const text = renderSectionFromResults("raci", [{ activity, results: [result] }]);

    expect(text).toContain("입력이 아직 없습니다");
  });

  it("문자열 배열 필드는 목록으로 렌더링한다", () => {
    const activity = makeActivity();
    const result = makeResult({ fields: { risks: ["권한 지연", "데이터 미준비"] } });

    const text = renderSectionFromResults("raci", [{ activity, results: [result] }]);

    expect(text).toContain("- 권한 지연");
    expect(text).toContain("- 데이터 미준비");
  });
});
