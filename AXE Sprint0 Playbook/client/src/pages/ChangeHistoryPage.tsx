import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { listChangeHistory } from "../services/api";
import type { ChangeHistory } from "../models/types";

export default function ChangeHistoryPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [items, setItems] = useState<ChangeHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    listChangeHistory(projectId).then(setItems).catch((e) => setError(e.message));
  }, [projectId]);

  return (
    <Layout title="변경 이력" projectId={projectId}>
      {error && <p style={{ color: "#b42318" }}>{error}</p>}
      {items.length === 0 && <p style={{ color: "#667085" }}>아직 반영된 변경 이력이 없습니다.</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {items.map((item) => (
          <li
            key={item.change_id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              [{item.section_id}] {item.changed_at}
            </div>
            <div style={{ fontSize: 12, color: "#667085", marginBottom: 8 }}>
              트리거: {item.triggered_by} · 백업: {item.backup_file}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: "#667085" }}>변경 전</div>
                <pre style={boxStyle}>{item.before_text}</pre>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#667085" }}>변경 후</div>
                <pre style={boxStyle}>{item.after_text}</pre>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

const boxStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  background: "#f9fbff",
  border: "1px solid #eee",
  borderRadius: 6,
  padding: 6,
  fontSize: 11,
  maxHeight: 200,
  overflow: "auto",
};
