import express from "express";
import { projectsRouter } from "./routes/projects.js";
import { activitiesRouter } from "./routes/activities.js";
import { executionPlanRouter } from "./routes/executionPlan.js";
import { aiRouter } from "./routes/ai.js";
import { changeHistoryRouter } from "./routes/changeHistory.js";

const app = express();
app.use(express.json());

app.use("/api/projects", projectsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/execution-plan", executionPlanRouter);
app.use("/api/ai", aiRouter);
app.use("/api/change-history", changeHistoryRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Execution Plan Builder server listening on port ${PORT}`);
});
