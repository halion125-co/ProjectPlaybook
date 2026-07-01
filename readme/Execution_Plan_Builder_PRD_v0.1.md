# Execution Plan Builder — PRD v0.1

> Sprint0 활동 결과를 구조화하여 누적하고, 그 결과를 바탕으로 `execution-plan.md` 수행계획서를 섹션 단위로 지속 업데이트하는 신규 시스템의 제품 요구사항 문서.

**문서 버전**: v0.1
**작성일**: 2026-06-19
**문서 상태**: Draft — 개발 착수 가능 수준
**작성 대상 저장소**: `d:\ProjectPlaybook`
**관련 문서**: [KT_Delivery_Way_PRD_v0.3.md](KT_Delivery_Way_PRD_v0.3.md), `Sprint0_Playbook/activity_data.json`

---

## 가정사항 (Assumptions)

질문 없이 PRD를 작성하기 위해 다음을 합리적으로 가정한다. 추후 확인이 필요하면 별도로 검증할 것.

| # | 가정 | 근거 |
|---|---|---|
| A1 | 신규 시스템은 기존 `Sprint0_Playbook/`, `requirement-playbook/`, `close-playbook/`, `index.html`, `kt-delivery-playbook.html` 등 기존 mock HTML을 **읽기 전용 참조**로만 사용하며, 파일을 일절 수정하지 않는다. | 명시적 제약 |
| A2 | 신규 시스템은 `d:\ProjectPlaybook` 루트에 **새 폴더**(예: `app/`)로 추가되며, 기존 정적 사이트와 같은 저장소에 공존한다. | "신규 시스템은 별도 구조" 요구 |
| A3 | MVP는 **단일 사용자, 로컬 실행** 환경을 우선한다. 다중 사용자 동시 편집, 인증/권한 분리는 MVP 범위에서 제외한다. | MVP 중심 설계 요청, 입력 폼 위주 워크플로우 |
| A4 | MVP의 AI 보완 기능은 **외부 LLM API 호출 없이도 동작**해야 한다 — 즉 "AI 프롬프트 생성"까지는 자동화하고, 실제 LLM 호출/응답 수신은 사용자가 외부 도구(ChatGPT 등)에 복사해 사용하거나, 키가 설정된 경우에만 API를 직접 호출하는 **선택적 기능**으로 둔다. | 로컬 우선, 외부 의존성 최소화, 보안/비용 리스크 회피 |
| A5 | 저장은 **로컬 파일 시스템 기반(JSON + Markdown)**으로 시작하며, DB는 향후 확장으로 분리한다. | 제약사항에 명시 |
| A6 | Sprint0 7개 Activity(`way-of-working`, `team-raci`, `communication-cadence`, `deliverable-acceptance`, `environment-access`, `readiness-raid`, `transition-day1`)와 `activity_data.json`의 task/output 구조를 **입력 스키마의 1차 기준**으로 채택한다. | 기존 mock 데이터 구조 확인됨 |
| A7 | "수행계획서"는 KT_Delivery_Way_PRD_v0.3의 사업수행계획서(BP) Chapter 체계(6, 10, 11, 13장 등)와 연결되나, 본 시스템은 KT Delivery Way 전체가 아니라 **Sprint0~착수 단계의 수행계획서 초안 생성**에 한정한다. PRB/ERP/KOS/TM 등 행정 Control 자동화는 Out of Scope. | "지금 가지고 있는 mock"의 범위가 Sprint0/요구사항/종료 플레이북이므로 |
| A8 | 사용자는 기술적으로 마크다운/JSON을 다룰 수 있는 PM/BA 수준이며, 별도 운영 교육 없이 로컬에서 `npm run dev` 등으로 실행 가능한 수준의 친숙도를 가진다. | 정적 mock을 직접 운영하는 현재 사용 패턴 |
| A9 | "프로젝트"는 1:1로 폴더 단위 작업공간을 가지며, 동시에 여러 프로젝트를 관리할 수 있어야 한다(포트폴리오 아님, 단순 멀티 워크스페이스). | "프로젝트별로 입력 데이터를 관리" 요구 |

---

## 1. 제품 개요

### 1.1 해결하려는 문제

현재 `ProjectPlaybook`의 Sprint0 Activity Playbook, 요구사항 플레이북, 종료 플레이북은 **정적 HTML로 구성된 가이드/체크리스트 mock**이다. 사용자가 화면을 보면서 어떤 Task를 수행해야 하는지는 알 수 있지만, 다음 문제가 남아 있다.

1. 사용자가 실제로 입력한 활동 결과(누가 참석했는지, 어떤 RACI를 합의했는지, 어떤 리스크가 식별됐는지 등)가 **어디에도 저장되지 않는다.** 화면은 안내만 하고 데이터를 받지 않는다.
2. Sprint0 7개 Activity, 요구사항 분류, 종료 체크리스트 등에서 나온 결과를 모아 **하나의 수행계획서로 정리하는 과정이 전부 수동**이다. 사용자가 직접 워드/한글 문서에 옮겨 적어야 한다.
3. 입력이 누적되지 않으므로, 프로젝트가 진행되며 같은 정보(고객명, 범위, RACI 등)를 **반복 입력**하게 된다.
4. 수행계획서를 한 번 작성한 �이후 내용이 바뀌면, 다시 전체 문서를 검토하거나 새로 작성해야 한다. **부분 갱신 메커니즘이 없다.**

### 1.2 제품의 목적

사용자가 Sprint0/착수 단계의 각 활동 결과를 폼에 입력하면, 그 입력이 **구조화된 데이터로 저장**되고, 이 데이터를 기반으로 `execution-plan.md`라는 수행계획서 초안이 **섹션 단위로 자동/반자동 갱신**되는 시스템을 만든다. 최종적으로 이 Markdown 파일은 별도 가공 없이 수행계획서 초안으로 바로 사용 가능해야 한다.

### 1.3 주요 사용자

- 프로젝트 착수 단계를 직접 운영하는 **딜리버리 PM / Sprint0 퍼실리테이터** (1차 사용자)
- 입력 내용을 검토하고 산출물 형식을 확인하는 **BA/컨설턴트**
- 완성된 수행계획서를 승인하는 **딜리버리 리드**

### 1.4 사용 시나리오 (요약)

> 상세 흐름은 [4. 핵심 사용자 흐름](#4-핵심-사용자-흐름) 참고.

PM이 신규 프로젝트를 시스템에 등록 → Sprint0 Activity(A1~A7) 중 하나를 선택해 입력 폼을 채움 → 저장 시 해당 활동에 매핑된 `execution-plan.md` 섹션이 갱신 후보로 표시됨 → PM이 AI 보완 제안(선택)을 검토 → 승인된 내용만 실제 Markdown 파일에 반영 → 모든 활동을 거치며 수행계획서가 점진적으로 완성됨.

### 1.5 기존 mock 시스템과 실제 시스템의 차이

| 구분 | 기존 mock (`Sprint0_Playbook/` 등) | 신규 시스템 (Execution Plan Builder) |
|---|---|---|
| 역할 | Task/산출물 안내, 읽기 전용 가이드 | 실제 입력을 받고 저장·문서화하는 작업 도구 |
| 데이터 | `activity_data.json`에 정적 콘텐츠만 존재 (사용자 입력 없음) | 프로젝트별 사용자 입력이 구조화되어 저장됨 |
| 출력 | 화면 표시만 | `execution-plan.md` 실제 파일 생성/갱신 |
| 갱신 방식 | 해당 없음(정적) | 섹션 단위 부분 갱신 + 변경 이력 |
| 수정 대상 | 코드 직접 수정 필요 | 코드 수정 없이 사용자가 매번 새 프로젝트/입력 처리 |
| AI 개입 | 없음 | 문장 정제, 누락 점검, 병합 제안 (사용자 승인 필요) |

### 1.6 최종 산출물의 정의

- **`execution-plan.md`**: 프로젝트별 1개 파일. 사람이 그대로 읽고 고객/내부 검토에 활용할 수 있는 수행계획서 초안. 마커 기반 섹션 구조를 가지며, 일부는 자동 생성, 일부는 사용자가 직접 작성한 영역으로 명확히 구분된다.
- **프로젝트 데이터 저장소**: 위 문서를 만들어낸 원천 데이터(JSON). 문서가 손상되거나 재생성이 필요할 때 기준이 된다.
- **변경 이력 로그**: 어떤 입력이 언제 어떤 섹션에 반영됐는지의 추적 기록.

---

## 2. 목표와 비목표

### 2.1 목표 (Goals)

- G1. Sprint0 7개 Activity 단위로 사용자 입력을 받는 폼을 제공하고, 입력값을 프로젝트별로 구조화 저장한다.
- G2. 프로젝트별 독립 작업공간(폴더)을 제공하여 여러 프로젝트를 동시에 관리할 수 있게 한다.
- G3. 저장된 입력을 기반으로 `execution-plan.md`를 생성하고, 이후 입력이 추가/수정될 때마다 **관련 섹션만** 갱신한다.
- G4. 입력 데이터를 재사용한다 — 동일 필드(고객명, 프로젝트 기간 등)를 여러 섹션/활동에서 다시 입력하지 않도록 한다.
- G5. 문서의 변경 이력을 남기고, 특정 시점으로 되돌아볼 수 있는 최소한의 버전 관리를 제공한다.
- G6. 섹션 단위 갱신 시 사용자의 수동 편집 영역을 보존한다.
- G7. 사용자가 검토·승인한 내용만 최종 수행계획서에 반영되는 흐름(승인 게이트)을 제공한다.
- G8. 최종 수행계획서를 다운로드/내보내기 형태로 제공한다.

### 2.2 비목표 (Non-Goals) — MVP 제외

- NG1. 다중 사용자 동시 편집, 권한/역할 기반 접근 제어(RBAC)
- NG2. 클라우드 동기화, 실시간 협업, 외부 인증(SSO 등)
- NG3. DB 서버 구축 — MVP는 파일 기반. DB는 향후 옵션으로만 설계에 반영
- NG4. KT Delivery Way의 PRB/ERP/KOS/TM 행정 Control 자동화 — 본 시스템은 Sprint0/착수 단계 문서화에 한정
- NG5. LLM API의 완전 자동 실행(사용자 승인 없는 자동 반영)
- NG6. 워드(.docx)/PPT 등 타 포맷 변환 — MVP는 Markdown만 지원
- NG7. 기존 mock HTML(`Sprint0_Playbook/*.html` 등)의 수정 또는 신규 시스템과의 자동 연동(임베드, iframe 등)
- NG8. 요구사항 플레이북·종료 플레이북의 입력 폼 — MVP는 Sprint0 착수 단계만. (향후 확장 항목으로 별도 명시)

---

## 3. 사용자 페르소나

### 3.1 프로젝트 매니저 (PM)

- **주요 책임**: 프로젝트 착수, Sprint0 진행, 수행계획서 작성/배포 책임
- **시스템 사용 목적**: Sprint0 활동을 진행하며 나온 결과를 빠르게 기록하고, 수행계획서 초안을 신속히 완성
- **주요 입력 정보**: 프로젝트 개요, 수행 범위, 일정, RACI, 커뮤니케이션 체계, 결정사항, Action Item
- **기대 산출물**: 고객에게 그대로 공유 가능한 수준의 `execution-plan.md` 초안

### 3.2 딜리버리 리드

- **주요 책임**: 여러 프로젝트의 착수 품질 관리, 수행계획서 최종 승인
- **시스템 사용 목적**: 수행계획서 초안을 검토하고 AI 보완 제안의 승인/거절을 결정
- **주요 입력 정보**: 산출물 승인 상태, 리스크 판단, 결정사항 확정
- **기대 산출물**: 승인 이력이 남은 최종 수행계획서, 변경 이력 리포트

### 3.3 BA 또는 컨설턴트

- **주요 책임**: 요구사항 정리, 업무 방식/RAID 등 세부 활동 입력 지원
- **시스템 사용 목적**: 본인이 담당하는 Activity(예: 요구사항 분류, RAID)의 결과를 구조화하여 입력
- **주요 입력 정보**: 요구사항 분류 결과, RAID 항목, 회의 결과
- **기대 산출물**: 해당 섹션이 정확히 반영된 수행계획서, 입력 누락에 대한 AI 점검 결과

### 3.4 고객 담당자

- **주요 책임**: 수행계획서 내용 확인 및 합의
- **시스템 사용 목적**: (MVP에서는 시스템 직접 사용자가 아님) 완성된 `execution-plan.md`를 전달받아 검토
- **주요 입력 정보**: 없음(MVP), 향후 버전에서 의견/승인 입력 가능성
- **기대 산출물**: 읽기 쉬운 최종 수행계획서 문서

### 3.5 품질/거버넌스 담당자

- **주요 책임**: 수행계획서가 표준 목차/품질 기준을 충족하는지 점검
- **시스템 사용 목적**: 누락 섹션, 미승인 상태 항목, 변경 이력의 정합성 확인
- **주요 입력 정보**: 없음(주로 조회), 필요 시 검토 코멘트
- **기대 산출물**: 누락/미승인 항목 리포트

---

## 4. 핵심 사용자 흐름

1. **프로젝트 생성**: 사용자가 새 프로젝트를 만들고 기본정보(프로젝트명, 고객사, 기간, PM)를 입력한다. 시스템은 `data/projects/{project-id}/` 폴더와 초기 `execution-plan.md` 템플릿을 생성한다.
2. **Sprint0 단계 선택**: 프로젝트 대시보드에서 A1~A7 중 진행할 Activity를 선택한다. 각 Activity 카드는 입력 완료율을 표시한다.
3. **활동별 입력**: 선택한 Activity의 입력 폼이 열린다. 폼 필드는 `activity_data.json`의 task 구조를 기반으로 자동 생성되며, 자유 텍스트/구조화 필드(표, 목록)를 혼합 지원한다.
4. **입력 결과 저장**: "저장" 시 `ActivityResult`로 구조화되어 JSON 파일에 기록된다. 저장 즉시 해당 Activity와 매핑된 `execution-plan.md` 섹션이 "갱신 대기" 상태로 표시된다.
5. **수행계획서 Markdown 미리보기**: 사용자는 현재까지 누적된 입력을 반영했을 때의 Markdown 미리보기를 확인할 수 있다(아직 파일에 쓰이지 않은 diff 형태).
6. **AI를 통한 문장 정제 또는 섹션 보완**: 사용자가 "AI 보완 요청" 버튼을 누르면, 시스템은 해당 섹션에 필요한 컨텍스트(활동 입력, 기존 섹션 텍스트, 템플릿 가이드)를 모아 프롬프트를 구성한다. (A4 가정에 따라) API 키가 설정되어 있으면 즉시 호출 결과를 받고, 없으면 프롬프트와 입력 결과를 클립보드/파일로 내보내 외부 LLM에 붙여넣어 쓸 수 있게 한다.
7. **사용자의 검토 및 승인**: AI 제안은 "제안됨" 상태로만 존재한다. 사용자는 좌우 비교(현재 텍스트 vs 제안 텍스트)를 보고 승인/수정/거절을 선택한다.
8. **Markdown 파일 섹션 업데이트**: 승인된 내용만 해당 섹션 마커 사이에 반영되어 `execution-plan.md`가 갱신된다. 사용자의 수동 편집 영역(별도 마커로 보호됨)은 건드리지 않는다. 갱신 시점에 백업이 생성되고 변경 이력에 기록된다.
9. **최종 수행계획서 다운로드 또는 저장**: 사용자는 언제든 현재 `execution-plan.md`를 다운로드하거나, 로컬 경로(`output/`)에서 직접 확인할 수 있다.

---

## 5. 기능 요구사항

| 기능명 | 설명 | 사용자 가치 | 입력값 | 출력값 | 우선순위 | 수용 기준 |
|---|---|---|---|---|---|---|
| 프로젝트별 작업 공간 | 프로젝트 생성/조회/전환. 프로젝트마다 독립된 데이터 폴더 보유 | 여러 프로젝트를 혼선 없이 관리 | 프로젝트명, 고객사, 기간, PM | `data/projects/{id}/project.json` | Must | 사용자는 새 프로젝트를 생성하고, 프로젝트 목록에서 전환할 수 있다 |
| 단계 및 활동 관리 | Sprint0 A1~A7 Activity 목록과 진행 상태(미시작/진행중/완료) 표시 | 무엇을 입력해야 하는지 한눈에 파악 | 없음(activity_data.json 기준 자동 생성) | Activity 상태 보드 | Must | 7개 Activity 모두 상태가 표시되고 클릭 시 입력 폼으로 이동한다 |
| 활동별 입력 폼 | Activity의 Task 구조 기반 동적 폼 | 가이드를 보면서 바로 결과를 기록 | 텍스트, 표, 목록, 날짜, 담당자 등 | `ActivityResult` (미저장 상태) | Must | 각 Activity의 모든 Task 항목에 대한 입력 필드가 존재한다 |
| 활동 결과 저장 | 입력값을 구조화 데이터로 영속화 | 입력 손실 방지, 이후 재사용 가능 | 폼 데이터 | `activity-results/{activityId}.json` | Must | 저장 후 새로고침해도 입력값이 유지된다 |
| Markdown 문서 생성 | 신규 프로젝트 시 표준 목차의 `execution-plan.md` 초기 생성 | 빈 문서 작성 부담 제거 | 표준 템플릿 | `output/execution-plan.md` | Must | 프로젝트 생성 즉시 목차가 채워진 빈 문서가 존재한다 |
| 기존 Markdown 문서 갱신 | 활동 입력 변경 시 관련 섹션 재작성 | 매번 전체 문서를 다시 쓰지 않음 | ActivityResult, 섹션 매핑 | 갱신된 `execution-plan.md` | Must | 한 Activity만 수정해도 다른 섹션 텍스트가 보존된다 |
| 섹션별 업데이트 | 마커(`<!-- section:id:start/end -->`) 기준으로 특정 섹션만 교체 | 문서 일부 파손/덮어쓰기 방지 | 섹션 id, 신규 본문 | 해당 섹션만 변경된 파일 | Must | 마커 밖 텍스트(수동 편집 영역)는 절대 변경되지 않는다 |
| 변경 이력 관리 | 섹션 갱신 시마다 변경 전/후, 시각, 트리거 입력을 기록 | 누가 언제 무엇을 바꿨는지 추적 | 갱신 이벤트 | `change-history.json`, 백업 파일 | Must | 임의 시점의 이력을 조회하고 이전 버전 내용을 볼 수 있다 |
| AI 문서 보완 요청 | 섹션 텍스트 정제/병합/누락 점검 프롬프트 생성 및(옵션) 호출 | 문장화 부담 감소, 품질 표준화 | ActivityResult + 기존 섹션 + 템플릿 가이드 | 프롬프트 텍스트 + (옵션)AI 응답 | Should | 버튼 클릭 시 프롬프트가 생성되고 복사 가능하다 |
| AI 결과 검토 및 승인 | AI 제안을 승인/수정/거절 | 부정확한 내용이 무단 반영되는 것 방지 | AI 제안 텍스트 | 승인 상태(approved/rejected/edited) | Must | 승인 전까지 AI 제안은 Markdown 파일에 반영되지 않는다 |
| Markdown 미리보기 | 현재 누적 데이터 기준 렌더링 미리보기 | 실제 반영 전 결과 확인 | 현재 데이터 상태 | HTML 렌더링 뷰 | Must | 저장된 입력을 변경하면 미리보기가 갱신된다 |
| 수동 편집 가능 영역 | 사용자가 자유롭게 쓰는 보호 섹션 | 시스템이 다루지 않는 내용도 문서에 포함 가능 | 사용자 직접 입력 | 보호된 Markdown 블록 | Must | 자동 갱신 로직이 이 영역의 텍스트를 변경하지 않는다 |
| 산출물 승인 상태 관리 | Artifact 단위로 검토중/승인/반려 상태 추적 | 어떤 산출물이 최종 확정됐는지 파악 | 산출물명, 상태, 승인자 | `Approval` 레코드 | Should | 산출물 목록에서 상태별 필터링이 가능하다 |
| TODO/Action Item 관리 | 회의/활동에서 도출된 후속 조치 추적 | 누락 방지 | 항목, 담당자, 기한, 상태 | `ActionItem` 목록, 수행계획서 부록 반영 | Should | 완료되지 않은 Action Item이 목록에 남아 있다 |
| RAID 관리 | Risk/Assumption/Issue/Dependency 등록·갱신 | 리스크 가시화 | 유형, 설명, 영향도, 대응안 | `RAIDItem` 목록, 해당 섹션 반영 | Should | RAID 항목 추가 시 관련 섹션에 반영 후보로 표시된다 |
| 결정사항 로그 | 회의/논의에서 확정된 결정 기록 | 결정 배경의 추적성 확보 | 결정 내용, 일자, 결정자, 배경 | `DecisionLog` 목록 | Should | 결정사항은 시간순으로 조회 가능하다 |
| 최종 수행계획서 export | 현재 `execution-plan.md`를 다운로드 | 외부 공유 용이 | 없음(현재 파일 상태) | `.md` 파일 다운로드 | Must | 클릭 시 현재 파일이 그대로 다운로드된다 |

---

## 6. Markdown 수행계획서 구조

`execution-plan.md` 권장 목차. 각 섹션은 고유 ID를 가지며 마커로 식별된다.

| 섹션 ID | 목차 | 섹션 목적 | 입력 데이터 | 연결 Sprint0 활동 | AI 보완 | 사용자 검토 필수 |
|---|---|---|---|---|---|---|
| `doc-info` | 문서 정보 | 문서 버전, 작성일, 작성자, 상태 | Project 메타데이터 | - | 아니오(자동) | 아니오 |
| `overview` | 프로젝트 개요 | 사업명, 기간, 고객, 목적 요약 | Project, Sprint0 Core(Project Brief) | Core(계약·제안 정보, Brief) | 가능 | 예 |
| `background` | 배경 및 목적 | 추진 배경, 고객 기대성과, 성공 기준 | Sprint0 Core | Core | 가능 | 예 |
| `scope` | 수행 범위 | Scope In/Out, 가정/제약사항 | Sprint0 Core(Scope 기준선) | Core | 가능 | 예 |
| `governance` | 추진 체계 | 거버넌스 구조, 의사결정 라인 | A2 입력 + 고객 이해관계자 정보 | A2 team-raci | 가능 | 예 |
| `raci` | 역할과 책임 | RACI 매트릭스 | A2 입력 | A2 team-raci | 가능 | 예 |
| `methodology` | 수행 방법론 | AXD/Hybrid 적용 방식, WoW, DoR/DoD | A1 입력 | A1 way-of-working | 가능 | 예 |
| `schedule` | 일정 및 마일스톤 | Sprint0 일정 + 주요 마일스톤 | Sprint0 Core(Sprint0Plan) | Core | 부분 가능 | 예 |
| `communication` | 커뮤니케이션 계획 | 회의체, 주기, 채널 | A3 입력 | A3 communication-cadence | 가능 | 예 |
| `deliverables` | 산출물 계획 | 산출물 목록, 작성 책임, 일정 | A4 입력 | A4 deliverable-acceptance | 가능 | 예 |
| `acceptance` | 승인 기준 | 산출물 검토/승인 절차, 기준 | A4 입력 | A4 deliverable-acceptance | 가능 | 예 |
| `environment` | 환경 및 접근 계획 | 환경/도구/접근권한 준비 상태 | A5 입력 | A5 environment-access | 부분 가능 | 예 |
| `raid` | 리스크/이슈/의존성/결정사항 | RAID 항목, 결정사항 로그 | A6 입력 + RAIDItem + DecisionLog | A6 readiness-raid | 가능 | 예 |
| `transition` | 전환 계획 | Day-1 준비, 오픈/전환 고려사항 | A7 입력 | A7 transition-day1 | 가능 | 예 |
| `quality` | 품질 관리 계획 | 품질 점검 기준, 검토 프로세스 | A4 입력 일부 | A4 | 부분 가능 | 예 |
| `change-management` | 변경 관리 | 변경 요청 처리 절차 | A1 입력 일부 | A1 | 부분 가능 | 예 |
| `appendix` | 부록 | Open Item, Action Item 목록, 용어 | ActionItem, Open Item | Core, 전체 | 아니오(목록 자동 삽입) | 아니오 |

각 섹션은 다음 두 영역으로 구분된다.

```markdown
<!-- section:scope:start -->
(시스템이 자동/AI 보완으로 갱신하는 영역)
<!-- section:scope:end -->

<!-- manual:scope:start -->
(사용자가 자유롭게 추가 작성하는 영역 — 시스템이 절대 덮어쓰지 않음)
<!-- manual:scope:end -->
```

---

## 7. 데이터 모델

저장 포맷: 프로젝트별 디렉터리 내 JSON 파일(MVP). 아래는 각 엔티티의 필드 정의다.

### 7.1 Project

- **목적**: 작업공간의 최상위 단위
- **주요 필드**: `project_id`, `name`, `customer`, `pm`, `start_date`, `end_date`, `created_at`, `updated_at`
- **관계**: 1 Project → N Phase, 1 Project → 1 ExecutionPlan
- **예시**:
```json
{ "project_id": "PJT-2026-001", "name": "AI 상담 자동화 구축", "customer": "고객사A", "pm": "홍길동", "start_date": "2026-06-01", "end_date": "2026-12-31" }
```

### 7.2 Phase

- **목적**: Sprint0 등 상위 단계 구분 (MVP는 Sprint0 단일 Phase만 사용)
- **주요 필드**: `phase_id`, `project_id`, `name`, `order`
- **관계**: 1 Phase → N Activity
- **예시**: `{ "phase_id": "sprint0", "project_id": "PJT-2026-001", "name": "Sprint 0", "order": 1 }`

### 7.3 Activity

- **목적**: `activity_data.json` 기반 A1~A7 활동 정의 (콘텐츠는 기존 mock 참조, 신규 시스템은 이를 읽기 전용으로 로드)
- **주요 필드**: `activity_id`(`way-of-working` 등), `code`(`A1`), `title`, `tasks[]`, `outputs[]`, `section_mapping[]`
- **관계**: 1 Activity → N ActivityResult(시간순 누적), N ExecutionPlanSection과 매핑
- **예시**: `{ "activity_id": "team-raci", "code": "A2", "title": "수행팀 투입 및 책임 정렬", "section_mapping": ["governance", "raci"] }`

### 7.4 ActivityResult

- **목적**: 사용자가 실제 입력한 활동 결과
- **주요 필드**: `result_id`, `project_id`, `activity_id`, `task_id`, `fields`(자유 구조 JSON), `status`(draft/saved), `created_by`, `created_at`, `updated_at`
- **관계**: N:1 Activity, 1:N ExecutionPlanSection 갱신 트리거
- **예시**:
```json
{ "result_id": "res-0007", "project_id": "PJT-2026-001", "activity_id": "team-raci", "task_id": "raci-matrix", "fields": { "members": [{"name":"홍길동","role":"PM","raci":"A"}] }, "status": "saved" }
```

### 7.5 ExecutionPlan

- **목적**: 프로젝트의 수행계획서 Markdown 문서 메타 정보
- **주요 필드**: `plan_id`, `project_id`, `file_path`, `version`, `last_generated_at`
- **관계**: 1:1 Project, 1:N ExecutionPlanSection
- **예시**: `{ "plan_id": "plan-PJT-2026-001", "project_id": "PJT-2026-001", "file_path": "output/execution-plan.md", "version": 12 }`

### 7.6 ExecutionPlanSection

- **목적**: 목차의 각 섹션 상태와 현재 텍스트 추적
- **주요 필드**: `section_id`(`scope` 등), `plan_id`, `current_text`, `source_result_ids[]`, `last_updated_at`, `update_status`(synced/pending/conflict)
- **관계**: N:1 ExecutionPlan, N:N ActivityResult(traceability)
- **예시**: `{ "section_id": "raci", "plan_id": "plan-PJT-2026-001", "source_result_ids": ["res-0007"], "update_status": "pending" }`

### 7.7 DecisionLog

- **목적**: 확정된 의사결정 기록
- **주요 필드**: `decision_id`, `project_id`, `title`, `description`, `decided_by`, `decided_at`, `related_section_id`
- **관계**: N:1 Project, 0:1 ExecutionPlanSection
- **예시**: `{ "decision_id": "dec-003", "title": "MVP 범위에서 모바일 앱 제외", "decided_by": "딜리버리리드", "decided_at": "2026-06-10" }`

### 7.8 RAIDItem

- **목적**: 리스크/가정/이슈/의존성 관리
- **주요 필드**: `raid_id`, `project_id`, `type`(risk/assumption/issue/dependency), `description`, `impact`, `owner`, `status`, `mitigation`
- **관계**: N:1 Project, 영향받는 ExecutionPlanSection(`raid`)
- **예시**: `{ "raid_id": "raid-011", "type": "risk", "description": "고객 환경 접근권한 지연", "impact": "High", "status": "open" }`

### 7.9 ActionItem

- **목적**: TODO/후속조치 추적
- **주요 필드**: `action_id`, `project_id`, `title`, `owner`, `due_date`, `status`(open/in-progress/done), `source_activity_id`
- **관계**: N:1 Project, N:1 Activity(선택)
- **예시**: `{ "action_id": "act-022", "title": "VPN 접근권한 신청", "owner": "홍길동", "due_date": "2026-06-25", "status": "open" }`

### 7.10 Artifact

- **목적**: 산출물 목록과 메타 정보
- **주요 필드**: `artifact_id`, `project_id`, `name`, `template_ref`(`02_Sprint0Plan` 등), `file_link`, `status`
- **관계**: N:1 Project, 0:1 Approval
- **예시**: `{ "artifact_id": "art-002", "name": "Sprint0 수행계획", "template_ref": "02_Sprint0Plan", "status": "draft" }`

### 7.11 Approval

- **목적**: 산출물/섹션의 승인 상태 추적
- **주요 필드**: `approval_id`, `target_type`(artifact/section/ai_suggestion), `target_id`, `approver`, `decision`(approved/rejected), `decided_at`, `comment`
- **관계**: N:1 Artifact 또는 ExecutionPlanSection
- **예시**: `{ "approval_id": "appr-014", "target_type": "ai_suggestion", "target_id": "suggestion-009", "decision": "approved" }`

### 7.12 ChangeHistory

- **목적**: 모든 섹션 갱신 이벤트의 변경 전/후 추적
- **주요 필드**: `change_id`, `project_id`, `section_id`, `before_text`, `after_text`, `triggered_by`(result_id 또는 approval_id), `changed_at`, `backup_file`
- **관계**: N:1 ExecutionPlanSection
- **예시**: `{ "change_id": "chg-101", "section_id": "raci", "triggered_by": "appr-014", "changed_at": "2026-06-19T10:00:00+09:00", "backup_file": "backups/execution-plan.v11.md" }`

---

## 8. AI 기능 요구사항

### 8.1 호출 시점

- 사용자가 Activity 입력을 저장한 직후 (선택적, 자동 트리거 아님 — 사용자가 명시적으로 "AI 보완 요청" 클릭)
- 사용자가 미리보기 화면에서 특정 섹션의 "문장 정제" 버튼 클릭 시
- 사용자가 전체 누락 점검("이 프로젝트에 빠진 입력이 있는지 확인해줘")을 요청할 때

### 8.2 AI에게 전달되는 입력 컨텍스트

- 대상 섹션 ID와 섹션 목적 설명 (6장 표 기준)
- 해당 섹션에 매핑된 ActivityResult 전체(원문 입력값)
- 현재 섹션의 기존 텍스트(있는 경우, 병합 대상)
- 문서 전체 톤/형식 가이드(공식 수행계획서 톤)
- 수동 편집 영역 텍스트는 **컨텍스트로 전달하지 않음** (덮어쓰기 대상이 아니므로)

### 8.3 AI가 반환해야 하는 출력 형식

```json
{
  "section_id": "raci",
  "suggested_text": "...(Markdown 본문)...",
  "change_summary": "팀 구성원 3명의 RACI를 표 형식으로 정리하고 기존 텍스트와 병합함",
  "missing_inputs": ["고객측 Accountable 담당자 미입력"],
  "clarifying_questions": ["고객측 의사결정자는 누구인가요?"]
}
```

### 8.4 사용자가 검토하고 승인하는 방식

- 좌(현재 텍스트) / 우(AI 제안) 비교 뷰 제공
- 승인(그대로 반영) / 수정 후 승인(텍스트 편집 가능) / 거절(반영 안 함) 3가지 액션
- `missing_inputs`, `clarifying_questions`는 별도 알림으로 표시하고 ActionItem으로 전환 제안

### 8.5 AI 결과가 Markdown에 반영되는 방식

- 승인된 `suggested_text`만 해당 섹션 마커(`section:{id}:start`~`end`) 사이를 교체
- 반영 시 `ChangeHistory` 레코드 생성 및 백업 파일 생성
- `ExecutionPlanSection.update_status`를 `synced`로 변경

### 8.6 AI가 직접 덮어쓰면 안 되는 영역

- `manual:{id}:start`~`end` 마커 내부 전체
- `doc-info`, `appendix`의 자동 목록 영역(ActionItem/Open Item은 시스템이 직접 생성, AI 자유 생성 금지)
- 사용자가 아직 승인하지 않은 다른 섹션

### 8.7 AI 응답 실패 또는 품질 저하 시 대체 흐름

- API 호출 실패/타임아웃: 사용자에게 실패를 알리고, 원본 ActivityResult를 그대로 보여주는 "수동 정리 모드"로 전환(사용자가 직접 텍스트 작성)
- API 키 미설정(A4 가정): 프롬프트와 컨텍스트를 텍스트 파일로 내보내기(export) 기능 제공 — 사용자가 외부 LLM에 붙여넣고 결과를 다시 붙여넣어 동일한 승인 흐름을 타도록 함
- 명백히 품질이 낮은 응답(빈 문자열, 컨텍스트와 무관한 응답): 승인 화면에서 "재시도" 옵션 제공, 자동 반영은 절대 하지 않음

---

## 9. Markdown 섹션 업데이트 방식

### 9.1 전체 덮어쓰기 방식의 문제점

- 사용자가 수동으로 추가한 문장이나 고객 피드백 반영분이 모두 사라짐
- 한 Activity만 갱신해도 전체 문서를 재생성해야 하므로 다른 섹션의 미세 조정 내용이 손실됨
- 변경 범위를 특정할 수 없어 리뷰가 어려움(diff가 전체 문서 단위가 됨)

### 9.2 섹션 단위 업데이트 방식

- Markdown 파일 내 HTML 주석 마커로 섹션 경계를 식별: `<!-- section:{id}:start -->` / `<!-- section:{id}:end -->`
- 갱신 로직은 파일을 파싱해 마커 위치를 찾고, 해당 구간의 텍스트만 치환한다. 마커 자체는 보존한다.
- 마커가 손상되었거나 찾을 수 없는 경우, 자동 갱신을 중단하고 사용자에게 수동 확인을 요청한다(자동 복구 시도 금지 — 데이터 손실 위험).

### 9.3 사용자 수동 편집 영역 보호 방식

- `<!-- manual:{id}:start -->` / `<!-- manual:{id}:end -->` 마커로 구분된 영역은 모든 자동 갱신 로직에서 **읽기만 하고 쓰지 않음**
- 신규 섹션 생성 시 기본적으로 `section` 블록 아래 빈 `manual` 블록을 함께 생성하여 사용자가 자유롭게 채울 공간을 항상 제공

### 9.4 변경 전후 diff 확인 방식

- 섹션 갱신 적용 전, 현재 텍스트와 제안 텍스트의 라인 단위 diff를 화면에 표시(예: 추가/삭제 하이라이트)
- 사용자는 diff를 확인한 뒤에만 "반영" 버튼을 누를 수 있음(승인 없이 반영 버튼 비활성화)

### 9.5 입력 데이터와 문서 섹션 간 traceability 관리 방식

- `ExecutionPlanSection.source_result_ids[]`에 해당 섹션을 만든 모든 `ActivityResult.result_id`를 기록
- 문서 미리보기 화면에서 섹션을 클릭하면 "이 섹션은 어떤 입력에서 생성되었는지" 역추적 가능
- `ChangeHistory.triggered_by`에 갱신을 유발한 result_id 또는 approval_id 기록

### 9.6 버전 백업 또는 변경 이력 저장 방식

- 섹션 갱신이 실제 파일에 반영될 때마다 `backups/execution-plan.v{N}.md` 형태로 전체 파일 스냅샷 저장
- `ChangeHistory`에 섹션별 변경 레코드 별도 저장(스냅샷보다 세밀한 단위)
- 최소 최근 20개 버전 보관(MVP), 이후 버전은 압축 보관 또는 삭제 정책은 향후 결정

---

## 10. 시스템 아키텍처 제안

| 대안 | 장점 | 단점 | MVP 적합성 | 향후 확장성 |
|---|---|---|---|---|
| 정적 HTML 확장 | 기존 스택과 동일, 학습 비용 없음 | 상태 저장/파일 쓰기 불가(브라우저 단독으로는 로컬 파일 시스템 쓰기 제약), 구조화된 데이터 관리 어려움 | 낮음 | 낮음 |
| Vanilla JS 기반 로컬 앱(+ 간단한 로컬 서버) | 가볍고 빠르게 구현, 기존 mock과 기술적 친화성 높음 | 폼/상태 관리, diff 뷰 등 복잡 기능 구현 시 코드량 급증 | 중간 | 중간 — 후에 SPA로 이행 필요 |
| React/Vite 기반 SPA | 폼/상태/미리보기/diff UI 구현이 표준화되어 있고 생산성 높음, 컴포넌트 재사용 용이 | 초기 셋업 비용, 기존 mock과 기술 스택 분리(단, 이미 분리가 목표이므로 단점 아님) | 높음 | 높음 |
| Node.js 백엔드 포함 구조 | 파일 시스템 쓰기, Markdown 파싱/갱신 로직을 서버에서 안전하게 처리, 향후 API/DB 확장이 자연스러움 | 로컬 서버 프로세스 관리 필요(다만 `npm run dev` 수준으로 충분) | 높음 | 높음 |
| 파일 기반 Markdown 저장 구조 | 구현 단순, Git으로 버전 추적 가능, 사람이 직접 열어볼 수 있음 | 동시 편집/락 관리 없음, 대량 프로젝트 시 성능 저하 가능 | 높음 | 중간 — DB 마이그레이션 경로 필요 |
| 데이터베이스 기반 저장 구조 | 동시성, 쿼리, 다중 사용자 대응에 유리 | MVP에 과한 인프라, 로컬 우선 요구와 충돌 | 낮음 | 높음 |

### 권장 MVP 구조

**React/Vite 기반 SPA + 경량 Node.js(Express) 로컬 서버 + 파일 기반(JSON+Markdown) 저장**을 추천한다.

- 이유 1: 파일 시스템 쓰기(Markdown 갱신, 백업 생성)는 브라우저 단독으로 안전하게 처리하기 어렵다 — 로컬 Node 서버가 필요하다.
- 이유 2: React SPA는 동적 폼 생성, diff 뷰, 미리보기 렌더링 같은 MVP의 핵심 UI 요구를 가장 적은 코드로 구현할 수 있다.
- 이유 3: 파일 기반 저장은 "기존 mock 미수정 + 신규 시스템 분리" 제약과 "로컬 우선, DB는 향후 확장" 요구에 정확히 부합하며, Git으로 자연스럽게 버전 이력을 보조할 수 있다.
- 이유 4: 향후 DB 전환 시 Node 서버의 저장 계층(repository)만 교체하면 되므로, 프런트엔드/AI 연동 로직을 재작성할 필요가 없다.

---

## 11. 파일 및 폴더 구조 제안

기존 mock(`index.html`, `kt-delivery-playbook.html`, `Sprint0_Playbook/`, `requirement-playbook/`, `close-playbook/`, `src/`, `docs/`, `readme/`)과 완전히 분리된 신규 폴더를 루트에 추가한다.

```text
ProjectPlaybook/                  (기존 mock — 수정하지 않음)
  index.html
  kt-delivery-playbook.html
  Sprint0_Playbook/
  requirement-playbook/
  close-playbook/
  src/
  docs/
  readme/

Sprint0_Working_book/             (신규 시스템 — 완전 분리)
  client/                         (React/Vite SPA)
    src/
      components/                 (폼, diff뷰, 미리보기 등 UI 컴포넌트)
      pages/                      (프로젝트 목록, 프로젝트 대시보드, Activity 입력, 미리보기)
      services/                   (서버 API 클라이언트)
      models/                     (TS 타입: Project, ActivityResult 등)
  server/                         (Node.js/Express)
    src/
      routes/                     (REST API: projects, activities, sections, ai)
      services/
        markdownEngine/           (섹션 파싱·마커 치환·diff 생성 로직)
        aiPromptBuilder/          (AI 컨텍스트 조립, 프롬프트 템플릿)
      repositories/               (파일 기반 저장 접근 계층 — 추후 DB로 교체 가능한 인터페이스)
    templates/
      execution-plan.template.md  (Markdown 템플릿, 섹션 마커 포함)
      activity-schema/            (activity_data.json을 변환한 입력 폼 스키마, 기존 mock 참조용 읽기 전용 캐시)
    prompts/                      (AI 프롬프트 템플릿, 섹션별)
  data/
    projects/
      {project_id}/
        project.json
        activity-results/
          {activity_id}.json
        raid.json
        decisions.json
        action-items.json
        approvals.json
        change-history.json
  output/
    projects/
      {project_id}/
        execution-plan.md
        backups/
          execution-plan.v1.md
          execution-plan.v2.md
  docs/                           (신규 시스템 자체 문서 — PRD, 설계 문서)
  tests/
    fixtures/                     (테스트용 더미 프로젝트/입력 데이터)
```

| 항목 | 위치 |
|---|---|
| 입력 원천 데이터 | `data/projects/{id}/activity-results/*.json` |
| 프로젝트별 데이터 | `data/projects/{id}/` 전체 |
| Markdown 템플릿 | `server/templates/execution-plan.template.md` |
| 생성된 수행계획서 | `output/projects/{id}/execution-plan.md` |
| AI 프롬프트 | `server/prompts/{section_id}.prompt.md` |
| 변경 이력 | `data/projects/{id}/change-history.json` + `output/projects/{id}/backups/` |
| 테스트 데이터 | `tests/fixtures/` |

---

## 12. MVP 범위

### MVP에 반드시 포함

- 프로젝트 생성/목록/전환
- Sprint0 A1~A7 활동 결과 입력 폼 (activity_data.json 기반 동적 생성)
- 입력 결과 저장(JSON 영속화)
- 수행계획서 Markdown 초기 생성(표준 목차 + 빈 manual 블록)
- 기존 Markdown의 섹션별 갱신(마커 기반 부분 교체)
- Markdown 미리보기(렌더링 + diff)
- AI 보완 요청용 프롬프트 생성(컨텍스트 자동 조립)
- AI 결과 수동 반영 또는 승인 후 반영(승인 게이트, API 호출은 선택 기능)
- 변경 이력 저장 및 조회(섹션별 + 파일 스냅샷)
- RAID/DecisionLog/ActionItem 최소 CRUD (입력 후 해당 섹션/부록에 반영 후보로 노출)
- 최종 수행계획서 다운로드

### 향후 버전(v2+)으로 이동

- 요구사항 플레이북·종료 플레이북 활동의 입력 폼 통합(현재는 Sprint0만)
- LLM API 완전 자동 연동(키 관리 UI, 다중 모델 지원)
- 다중 사용자 동시 편집, 권한 분리(RBAC)
- DB 기반 저장으로 전환(PostgreSQL 등), 클라우드 동기화
- 산출물 파일 업로드/첨부 관리(Artifact 실제 파일 보관)
- 고객 담당자용 읽기 전용 공유 링크
- .docx/PPT 등 타 포맷 export
- 프로젝트 간 템플릿/입력값 재사용(유사 프로젝트 복제)
- 알림/리마인더(ActionItem 기한 임박 알림)
- 품질/거버넌스 담당자용 별도 점검 대시보드

---

## 13. 수용 기준

- 사용자는 프로젝트를 생성할 수 있고, 생성 즉시 표준 목차의 `execution-plan.md`가 만들어진다.
- 사용자는 Sprint0 A1~A7 각 활동 결과를 폼을 통해 입력하고 저장할 수 있다.
- 입력 결과는 구조화된 JSON으로 저장되며, 새로고침 후에도 유지된다.
- 저장된 결과는 6장에서 정의한 섹션 매핑에 따라 수행계획서의 올바른 섹션에 갱신 후보로 표시된다.
- 기존 수행계획서가 있을 경우, 전체 덮어쓰기가 아니라 변경된 Activity와 매핑된 섹션만 갱신된다.
- 사용자는 섹션 갱신 전, 변경 전/후 텍스트의 diff를 확인할 수 있다.
- 사용자는 AI가 제안한 문구를 승인, 수정 후 승인, 또는 거절할 수 있다.
- 승인된 AI 결과만 실제 `execution-plan.md` 파일에 반영된다. 거절된 제안은 파일에 어떤 형태로도 남지 않는다.
- 사용자가 manual 마커 안에 직접 작성한 텍스트는 어떤 자동 갱신 작업으로도 변경되지 않는다.
- 모든 섹션 갱신은 `ChangeHistory`에 기록되고, 파일 스냅샷 백업이 생성된다.
- 최종 `execution-plan.md`는 시스템 밖에서 단독으로 열어도 완결된 문서로 읽힌다(마커 주석은 가독성을 해치지 않는 수준이어야 함).
- 기존 mock 폴더(`Sprint0_Playbook/`, `requirement-playbook/`, `close-playbook/`, `index.html`, `kt-delivery-playbook.html`, `src/`)의 파일은 본 시스템 개발 과정에서 일절 수정되지 않는다.

---

## 14. 리스크와 고려사항

| 리스크 | 설명 | 대응 방향 |
|---|---|---|
| AI 부정확 생성 | AI가 입력 맥락과 다른 내용을 만들어 문서 품질을 해칠 수 있음 | 승인 게이트를 필수로 강제, AI 출력에 `missing_inputs`/`clarifying_questions`를 함께 받아 불확실성을 사용자에게 노출 |
| 기존 문서 덮어쓰기 | 섹션 마커 파싱 실패 시 의도치 않게 전체 또는 다른 섹션이 손상될 위험 | 마커 파싱 실패 시 자동 갱신 중단 + 사용자 알림, 매 갱신 전 전체 파일 백업 필수화 |
| 입력 데이터와 문서 간 불일치 | 입력은 변경됐지만 문서에는 미반영된 상태(pending)가 누적될 수 있음 | `ExecutionPlanSection.update_status`로 pending 항목을 대시보드에 항상 노출 |
| 버전 관리 필요성 | 여러 차례 갱신 후 특정 시점 내용을 다시 봐야 할 수 있음 | 섹션 단위 ChangeHistory + 파일 스냅샷 백업으로 최소한의 시점 복원 지원 |
| 고객사별 수행계획서 형식 차이 | 표준 목차가 모든 고객/사업에 맞지 않을 수 있음 | 템플릿을 코드 변경 없이 조정 가능한 형태(`execution-plan.template.md`)로 분리, v2에서 템플릿 선택 기능 고려 |
| 보안 및 민감 정보 처리 | 고객 계약/인력 정보 등 민감 데이터가 로컬 파일에 평문 저장됨 | MVP는 로컬 단일 사용자 전제로 범위를 한정, `.gitignore`에 `data/`, `output/` 기본 포함 권장, AI API 사용 시 외부 전송되는 데이터 범위를 사용자에게 명확히 고지 |
| 로컬 저장과 협업 저장의 차이 | 여러 PC에서 같은 프로젝트를 다루면 파일 충돌 가능 | MVP는 단일 사용자/단일 머신 전제를 명시적으로 문서화, Git을 활용한 수동 동기화를 임시 가이드로 제공 |
| 수동 편집 내용 보호 | manual 마커가 사용자에 의해 잘못 지워지거나 손상될 가능성 | 마커 누락 감지 시 갱신을 막고 경고, 정기 백업으로 복구 경로 확보 |
| 승인되지 않은 AI 결과 반영 위험 | 코드 버그로 미승인 제안이 반영될 가능성 | 반영 함수는 반드시 `Approval.decision === "approved"`인 레코드만 입력으로 받도록 인터페이스 강제, 단위 테스트로 회귀 방지 |

---

## 15. 개발 단계 제안

1. 현재 mock 구조 분석 — `activity_data.json` 스키마, Sprint0 Task/Output 목록 확정 (본 PRD 작성 과정에서 1차 완료)
2. 신규 `Sprint0_Working_book/` 구조 생성 (client/server/data/output 스캐폴딩)
3. 데이터 모델 정의 (7장 엔티티의 TypeScript 타입 + JSON 스키마 확정)
4. Markdown 템플릿 작성 (`execution-plan.template.md`, 섹션/manual 마커 포함)
5. 프로젝트 생성 및 저장 구조 구현 (Project CRUD, 폴더 스캐폴딩 자동화)
6. Sprint0 활동 입력 폼 구현 (activity_data.json → 폼 스키마 변환, A1~A7 폼 렌더링)
7. Markdown 생성기 구현 (템플릿 + 초기 데이터 → 최초 `execution-plan.md` 생성)
8. 섹션 업데이트 로직 구현 (마커 파싱, 부분 치환, manual 영역 보호, 백업 생성)
9. AI 프롬프트 생성 기능 구현 (컨텍스트 조립기, 프롬프트 템플릿, 선택적 API 호출)
10. Markdown 미리보기 구현 (렌더링 뷰 + diff 뷰)
11. 변경 이력 및 traceability 구현 (ChangeHistory 기록/조회, 섹션-입력 역추적 UI)
12. 테스트 및 검증 (섹션 갱신 시 manual 영역 보존 회귀 테스트, fixture 기반 시나리오 테스트, 13장 수용 기준 전체 검증)

---

**작성 스타일 메모**: 본 문서는 한국어로 작성되었으며, 표 기반 구조와 MVP/향후 확장의 명확한 구분을 통해 개발팀이 추가 질문 없이 1단계(현재 mock 구조 분석)부터 착수할 수 있도록 구체화했다.
