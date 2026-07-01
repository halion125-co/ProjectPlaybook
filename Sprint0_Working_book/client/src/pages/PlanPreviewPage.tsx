import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  applySection,
  getExecutionPlanMarkdown,
  getSectionPrompt,
  previewSection,
} from "../services/api";
import type { ExecutionPlanSectionId } from "../models/types";

const SECTION_IDS: { id: ExecutionPlanSectionId; label: string }[] = [
  { id: "overview", label: "1. 프로젝트 개요" },
  { id: "background", label: "2. 배경 및 목적" },
  { id: "scope", label: "3. 수행 범위" },
  { id: "governance", label: "4. 추진 체계" },
  { id: "raci", label: "5. 역할과 책임 (RACI)" },
  { id: "methodology", label: "6. 수행 방법론" },
  { id: "schedule", label: "7. 일정 및 마일스톤" },
  { id: "communication", label: "8. 커뮤니케이션 계획" },
  { id: "deliverables", label: "9. 산출물 계획" },
  { id: "acceptance", label: "10. 승인 기준" },
  { id: "environment", label: "11. 환경 및 접근 계획" },
  { id: "raid", label: "12. 리스크/이슈/의존성/결정사항" },
  { id: "transition", label: "13. 전환 계획" },
  { id: "quality", label: "14. 품질 관리 계획" },
  { id: "change-management", label: "15. 변경 관리" },
];

export default function PlanPreviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [markdown, setMarkdown] = useState("");
  const [selectedSection, setSelectedSection] = useState<ExecutionPlanSectionId | null>(
    null
  );
  const [preview, setPreview] = useState<{
    before_text: string;
    after_text: string;
    changed: boolean;
  } | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadMarkdown() {
    if (!projectId) return;
    getExecutionPlanMarkdown(projectId).then(setMarkdown).catch((e) => setError(e.message));
  }

  useEffect(loadMarkdown, [projectId]);

  async function handleSelectSection(sectionId: ExecutionPlanSectionId) {
    if (!projectId) return;
    setSelectedSection(sectionId);
    setPrompt(null);
    setError(null);
    setMessage(null);
    try {
      const p = await previewSection(projectId, sectionId);
      setPreview(p);
      setEditedText(p.after_text);
    } catch (err) {
      setError((err as Error).message);
      setPreview(null);
    }
  }

  async function handleGetPrompt() {
    if (!projectId || !selectedSection) return;
    setError(null);
    try {
      const ctx = await getSectionPrompt(projectId, selectedSection);
      setPrompt(ctx.prompt);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleApply() {
    if (!projectId || !selectedSection) return;
    setError(null);
    try {
      await applySection(projectId, selectedSection, editedText, "manual-review");
      setMessage("섹션이 수행계획서에 반영되었습니다.");
      setPreview(null);
      setSelectedSection(null);
      loadMarkdown();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <Layout title="수행계획서 미리보기" projectId={projectId}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
        <aside>
          <h3 style={{ fontSize: 13, color: "#667085" }}>섹션 선택</h3>
          <ul style={{ listStyle: "none", padding: 0, fontSize: 13 }}>
            {SECTION_IDS.map((s) => (
              <li key={s.id} style={{ marginBottom: 4 }}>
                <button
                  onClick={() => handleSelectSection(s.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: selectedSection === s.id ? "#eef3ff" : "transparent",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    padding: 6,
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section>
          {error && <p style={{ color: "#b42318" }}>{error}</p>}
          {message && <p style={{ color: "#067647" }}>{message}</p>}

          {!selectedSection && (
            <div>
              <h3 style={{ fontSize: 14 }}>현재 execution-plan.md 전체</h3>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  background: "#f9fbff",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  maxHeight: 600,
                  overflow: "auto",
                }}
              >
                {markdown}
              </pre>
            </div>
          )}

          {selectedSection && preview && (
            <div>
              <h3 style={{ fontSize: 14 }}>
                {SECTION_IDS.find((s) => s.id === selectedSection)?.label} — 변경 미리보기
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#667085" }}>현재 문서</div>
                  <pre style={diffBoxStyle}>{preview.before_text}</pre>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#667085" }}>입력 데이터 기준 생성 결과</div>
                  <pre style={diffBoxStyle}>{preview.after_text}</pre>
                </div>
              </div>

              {!preview.changed && (
                <p style={{ fontSize: 12, color: "#667085" }}>
                  현재 문서와 동일합니다. 변경할 내용이 없습니다.
                </p>
              )}

              <div style={{ marginTop: 12 }}>
                <button onClick={handleGetPrompt}>AI 보완 프롬프트 생성</button>
              </div>

              {prompt && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, color: "#667085" }}>
                    아래 프롬프트를 외부 LLM에 붙여넣고, 반환된 결과를 검토 후 아래
                    "반영할 텍스트"에 붙여넣어 승인하세요.
                  </div>
                  <textarea readOnly rows={10} style={{ width: "100%" }} value={prompt} />
                </div>
              )}

              <h4 style={{ fontSize: 13, marginTop: 16 }}>반영할 텍스트 (검토 후 수정 가능)</h4>
              <textarea
                rows={8}
                style={{ width: "100%" }}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button onClick={handleApply}>승인하고 반영</button>
                <button
                  onClick={() => {
                    setSelectedSection(null);
                    setPreview(null);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

const diffBoxStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  background: "#f9fbff",
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 8,
  fontSize: 12,
  minHeight: 120,
};
