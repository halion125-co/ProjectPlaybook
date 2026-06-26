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

// paths.ts는 모듈 로드 시점에 환경변수를 읽으므로, env 설정 후 동적 import한다.
async function loadModules() {
  const repo = await import("./projectRepository.js");
  const paths = await import("./paths.js");
  return { repo, paths };
}

describe("projectRepository", () => {
  beforeEach(async () => {
    const { paths } = await loadModules();
    await fs.rm(paths.DATA_DIR, { recursive: true, force: true });
    await fs.rm(paths.OUTPUT_DIR, { recursive: true, force: true });
  });

  afterEach(async () => {
    if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true }).catch(() => {});
  });

  it("프로젝트 생성 시 표준 목차의 execution-plan.md가 즉시 생성된다", async () => {
    const { repo, paths } = await loadModules();

    const project = await repo.createProject({
      project_id: "PJT-UNIT-001",
      name: "단위테스트 프로젝트",
      customer: "고객사X",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    expect(project.project_id).toBe("PJT-UNIT-001");

    const markdown = await fs.readFile(
      paths.executionPlanFilePath("PJT-UNIT-001"),
      "utf-8"
    );
    expect(markdown).toContain("단위테스트 프로젝트 수행계획서");
    expect(markdown).toContain("<!-- section:raci:start -->");
    expect(markdown).toContain("<!-- manual:raci:start -->");
  });

  it("프로젝트 생성 시 데이터 폴더의 부속 파일들이 빈 목록으로 스캐폴딩된다", async () => {
    const { repo, paths } = await loadModules();
    await repo.createProject({
      project_id: "PJT-UNIT-002",
      name: "스캐폴딩 테스트",
      customer: "고객사Y",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    const raid = JSON.parse(
      await fs.readFile(paths.raidFilePath("PJT-UNIT-002"), "utf-8")
    );
    expect(raid.items).toEqual([]);
  });

  it("동일한 project_id로 다시 생성하면 ProjectAlreadyExistsError가 발생한다", async () => {
    const { repo } = await loadModules();
    const input = {
      project_id: "PJT-UNIT-003",
      name: "중복 테스트",
      customer: "고객사Z",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    };

    await repo.createProject(input);

    await expect(repo.createProject(input)).rejects.toThrow(
      repo.ProjectAlreadyExistsError
    );
  });

  it("listProjects는 생성된 프로젝트를 모두 조회한다", async () => {
    const { repo } = await loadModules();
    await repo.createProject({
      project_id: "PJT-UNIT-004",
      name: "목록 테스트",
      customer: "고객사W",
      pm: "테스터",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
    });

    const projects = await repo.listProjects();
    expect(projects.some((p) => p.project_id === "PJT-UNIT-004")).toBe(true);
  });
});
