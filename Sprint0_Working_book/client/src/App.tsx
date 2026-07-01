import { Route, Routes } from "react-router-dom";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDashboardPage from "./pages/ProjectDashboardPage";
import ActivityFormPage from "./pages/ActivityFormPage";
import PlanPreviewPage from "./pages/PlanPreviewPage";
import ChangeHistoryPage from "./pages/ChangeHistoryPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ProjectListPage />} />
      <Route path="/projects/:projectId" element={<ProjectDashboardPage />} />
      <Route
        path="/projects/:projectId/activities/:activityId"
        element={<ActivityFormPage />}
      />
      <Route path="/projects/:projectId/plan" element={<PlanPreviewPage />} />
      <Route path="/projects/:projectId/history" element={<ChangeHistoryPage />} />
    </Routes>
  );
}
