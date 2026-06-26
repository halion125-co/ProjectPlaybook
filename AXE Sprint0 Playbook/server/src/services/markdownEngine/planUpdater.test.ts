import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

let tmpRoot: string;

beforeAll(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "epb-test-"));
  process.env.EPB_DATA_ROOT = path.join(tmpRoot, "data");
  process.env.EPB_OUTPUT_ROOT = path.join(tmpRoot, "output");
});

async function loadModules() {
  const projectRepo = await import("../../repositories/projectRepository.js");
  const activityResultRepo = await import("../../repositories/activityResultRepository.js");
  const planUpdater = await import("./planUpdater.js");
  const sectionMarkers = await import("./sectionMarkers.js");
  const paths = await import("../../repositories/paths.js");
  return { projectRepo, activityResultRepo, planUpdater, sectionMarkers, paths };
}

describe("planUpdater", () => {
  beforeEach(async () => {
    const { paths } = await loadModules();
    await fs.rm(paths.DATA_DIR, { recursive: true, force: true });
    await fs.rm(paths.OUTPUT_DIR, { recursive: true, force: true });
  });

  afterEach(async () => {
    if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => {});
  });

  it("입력 데이터가 있으면 previewSectionUpdate는 changed=true와 렌더링된 본문을 반환한다", async () => {
    const { projectRepo, activityResultRepo, planUpdater } = await loadModules();

    await projectRepo.createProject({
      project_id: "PJT-PLAN-001",
      name: "미리보기 테스트",
      customer: "고객사",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });
    await activityResultRepo.saveActivityResult({
      project_id: "PJT-PLAN-001",
      activity_id: "team-raci",
      task_id: "raci-matrix",
      fields: { members: [{ name: "홍길동", role: "PM", raci: "A" }] },
      status: "saved",
      created_by: "테스터",
    });

    const preview = await planUpdater.previewSectionUpdate("PJT-PLAN-001", "raci");
    expect(preview.changed).toBe(true);
    expect(preview.after_text).toContain("홍길동");
  });

  it("applySectionUpdate는 section 영역만 교체하고 manual 영역은 보존한다", async () => {
    const { projectRepo, planUpdater, paths } = await loadModules();

    await projectRepo.createProject({
      project_id: "PJT-PLAN-002",
      name: "반영 테스트",
      customer: "고객사",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    const planPath = paths.executionPlanFilePath("PJT-PLAN-002");
    const original = await fs.readFile(planPath, "utf-8");
    const withManualNote = original.replace(
      "<!-- manual:raci:start -->\n<!-- manual:raci:end -->",
      "<!-- manual:raci:start -->\n사용자가 직접 추가한 비고\n<!-- manual:raci:end -->"
    );
    await fs.writeFile(planPath, withManualNote, "utf-8");

    await planUpdater.applySectionUpdate({
      project_id: "PJT-PLAN-002",
      section_id: "raci",
      new_text: "새로 생성된 RACI 표",
      triggered_by: "res-test",
    });

    const updated = await fs.readFile(planPath, "utf-8");
    expect(updated).toContain("새로 생성된 RACI 표");
    expect(updated).toContain("사용자가 직접 추가한 비고");
  });

  it("applySectionUpdate는 백업 파일을 생성하고 ChangeHistory에 기록한다", async () => {
    const { projectRepo, planUpdater, paths } = await loadModules();

    await projectRepo.createProject({
      project_id: "PJT-PLAN-003",
      name: "이력 테스트",
      customer: "고객사",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    const change = await planUpdater.applySectionUpdate({
      project_id: "PJT-PLAN-003",
      section_id: "scope",
      new_text: "신규 범위 텍스트",
      triggered_by: "res-test",
    });

    expect(change.backup_file).toBe("backups/execution-plan.v1.md");
    const backupExists = await fs
      .access(path.join(paths.backupsDir("PJT-PLAN-003"), "execution-plan.v1.md"))
      .then(() => true)
      .catch(() => false);
    expect(backupExists).toBe(true);

    const historyRaw = await fs.readFile(
      paths.changeHistoryFilePath("PJT-PLAN-003"),
      "utf-8"
    );
    const history = JSON.parse(historyRaw);
    expect(history.items).toHaveLength(1);
    expect(history.items[0].section_id).toBe("scope");
  });

  it("존재하지 않는 섹션 마커를 갱신하려 하면 SectionMarkerNotFoundError를 던지고 파일을 바꾸지 않는다", async () => {
    const { projectRepo, planUpdater, sectionMarkers, paths } = await loadModules();

    await projectRepo.createProject({
      project_id: "PJT-PLAN-004",
      name: "에러 테스트",
      customer: "고객사",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    const planPath = paths.executionPlanFilePath("PJT-PLAN-004");
    const before = await fs.readFile(planPath, "utf-8");

    await expect(
      planUpdater.applySectionUpdate({
        project_id: "PJT-PLAN-004",
        // @ts-expect-error 의도적으로 존재하지 않는 섹션 ID를 사용
        section_id: "nonexistent",
        new_text: "x",
        triggered_by: "res-test",
      })
    ).rejects.toThrow(sectionMarkers.SectionMarkerNotFoundError);

    const after = await fs.readFile(planPath, "utf-8");
    expect(after).toBe(before);
  });
});
