import type { ExecutionPlanSectionId } from "../../models/types.js";

export class SectionMarkerNotFoundError extends Error {
  constructor(sectionId: string, markerType: "section" | "manual") {
    super(`Marker not found for ${markerType}:${sectionId} — 자동 갱신을 중단합니다.`);
    this.name = "SectionMarkerNotFoundError";
  }
}

function buildPattern(sectionId: string, kind: "section" | "manual"): RegExp {
  // start/end 마커 사이(마커 자체는 보존)를 캡처한다. 's' 플래그로 개행 포함 매칭.
  const start = `<!-- ${kind}:${sectionId}:start -->`;
  const end = `<!-- ${kind}:${sectionId}:end -->`;
  const escapedStart = start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedEnd = end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(${escapedStart})([\\s\\S]*?)(${escapedEnd})`);
}

export function hasSectionMarker(
  markdown: string,
  sectionId: ExecutionPlanSectionId
): boolean {
  return buildPattern(sectionId, "section").test(markdown);
}

export function extractSectionText(
  markdown: string,
  sectionId: ExecutionPlanSectionId,
  kind: "section" | "manual" = "section"
): string {
  const match = buildPattern(sectionId, kind).exec(markdown);
  if (!match) throw new SectionMarkerNotFoundError(sectionId, kind);
  return match[2].trim();
}

// section:{id} 마커 사이의 본문만 교체한다. manual 영역과 마커 자체는 절대 건드리지 않는다.
export function replaceSectionText(
  markdown: string,
  sectionId: ExecutionPlanSectionId,
  newText: string
): string {
  const pattern = buildPattern(sectionId, "section");
  if (!pattern.test(markdown)) {
    throw new SectionMarkerNotFoundError(sectionId, "section");
  }
  return markdown.replace(pattern, (_m, start, _body, end) => `${start}\n${newText}\n${end}`);
}
