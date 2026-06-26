import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, listProjects } from "../services/api";
import type { Project } from "../models/types";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    project_id: "",
    name: "",
    customer: "",
    pm: "",
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    listProjects().then(setProjects).catch((e) => setError(e.message));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const project = await createProject(form);
      setProjects((prev) => [project, ...prev]);
      navigate(`/projects/${project.project_id}`);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 22 }}>Execution Plan Builder</h1>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16 }}>프로젝트 목록</h2>
        {projects.length === 0 && <p style={{ color: "#667085" }}>등록된 프로젝트가 없습니다.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {projects.map((p) => (
            <li
              key={p.project_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <a href={`/projects/${p.project_id}`} style={{ fontWeight: 700 }}>
                {p.name}
              </a>
              <div style={{ fontSize: 13, color: "#667085" }}>
                {p.customer} · {p.pm} · {p.start_date} ~ {p.end_date}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: 16 }}>새 프로젝트 생성</h2>
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          <input
            placeholder="프로젝트 ID (예: PJT-2026-001)"
            value={form.project_id}
            onChange={(e) => setForm({ ...form, project_id: e.target.value })}
            required
          />
          <input
            placeholder="프로젝트명"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="고객사"
            value={form.customer}
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
            required
          />
          <input
            placeholder="수행PM"
            value={form.pm}
            onChange={(e) => setForm({ ...form, pm: e.target.value })}
            required
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              required
            />
          </div>
          <button type="submit">생성</button>
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
        </form>
      </section>
    </div>
  );
}
