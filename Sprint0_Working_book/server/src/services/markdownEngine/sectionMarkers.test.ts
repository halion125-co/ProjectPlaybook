import { describe, expect, it } from "vitest";
import {
  SectionMarkerNotFoundError,
  extractSectionText,
  hasSectionMarker,
  replaceSectionText,
} from "./sectionMarkers.js";

const SAMPLE = `# 제목

<!-- section:raci:start -->
_(placeholder)_
<!-- section:raci:end -->

<!-- manual:raci:start -->
사용자가 직접 쓴 비고
<!-- manual:raci:end -->

<!-- section:scope:start -->
기존 범위 텍스트
<!-- section:scope:end -->
`;

describe("hasSectionMarker", () => {
  it("마커가 있으면 true를 반환한다", () => {
    expect(hasSectionMarker(SAMPLE, "raci")).toBe(true);
  });

  it("마커가 없으면 false를 반환한다", () => {
    expect(hasSectionMarker(SAMPLE, "raid")).toBe(false);
  });
});

describe("extractSectionText", () => {
  it("section 마커 사이의 텍스트를 추출한다", () => {
    expect(extractSectionText(SAMPLE, "raci")).toBe("_(placeholder)_");
  });

  it("manual 마커 사이의 텍스트를 추출한다", () => {
    expect(extractSectionText(SAMPLE, "raci", "manual")).toBe("사용자가 직접 쓴 비고");
  });

  it("존재하지 않는 섹션이면 SectionMarkerNotFoundError를 던진다", () => {
    expect(() => extractSectionText(SAMPLE, "raid")).toThrow(SectionMarkerNotFoundError);
  });
});

describe("replaceSectionText", () => {
  it("지정한 section 영역만 교체하고 마커는 보존한다", () => {
    const result = replaceSectionText(SAMPLE, "raci", "새로 생성된 RACI 본문");

    expect(result).toContain("<!-- section:raci:start -->");
    expect(result).toContain("<!-- section:raci:end -->");
    expect(result).toContain("새로 생성된 RACI 본문");
    expect(result).not.toContain("_(placeholder)_");
  });

  it("manual 영역의 사용자 입력 텍스트는 절대 변경하지 않는다", () => {
    const result = replaceSectionText(SAMPLE, "raci", "새로 생성된 RACI 본문");

    expect(result).toContain("사용자가 직접 쓴 비고");
  });

  it("관련 없는 다른 섹션(scope)은 그대로 보존한다", () => {
    const result = replaceSectionText(SAMPLE, "raci", "새로 생성된 RACI 본문");

    expect(result).toContain("기존 범위 텍스트");
  });

  it("마커가 없는 섹션을 교체하려 하면 SectionMarkerNotFoundError를 던지고 원본을 바꾸지 않는다", () => {
    expect(() => replaceSectionText(SAMPLE, "raid", "x")).toThrow(
      SectionMarkerNotFoundError
    );
  });
});
