import { Router } from "express";
import {
  ProjectAlreadyExistsError,
  createProject,
  getProject,
  listProjects,
} from "../repositories/projectRepository.js";

export const projectsRouter = Router();

projectsRouter.get("/", async (_req, res) => {
  const projects = await listProjects();
  res.json(projects);
});

projectsRouter.get("/:projectId", async (req, res) => {
  const project = await getProject(req.params.projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(project);
});

projectsRouter.post("/", async (req, res) => {
  const { project_id, name, customer, pm, start_date, end_date } = req.body ?? {};

  if (!project_id || !name || !customer || !pm || !start_date || !end_date) {
    res.status(400).json({
      error:
        "project_id, name, customer, pm, start_date, end_date는 필수 입력값입니다.",
    });
    return;
  }

  try {
    const project = await createProject({
      project_id,
      name,
      customer,
      pm,
      start_date,
      end_date,
    });
    res.status(201).json(project);
  } catch (err) {
    if (err instanceof ProjectAlreadyExistsError) {
      res.status(409).json({ error: err.message });
      return;
    }
    throw err;
  }
});
