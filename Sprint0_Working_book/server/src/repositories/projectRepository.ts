import fs from "node:fs/promises";
import type {
  Project,
  ExecutionPlan,
  ActionItemFile,
  ApprovalFile,
  ChangeHistoryFile,
  DecisionLogFile,
  RAIDFile,
} from "../models/types.js";
import { readJson, writeJson, pathExists } from "./jsonStore.js";
import {
  DATA_DIR,
  TEMPLATE_PATH,
  actionItemsFilePath,
  approvalsFilePath,
  backupsDir,
  changeHistoryFilePath,
  decisionsFilePath,
  executionPlanFilePath,
  projectDataDir,
  projectFilePath,
  projectOutputDir,
  raidFilePath,
} from "./paths.js";

export class ProjectAlreadyExistsError extends Error {
  constructor(projectId: string) {
    super(`Project already exists: ${projectId}`);
    this.name = "ProjectAlreadyExistsError";
  }
}

export interface CreateProjectInput {
  project_id: string;
  name: string;
  customer: string;
  pm: string;
  start_date: string;
  end_date: string;
}

function renderInitialPlan(project: Project, plan: ExecutionPlan, template: string): string {
  return template
    .replace(/{{project\.name}}/g, project.name)
    .replace(/{{project\.project_id}}/g, project.project_id)
    .replace(/{{project\.customer}}/g, project.customer)
    .replace(/{{project\.pm}}/g, project.pm)
    .replace(/{{project\.start_date}}/g, project.start_date)
    .replace(/{{project\.end_date}}/g, project.end_date)
    .replace(/{{plan\.version}}/g, String(plan.version))
    .replace(/{{plan\.last_generated_at}}/g, plan.last_generated_at);
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  if (await pathExists(projectDataDir(input.project_id))) {
    throw new ProjectAlreadyExistsError(input.project_id);
  }

  const now = new Date().toISOString();
  const project: Project = {
    project_id: input.project_id,
    name: input.name,
    customer: input.customer,
    pm: input.pm,
    start_date: input.start_date,
    end_date: input.end_date,
    created_at: now,
    updated_at: now,
  };

  // 데이터 폴더 스캐폴딩 (PRD 11장 구조)
  await fs.mkdir(projectDataDir(input.project_id), { recursive: true });
  await writeJson(projectFilePath(input.project_id), project);
  await writeJson(raidFilePath(input.project_id), { items: [] } satisfies RAIDFile);
  await writeJson(decisionsFilePath(input.project_id), { items: [] } satisfies DecisionLogFile);
  await writeJson(actionItemsFilePath(input.project_id), { items: [] } satisfies ActionItemFile);
  await writeJson(approvalsFilePath(input.project_id), { items: [] } satisfies ApprovalFile);
  await writeJson(changeHistoryFilePath(input.project_id), {
    items: [],
  } satisfies ChangeHistoryFile);

  // 초기 execution-plan.md 생성 (PRD 13장 수용 기준: 생성 즉시 표준 목차 문서가 존재해야 함)
  const plan: ExecutionPlan = {
    plan_id: `plan-${input.project_id}`,
    project_id: input.project_id,
    file_path: `output/projects/${input.project_id}/execution-plan.md`,
    version: 1,
    last_generated_at: now,
  };
  const template = await fs.readFile(TEMPLATE_PATH, "utf-8");
  const initialMarkdown = renderInitialPlan(project, plan, template);

  await fs.mkdir(projectOutputDir(input.project_id), { recursive: true });
  await fs.mkdir(backupsDir(input.project_id), { recursive: true });
  await fs.writeFile(executionPlanFilePath(input.project_id), initialMarkdown, "utf-8");

  return project;
}

export async function getProject(projectId: string): Promise<Project | null> {
  return readJson<Project>(projectFilePath(projectId));
}

export async function listProjects(): Promise<Project[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(DATA_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const projects: Project[] = [];
  for (const entry of entries) {
    if (entry === ".gitkeep") continue;
    const project = await getProject(entry);
    if (project) projects.push(project);
  }
  return projects.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
