import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getActivityResults, getProject, listActivities } from "../services/api";
import type { Activity, Project } from "../models/types";

interface ActivityWithStatus extends Activity {
  resultCount: number;
}

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<ActivityWithStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    Promise.all([getProject(projectId), listActivities()])
      .then(async ([proj, catalog]) => {
        setProject(proj);
        const withStatus = await Promise.all(
          catalog.map(async (activity) => {
            const results = await getActivityResults(activity.activity_id, projectId);
            return { ...activity, resultCount: results.length };
          })
        );
        setActivities(withStatus);
      })
      .catch((e) => setError(e.message));
  }, [projectId]);

  if (error) return <Layout title="오류">{error}</Layout>;
  if (!project) return <Layout title="로딩 중...">로딩 중...</Layout>;

  return (
    <Layout title={`${project.name} — Sprint0 활동`} projectId={project.project_id}>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
        {activities.map((a) => (
          <li
            key={a.activity_id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <Link
              to={`/projects/${project.project_id}/activities/${a.activity_id}`}
              style={{ fontWeight: 700 }}
            >
              [{a.code}] {a.title}
            </Link>
            <div style={{ fontSize: 13, color: "#667085" }}>{a.short}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>
              입력 완료: {a.resultCount} / {a.tasks.length} Task
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
