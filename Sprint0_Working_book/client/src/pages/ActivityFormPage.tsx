import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getActivity, getActivityResults, saveActivityResult } from "../services/api";
import type { Activity, ActivityResult } from "../models/types";

interface TaskDraft {
  decision: string;
  rationale: string;
  openIssue: string;
  actionItem: string;
  note: string;
}

const emptyDraft: TaskDraft = {
  decision: "",
  rationale: "",
  openIssue: "",
  actionItem: "",
  note: "",
};

const sectionNames: Record<string, string> = {
  "doc-info": "문서 정보",
  overview: "프로젝트 개요",
  background: "배경 및 목적",
  scope: "수행 범위",
  governance: "추진 체계",
  raci: "역할과 책임",
  methodology: "수행 방법론",
  schedule: "일정 및 마일스톤",
  communication: "커뮤니케이션 계획",
  deliverables: "산출물 계획",
  acceptance: "승인 기준",
  environment: "환경 및 접근 계획",
  raid: "RAID/결정사항",
  transition: "전환 계획",
  quality: "품질 관리",
  "change-management": "변경 관리",
  appendix: "부록",
};

function fieldToString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function toDraft(fields: Record<string, unknown> | undefined): TaskDraft {
  if (!fields) return { ...emptyDraft };
  return {
    decision: fieldToString(fields["합의/결론"] ?? fields.decision),
    rationale: fieldToString(fields["판단 근거"] ?? fields.rationale),
    openIssue: fieldToString(fields["미결 사항/리스크"] ?? fields.openIssue),
    actionItem: fieldToString(fields["다음 액션"] ?? fields.actionItem),
    note: fieldToString(fields["추가 메모"] ?? fields.note),
  };
}

function toFields(draft: TaskDraft): Record<string, string> {
  return Object.fromEntries(
    [
      ["합의/결론", draft.decision],
      ["판단 근거", draft.rationale],
      ["미결 사항/리스크", draft.openIssue],
      ["다음 액션", draft.actionItem],
      ["추가 메모", draft.note],
    ].filter(([, value]) => value.trim().length > 0)
  );
}

function getRelevantDecisions(activity: Activity, taskIndex: number) {
  if (activity.decisions.length === 0) return [];
  const direct = activity.decisions[taskIndex];
  return direct ? [direct] : activity.decisions.slice(0, 2);
}

export default function ActivityFormPage() {
  const { projectId, activityId } = useParams<{
    projectId: string;
    activityId: string;
  }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [results, setResults] = useState<Record<string, ActivityResult>>({});
  const [drafts, setDrafts] = useState<Record<string, TaskDraft>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId || !activityId) return;
    Promise.all([getActivity(activityId), getActivityResults(activityId, projectId)])
      .then(([act, res]) => {
        setActivity(act);
        const byTask: Record<string, ActivityResult> = {};
        const draftByTask: Record<string, TaskDraft> = {};
        for (const r of res) {
          byTask[r.task_id] = r;
          draftByTask[r.task_id] = toDraft(r.fields);
        }
        setResults(byTask);
        setDrafts(draftByTask);
      })
      .catch((e) => setError(e.message));
  }, [projectId, activityId]);

  async function handleSave(taskId: string) {
    if (!projectId || !activityId) return;
    setError(null);
    try {
      const saved = await saveActivityResult(activityId, projectId, {
        task_id: taskId,
        fields: toFields(drafts[taskId] ?? emptyDraft),
        status: "saved",
      });
      setResults((prev) => ({ ...prev, [taskId]: saved }));
      setSavedMessage(`"${taskId}" 저장됨`);
      setTimeout(() => setSavedMessage(null), 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (error) return <Layout title="오류">{error}</Layout>;
  if (!activity) return <Layout title="로딩 중...">로딩 중...</Layout>;

  function updateDraft(taskId: string, field: keyof TaskDraft, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [taskId]: { ...(prev[taskId] ?? emptyDraft), [field]: value },
    }));
  }

  const textAreaStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    border: "1px solid #d0d5dd",
    borderRadius: 8,
    padding: "10px 12px",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1.5,
    resize: "vertical" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    color: "#344054",
  };

  const guideBoxStyle = {
    border: "1px solid #e4e7ec",
    borderRadius: 8,
    padding: 14,
    background: "#f9fafb",
  };

  return (
    <Layout title={`[${activity.code}] ${activity.title}`} projectId={projectId}>
      <section
        style={{
          border: "1px solid #d0d5dd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          background: "#fff",
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#175cd3" }}>Sprint0 Playbook</span>
          {activity.level && <span style={{ fontSize: 12, color: "#667085" }}>상태: {activity.level}</span>}
          {activity.template && <span style={{ fontSize: 12, color: "#667085" }}>템플릿: {activity.template}</span>}
        </div>
        <p style={{ color: "#344054", margin: "0 0 12px", lineHeight: 1.6 }}>
          {activity.purpose}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {activity.section_mapping.map((sectionId) => (
            <span
              key={sectionId}
              style={{
                border: "1px solid #d0d5dd",
                borderRadius: 999,
                padding: "4px 8px",
                fontSize: 12,
                color: "#344054",
                background: "#f9fafb",
              }}
            >
              수행계획서: {sectionNames[sectionId] ?? sectionId}
            </span>
          ))}
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={guideBoxStyle}>
          <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>진행 방법</h2>
          <ol style={{ margin: 0, paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
            {(activity.play?.length ? activity.play : ["관련 담당자와 합의 내용을 확인하고 수행계획서에 반영할 수 있는 수준으로 기록합니다."]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
        <div style={guideBoxStyle}>
          <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>준비 자료</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
            {activity.info.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={guideBoxStyle}>
          <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>완료 기준</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
            {activity.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {savedMessage && <p style={{ color: "#067647" }}>{savedMessage}</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {activity.tasks.map((task, taskIndex) => {
          const isSaved = Boolean(results[task.task_id]);
          const draft = drafts[task.task_id] ?? emptyDraft;
          const relevantDecisions = getRelevantDecisions(activity, taskIndex);
          return (
            <div
              key={task.task_id}
              style={{ border: "1px solid #d0d5dd", borderRadius: 8, padding: 16, background: "#fff" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>{task.title}</h3>
                  <p style={{ fontSize: 14, color: "#475467", margin: 0, lineHeight: 1.55 }}>
                    {task.description}
                  </p>
                </div>
                {isSaved && (
                  <span style={{ alignSelf: "flex-start", fontSize: 12, color: "#067647", fontWeight: 700 }}>
                    저장됨
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
                  gap: 16,
                }}
              >
                <aside style={{ ...guideBoxStyle, background: "#fcfcfd" }}>
                  <h4 style={{ fontSize: 13, margin: "0 0 8px" }}>입력 전에 확인할 것</h4>
                  <ul style={{ margin: "0 0 12px", paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
                    <li>고객과 수행사가 실제로 합의한 결론을 먼저 적습니다.</li>
                    <li>수행계획서에 그대로 들어가도 되는 표현으로 작성합니다.</li>
                    <li>미정 항목은 숨기지 말고 미결 사항 또는 리스크로 분리합니다.</li>
                  </ul>
                  {relevantDecisions.length > 0 && (
                    <>
                      <h4 style={{ fontSize: 13, margin: "0 0 8px" }}>관련 결정 포인트</h4>
                      <ul style={{ margin: 0, paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
                        {relevantDecisions.map((decision) => (
                          <li key={decision.title}>
                            <strong>{decision.title}</strong>: {decision.description}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </aside>

                <div style={{ display: "grid", gap: 12 }}>
                  <div>
                    <label style={labelStyle} htmlFor={`${task.task_id}-decision`}>
                      합의/결론
                    </label>
                    <textarea
                      id={`${task.task_id}-decision`}
                      rows={3}
                      style={textAreaStyle}
                      placeholder="예: Sprint는 2주 단위로 운영하며, Sprint Review는 고객 PO와 PM이 참석해 범위와 수락 기준을 확인한다."
                      value={draft.decision}
                      onChange={(e) => updateDraft(task.task_id, "decision", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor={`${task.task_id}-rationale`}>
                      판단 근거
                    </label>
                    <textarea
                      id={`${task.task_id}-rationale`}
                      rows={3}
                      style={textAreaStyle}
                      placeholder="예: 계약 범위, 고객 참여 가능 시간, 기존 보고 체계, 팀 규모 등을 기준으로 판단한다."
                      value={draft.rationale}
                      onChange={(e) => updateDraft(task.task_id, "rationale", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor={`${task.task_id}-openIssue`}>
                      미결 사항/리스크
                    </label>
                    <textarea
                      id={`${task.task_id}-openIssue`}
                      rows={2}
                      style={textAreaStyle}
                      placeholder="예: 고객 PO 지정이 미완료되어 Backlog 우선순위 확정이 지연될 수 있다."
                      value={draft.openIssue}
                      onChange={(e) => updateDraft(task.task_id, "openIssue", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor={`${task.task_id}-actionItem`}>
                      다음 액션
                    </label>
                    <textarea
                      id={`${task.task_id}-actionItem`}
                      rows={2}
                      style={textAreaStyle}
                      placeholder="예: 고객 PM이 6/21까지 PO 후보를 지정하고, PM이 RACI에 반영한다."
                      value={draft.actionItem}
                      onChange={(e) => updateDraft(task.task_id, "actionItem", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor={`${task.task_id}-note`}>
                      추가 메모
                    </label>
                    <textarea
                      id={`${task.task_id}-note`}
                      rows={2}
                      style={textAreaStyle}
                      placeholder="회의 중 나온 참고사항, 예외, 고객 요청사항을 남깁니다."
                      value={draft.note}
                      onChange={(e) => updateDraft(task.task_id, "note", e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleSave(task.task_id)}
                      style={{
                        border: 0,
                        borderRadius: 8,
                        padding: "9px 14px",
                        background: "#101828",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      이 Task 결과 저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section style={{ ...guideBoxStyle, marginTop: 20 }}>
        <h2 style={{ fontSize: 14, margin: "0 0 8px" }}>이 활동에서 만들어야 할 산출물</h2>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#475467", lineHeight: 1.55, fontSize: 13 }}>
          {activity.outputs.map((output) => (
            <li key={output.template_code}>
              <strong>{output.template_code}</strong>: {output.description}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
