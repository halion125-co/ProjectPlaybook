import { Router } from "express";
import fs from "node:fs/promises";
import { getProject } from "../repositories/projectRepository.js";
import { executionPlanFilePath } from "../repositories/paths.js";
import {
  applySectionUpdate,
  previewSectionUpdate,
} from "../services/markdownEngine/planUpdater.js";
import { SectionMarkerNotFoundError } from "../services/markdownEngine/sectionMarkers.js";
import type { ExecutionPlanSectionId } from "../models/types.js";

export const executionPlanRouter = Router();

// 현재 execution-plan.md 전체 내용 조회 (미리보기 화면 기본 렌더링용)
executionPlanRouter.get("/:projectId", async (req, res) => {
  const project = await getProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const markdown = await fs.readFile(executionPlanFilePath(req.params.projectId), "utf-8");
  res.type("text/markdown").send(markdown);
});

// 특정 섹션을 현재 입력 데이터로 갱신했을 때의 diff 미리보기 (파일에 쓰지 않음)
executionPlanRouter.get(
  "/:projectId/sections/:sectionId/preview",
  async (req, res) => {
    const project = await getProject(req.params.projectId);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    try {
      const preview = await previewSectionUpdate(
        req.params.projectId,
        req.params.sectionId as ExecutionPlanSectionId
      );
      res.json(preview);
    } catch (err) {
      if (err instanceof SectionMarkerNotFoundError) {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  }
);

// 승인된 텍스트를 실제 execution-plan.md 섹션에 반영 (백업 + 변경이력 기록 포함)
// 호출 전 승인(Approval) 확인은 호출자 책임 — 이 엔드포인트는 반영만 수행한다.
executionPlanRouter.post(
  "/:projectId/sections/:sectionId/apply",
  async (req, res) => {
    const project = await getProject(req.params.projectId);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const { new_text, triggered_by } = req.body ?? {};
    if (typeof new_text !== "string" || !triggered_by) {
      res.status(400).json({ error: "new_text와 triggered_by는 필수 입력값입니다." });
      return;
    }

    try {
      const changeEntry = await applySectionUpdate({
        project_id: req.params.projectId,
        section_id: req.params.sectionId as ExecutionPlanSectionId,
        new_text,
        triggered_by,
      });
      res.status(201).json(changeEntry);
    } catch (err) {
      if (err instanceof SectionMarkerNotFoundError) {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  }
);
