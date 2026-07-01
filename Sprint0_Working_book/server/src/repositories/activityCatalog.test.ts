import { describe, expect, it } from "vitest";
import { getActivity, loadActivityCatalog } from "./activityCatalog.js";

describe("activityCatalog", () => {
  it("Sprint0_Playbook/activity_data.json의 7개 활동을 모두 로드한다", async () => {
    const catalog = await loadActivityCatalog();
    expect(catalog).toHaveLength(7);
    expect(catalog.map((a) => a.activity_id)).toEqual([
      "way-of-working",
      "team-raci",
      "communication-cadence",
      "deliverable-acceptance",
      "environment-access",
      "readiness-raid",
      "transition-day1",
    ]);
  });

  it("각 활동은 section_mapping.json 기준 섹션 매핑을 가진다", async () => {
    const activity = await getActivity("team-raci");
    expect(activity?.section_mapping).toEqual(["governance", "raci"]);
  });

  it("존재하지 않는 활동 ID는 null을 반환한다", async () => {
    const activity = await getActivity("nonexistent-activity");
    expect(activity).toBeNull();
  });

  it("각 활동의 tasks는 task_id, title, description을 모두 가진다", async () => {
    const activity = await getActivity("way-of-working");
    expect(activity?.tasks.length).toBeGreaterThan(0);
    for (const task of activity?.tasks ?? []) {
      expect(task.task_id).toBeTruthy();
      expect(task.title).toBeTruthy();
      expect(task.description).toBeTruthy();
    }
  });
});
