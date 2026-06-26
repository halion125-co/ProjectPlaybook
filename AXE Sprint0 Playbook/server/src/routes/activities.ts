import { Router } from "express";
import { getActivity, loadActivityCatalog } from "../repositories/activityCatalog.js";
import { getProject } from "../repositories/projectRepository.js";
import {
  getActivityResults,
  saveActivityResult,
} from "../repositories/activityResultRepository.js";

export const activitiesRouter = Router();

// Sprint0 A1~A7 활동 카탈로그 (폼 스키마 기준 — 읽기 전용, mock 원본을 변환한 결과)
activitiesRouter.get("/", async (_req, res) => {
  const catalog = await loadActivityCatalog();
  res.json(catalog);
});

activitiesRouter.get("/:activityId", async (req, res) => {
  const activity = await getActivity(req.params.activityId);
  if (!activity) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }
  res.json(activity);
});

// 특정 프로젝트의 특정 활동에 대해 지금까지 저장된 입력 결과 조회
activitiesRouter.get("/:activityId/projects/:projectId/results", async (req, res) => {
  const { activityId, projectId } = req.params;

  const [project, activity] = await Promise.all([
    getProject(projectId),
    getActivity(activityId),
  ]);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  if (!activity) {
    res.status(404).json({ error: "Activity not found" });
    return;
  }

  const results = await getActivityResults(projectId, activityId);
  res.json(results);
});

// 활동의 특정 Task에 대한 입력 결과 저장 (신규 또는 갱신)
activitiesRouter.post(
  "/:activityId/projects/:projectId/results",
  async (req, res) => {
    const { activityId, projectId } = req.params;
    const { task_id, fields, status, created_by } = req.body ?? {};

    if (!task_id || typeof fields !== "object" || fields === null) {
      res.status(400).json({ error: "task_id와 fields는 필수 입력값입니다." });
      return;
    }
    if (status !== "draft" && status !== "saved") {
      res.status(400).json({ error: "status는 'draft' 또는 'saved'여야 합니다." });
      return;
    }

    const [project, activity] = await Promise.all([
      getProject(projectId),
      getActivity(activityId),
    ]);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    if (!activity) {
      res.status(404).json({ error: "Activity not found" });
      return;
    }
    if (!activity.tasks.some((t) => t.task_id === task_id)) {
      res.status(400).json({
        error: `task_id '${task_id}'는 활동 '${activityId}'에 존재하지 않습니다.`,
      });
      return;
    }

    const saved = await saveActivityResult({
      project_id: projectId,
      activity_id: activityId,
      task_id,
      fields,
      status,
      created_by: created_by ?? project.pm,
    });

    res.status(201).json(saved);
  }
);
