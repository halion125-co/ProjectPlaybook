import { Router } from "express";
import { getProject } from "../repositories/projectRepository.js";
import { buildSectionPrompt } from "../services/aiPromptBuilder/promptBuilder.js";
import { SectionMarkerNotFoundError } from "../services/markdownEngine/sectionMarkers.js";
import type { ExecutionPlanSectionId } from "../models/types.js";

export const aiRouter = Router();

// PRD 8.7 — MVP는 API 키 설정 여부와 무관하게 프롬프트 텍스트까지만 생성한다.
// 실제 LLM 호출은 향후 버전에서 선택적으로 추가한다(A4 가정 — 외부 의존성 최소화).
aiRouter.get(
  "/projects/:projectId/sections/:sectionId/prompt",
  async (req, res) => {
    const project = await getProject(req.params.projectId);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    try {
      const context = await buildSectionPrompt(
        req.params.projectId,
        req.params.sectionId as ExecutionPlanSectionId
      );

      if (!context.has_input_results) {
        res.status(422).json({
          error:
            "이 섹션에 매핑된 활동의 입력 데이터가 없습니다. 먼저 관련 Activity를 입력하세요.",
        });
        return;
      }

      res.json(context);
    } catch (err) {
      if (err instanceof SectionMarkerNotFoundError) {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  }
);
