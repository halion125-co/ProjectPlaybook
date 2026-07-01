import { Router } from "express";
import { getProject } from "../repositories/projectRepository.js";
import { readJson } from "../repositories/jsonStore.js";
import { changeHistoryFilePath } from "../repositories/paths.js";
import type { ChangeHistoryFile } from "../models/types.js";

export const changeHistoryRouter = Router();

changeHistoryRouter.get("/:projectId", async (req, res) => {
  const project = await getProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const file = await readJson<ChangeHistoryFile>(
    changeHistoryFilePath(req.params.projectId)
  );
  const items = file?.items ?? [];
  // 최신 변경이 먼저 보이도록 정렬
  res.json([...items].sort((a, b) => b.changed_at.localeCompare(a.changed_at)));
});
