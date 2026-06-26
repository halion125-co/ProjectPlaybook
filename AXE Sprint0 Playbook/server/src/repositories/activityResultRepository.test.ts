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
  const repo = await import("./activityResultRepository.js");
  const paths = await import("./paths.js");
  return { repo, paths };
}

describe("activityResultRepository", () => {
  beforeEach(async () => {
    const { paths } = await loadModules();
    await fs.rm(paths.DATA_DIR, { recursive: true, force: true });
  });

  afterEach(async () => {
    if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => {});
  });

  it("신규 task_id 입력은 결과 목록에 추가된다", async () => {
    const { repo } = await loadModules();

    await repo.saveActivityResult({
      project_id: "PJT-UNIT-010",
      activity_id: "team-raci",
      task_id: "raci-matrix",
      fields: { note: "first" },
      status: "saved",
      created_by: "tester",
    });

    const results = await repo.getActivityResults("PJT-UNIT-010", "team-raci");
    expect(results).toHaveLength(1);
    expect(results[0].fields).toEqual({ note: "first" });
  });

  it("동일한 task_id로 재입력하면 추가되지 않고 갱신된다 (upsert)", async () => {
    const { repo } = await loadModules();

    await repo.saveActivityResult({
      project_id: "PJT-UNIT-011",
      activity_id: "team-raci",
      task_id: "raci-matrix",
      fields: { members: 1 },
      status: "saved",
      created_by: "tester",
    });
    await repo.saveActivityResult({
      project_id: "PJT-UNIT-011",
      activity_id: "team-raci",
      task_id: "raci-matrix",
      fields: { members: 2 },
      status: "saved",
      created_by: "tester",
    });

    const results = await repo.getActivityResults("PJT-UNIT-011", "team-raci");
    expect(results).toHaveLength(1);
    expect(results[0].fields).toEqual({ members: 2 });
  });

  it("다른 task_id 입력은 기존 결과와 별개로 누적된다", async () => {
    const { repo } = await loadModules();

    await repo.saveActivityResult({
      project_id: "PJT-UNIT-012",
      activity_id: "team-raci",
      task_id: "raci-matrix",
      fields: { a: 1 },
      status: "saved",
      created_by: "tester",
    });
    await repo.saveActivityResult({
      project_id: "PJT-UNIT-012",
      activity_id: "team-raci",
      task_id: "escalation-path",
      fields: { b: 2 },
      status: "saved",
      created_by: "tester",
    });

    const results = await repo.getActivityResults("PJT-UNIT-012", "team-raci");
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.task_id).sort()).toEqual([
      "escalation-path",
      "raci-matrix",
    ]);
  });

  it("저장된 적 없는 활동을 조회하면 빈 배열을 반환한다", async () => {
    const { repo } = await loadModules();
    const results = await repo.getActivityResults("PJT-UNIT-013", "team-raci");
    expect(results).toEqual([]);
  });
});
