import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  title: string;
  projectId?: string;
  children: ReactNode;
}

export default function Layout({ title, projectId, children }: LayoutProps) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 20px", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: 24, borderBottom: "1px solid #ddd", paddingBottom: 12 }}>
        <Link to="/" style={{ fontSize: 13, color: "#667085", textDecoration: "none" }}>
          ← 프로젝트 목록
        </Link>
        <h1 style={{ fontSize: 22, margin: "8px 0" }}>{title}</h1>
        {projectId && (
          <nav style={{ display: "flex", gap: 12, fontSize: 13 }}>
            <Link to={`/projects/${projectId}`}>Sprint0 활동</Link>
            <Link to={`/projects/${projectId}/plan`}>수행계획서 미리보기</Link>
            <Link to={`/projects/${projectId}/history`}>변경 이력</Link>
          </nav>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
