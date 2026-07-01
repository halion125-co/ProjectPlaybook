# Sprint 0 Playbook PRD v0.1

> 기존 공개 정적 사이트 `Sprint0_Playbook/index.html`을 재구축하기 위한 제품 요구사항 문서. 본 PRD는 단순 HTML 안내 페이지가 아니라, Sprint 0 Activity 수행, 프로젝트 유형별 Play 추천, 산출물 상태 추적, Open Item/RAID 관리, 본수행 착수 판단까지 연결하는 데이터 기반 Playbook 시스템을 정의한다.

**문서 버전**: v0.1  
**작성일**: 2026-06-23  
**문서 상태**: Draft  
**작성 대상 저장소**: `d:\ProjectPlaybook`  
**분석 기준**: `Sprint0_Playbook/index.html`, `Sprint0_Playbook/activity_data.json`, `Sprint0_Playbook/artifact-repository.html`, `Sprint0_Working_book/`, 기존 `Execution_Plan_Builder_PRD_v0.1.md`

---

## 1. 제품 개요

### 1.1 제품명

**Sprint 0 Activity Playbook**

대안 명칭:

- AXD Hybrid Sprint 0 Playbook
- Sprint 0 Readiness & Artifact Repository
- AX Project Kickoff Playbook

### 1.2 제품 정의

Sprint 0 Activity Playbook은 AXD 방법론과 Agile/Sprint 운영을 결합한 Hybrid 프로젝트에서, 본수행 착수 전에 필요한 준비 활동을 표준화하고 그 결과를 산출물, Open Item, RAID, 사업수행계획서 Chapter, 본수행 착수 판단으로 연결하는 시스템이다.

현재 공개 페이지는 정적 HTML Pack이다. 재구축 시스템은 정적 안내를 넘어 프로젝트별 데이터를 저장하고, Activity 수행 결과와 산출물 상태를 추적하며, 최종적으로 `Go / 조건부 착수 / 착수 보류` 판단을 지원해야 한다.

### 1.3 현재 시스템 분석 요약

| 영역 | 현재 구현 | 재구축 해석 |
|---|---|---|
| Overview | Sprint 0 목적, Core Task, 7개 Activity 카드 제공 | 프로젝트 착수 대시보드와 Activity Launcher 역할 |
| 프로젝트 유형 선택 | 단기/중형/장기/규제·공공/다수 협력사/순수 Agile/Hybrid AX 선택, localStorage 저장 | 프로젝트 프로파일 설정 및 Activity별 Play 추천 엔진 |
| Activity 상세 | A1~A7 상세 HTML, Task/Play/담당자/입력정보/의사결정/산출물/체크리스트 반복 구조 | Activity Definition 기반 동적 Form 및 Guide 화면 |
| A2 특화 화면 | RACI보다 Role Map, Decision Matrix, Escalation Path를 권장 | 재구축 시 A2 용어와 산출물 체계를 정규화해야 함 |
| Artifact Repository | 19개 산출물 데모 데이터, 상태/착수 영향/버전/Open Item/Chapter 추적 | 프로젝트별 산출물 저장소 및 착수 영향 분석 화면 |
| 수행계획서 연결 | Activity/Artifact가 AXD 사업수행계획서 Chapter와 매핑 | Execution Plan Builder와 연계 또는 내장 가능 |

### 1.4 제품이 해결하려는 문제

1. Sprint 0에서 무엇을 해야 하는지는 보이지만, 실제 수행 결과가 프로젝트별로 저장되지 않는다.
2. 프로젝트 유형에 따라 Play 강도와 필수 산출물이 달라져야 하지만, 현재는 브라우저 localStorage 수준의 표시 기능에 머문다.
3. Activity 결과, 산출물 상태, 미결사항, 본수행 착수 판단이 하나의 데이터 흐름으로 관리되지 않는다.
4. 산출물 승인자 미정, 환경 지연, 데이터 미제공 같은 조건부/보류 요인이 어떤 착수 판단에 영향을 주는지 운영자가 수동으로 해석해야 한다.
5. 기존 `Execution Plan Builder`는 수행계획서 Markdown 생성에 초점이 있으나, 공개 Playbook의 핵심인 Artifact Repository와 Day 1 Readiness 판단은 아직 제품 요구사항으로 충분히 분리되어 있지 않다.

### 1.5 제품 목표

- Sprint 0 Core 및 A1~A7 Activity를 프로젝트별 실행 단위로 관리한다.
- 프로젝트 유형/규모 선택에 따라 Activity별 권장 Play, 필수 산출물, 수행 강도를 제시한다.
- Activity 수행 결과를 구조화 입력으로 저장하고, 관련 Artifact와 자동 연결한다.
- Artifact별 상태, Owner/Reviewer/Approver, Open Item, 버전, 사업수행계획서 Chapter 반영 현황을 추적한다.
- 미결사항과 RAID 항목이 본수행 착수 판단에 미치는 영향을 자동 집계한다.
- A7에서 `Go / 조건부 착수 / 착수 보류` 판단을 지원하고 근거를 남긴다.
- Execution Plan Builder와 연계하여 수행계획서 섹션 갱신 후보를 생성한다.

---

## 2. 범위

### 2.1 In Scope

- 프로젝트 생성 및 프로젝트 유형/규모 설정
- Sprint 0 Core Task 관리
- A1~A7 Activity 카탈로그 조회 및 수행 입력
- Activity별 Guide, Task, Play 방식, 담당자, 입력정보, 의사결정, 산출물, 체크리스트 표시
- 프로젝트 유형별 Activity Play 추천
- Artifact Repository 구축
- Artifact 상태, 착수 영향, Open Item, Placeholder, 버전 이력 관리
- 사업수행계획서 Chapter 매핑 및 추적
- RAID/Decision/Open Item 관리
- Day 1 Readiness Check 및 착수 판정
- 수행계획서 Builder와의 섹션 매핑 연계
- 단일 사용자 로컬 실행 또는 소규모 팀 사용을 고려한 파일 기반 MVP

### 2.2 Out of Scope - MVP

- 다중 사용자 실시간 협업
- 권한 기반 접근 제어와 SSO
- 외부 ERP/KOS/PRB 시스템 자동 연동
- Word/HWP/PPT 자동 생성
- LLM이 승인 없이 산출물 또는 착수 판정을 확정하는 기능
- 기존 정적 HTML 파일 직접 수정
- 요구사항 Playbook, Close Playbook 전체 재구축
- 고객 포털 또는 외부 고객 직접 승인 화면

---

## 3. 사용자와 역할

| 사용자 | 주요 니즈 | 핵심 기능 |
|---|---|---|
| PM | Sprint 0 진행 상황, 산출물 상태, 착수 가능 여부를 한눈에 보고 싶다 | Dashboard, Activity 입력, Artifact Repository, Day 1 Check |
| 고객 PM | 고객 측 승인자, 담당자, 조건부 항목을 명확히 확인하고 싶다 | 승인자 지정, Open Item 확인, 착수 판단 근거 |
| Scrum Master / Agile Lead | Sprint 운영 방식, Backlog, DoR/DoD 합의를 기록하고 싶다 | A1 Activity, Play 추천, Backlog/DoR/DoD 산출물 |
| Product Owner | Backlog 우선순위와 Acceptance Criteria를 확정하고 싶다 | A1, A4 입력, Decision Log |
| PL / Tech Lead | 기술 수행 가능성, 환경/권한, 개발 준비 상태를 확인하고 싶다 | A5, Environment & Access Matrix |
| QA | 산출물 승인 기준, 품질 기준, Acceptance Criteria를 관리하고 싶다 | A4, Artifact 승인 상태, Quality Chapter |
| 보안/인프라/운영 담당자 | 보안교육, 권한, 환경, 운영전환 준비 상태를 점검하고 싶다 | A5, A6, A7 체크리스트 |
| Sponsor / 관리자 | 착수 가능/조건부 착수/착수 보류의 근거를 보고 싶다 | Readiness Summary, Day 1 Result |

---

## 4. 제품 정보 구조

### 4.1 상위 메뉴

1. Project Dashboard
2. Sprint 0 Overview
3. Project Profile & Scale
4. Activities A1~A7
5. Artifact Repository
6. RAID & Open Items
7. Day 1 Readiness Check
8. Execution Plan Preview
9. Change History

### 4.2 핵심 화면

| 화면 | 목적 | 주요 구성 |
|---|---|---|
| 프로젝트 목록 | 프로젝트 생성/전환 | 프로젝트 카드, 상태, 마지막 수정일 |
| 프로젝트 대시보드 | Sprint 0 진행 상황 요약 | Activity 완료율, 산출물 상태, 착수 영향 카운트, 미결 항목 |
| 프로젝트 프로파일 | 유형/규모 설정 | 단기, 중형, 장기, 규제·공공, 다수 협력사, 순수 Agile, Hybrid AX |
| Sprint 0 Overview | Core Task와 전체 흐름 확인 | Core Task, 7개 Activity 카드, Activity to Output 매핑 |
| Activity Detail/Form | Activity 수행과 결과 입력 | Guide, Task 입력, 결정사항, Open Item, 산출물 연결 |
| Artifact Repository | 산출물 조회와 추적 | 검색, 필터, 상세 패널, 버전, Open Item, Chapter |
| RAID & Open Items | 미결/리스크 통합 관리 | 유형, 영향도, Owner, Due Date, 착수 영향 |
| Day 1 Readiness | 본수행 착수 판단 | 필수 조건 점검, 조건부/보류 항목, 판정 결과 |
| Execution Plan Preview | 수행계획서 반영 확인 | 섹션 매핑, Markdown Preview, 갱신 후보 |

---

## 5. 핵심 사용자 흐름

### 5.1 신규 프로젝트 시작

1. PM이 프로젝트를 생성한다.
2. 프로젝트명, 고객사, 기간, PM, 고객 PM, 프로젝트 유형을 입력한다.
3. 시스템은 Sprint 0 Core와 A1~A7 Activity 목록을 생성한다.
4. 프로젝트 유형에 맞는 권장 Play와 필수 Artifact가 계산된다.

### 5.2 프로젝트 유형별 Play 추천

1. 사용자가 프로젝트 유형을 선택한다.
2. 시스템은 각 Activity별 권장 Play, 핵심 산출물, 강도를 표시한다.
3. Activity 카드에는 `권장`, `강화`, `선택`, `간소화` 같은 태그가 표시된다.
4. 선택값은 프로젝트 설정으로 저장되어 모든 Activity 화면에서 일관되게 적용된다.

### 5.3 Activity 수행

1. 사용자가 A1~A7 중 하나를 선택한다.
2. 시스템은 해당 Activity의 목적, Task, Play 방식, 담당자, 입력정보, 의사결정 항목을 보여준다.
3. 사용자는 Task별로 합의/결론, 판단 근거, 미결사항, 다음 액션, 메모를 입력한다.
4. 미결사항이 있으면 Open Item 또는 RAID로 등록할 수 있다.
5. 저장 시 관련 Artifact 상태와 수행계획서 섹션 갱신 후보가 업데이트된다.

### 5.4 Artifact Repository 운영

1. Activity 저장 결과가 Artifact Repository에 반영된다.
2. 사용자는 산출물을 Activity, 상태, 착수 영향, 키워드로 필터링한다.
3. 산출물을 선택하면 입력 출처, Task, Chapter, 입력 데이터, 결정사항, 담당자, Open Item, 버전 이력을 확인한다.
4. 산출물의 Placeholder 또는 Open Item이 남아 있으면 착수 영향이 자동 계산된다.

### 5.5 본수행 착수 판단

1. A7에서 모든 Activity의 산출물 상태와 Open Item을 종합한다.
2. 시스템은 착수 영향 없음, 조건부 착수 영향, 착수 보류 영향을 집계한다.
3. 착수 보류 항목이 있으면 기본 판정은 `착수 보류`로 제안한다.
4. 보류 항목은 없지만 조건부 항목이 있으면 `조건부 착수`로 제안한다.
5. 모든 필수 조건이 충족되면 `Go`로 제안한다.
6. PM과 고객 PM은 판정 결과와 조건부 항목의 Owner/Due Date를 확정한다.

---

## 6. Activity 카탈로그

### 6.1 Sprint 0 Core

| Task | 설명 | 주요 Output |
|---|---|---|
| 계약·제안 정보 수집 | RFP, 제안서, 계약서/SOW, 기술협상 내역, 사전 미팅 기록 수집 | 입력 자료 Repository |
| Project Brief 작성 | 사업명, 사업기간, 추진 배경, 고객 기대성과, 성공 기준 정리 | Project Brief |
| Scope 기준선 작성 | Scope In/Out, 업무 범위, 가정, 제약사항 정리 | Scope Matrix |
| Sprint 0 수행계획 수립 | 기간, 참석자, 세션, 산출물, 책임자 정의 | Sprint 0 Plan |
| Open Item 초기 등록 | 미확정 범위, 의사결정, 환경/권한, 고객 준비 이슈 등록 | Open Item List |

### 6.2 A1~A7 Activity

| 코드 | Activity | 목적 | 주요 Artifact | 수행계획서 매핑 |
|---|---|---|---|---|
| A1 | 프로젝트 수행방식 합의 | AXD 단계와 Sprint 운영을 결합한 Hybrid 수행 방식 합의 | WoW / DoR / DoD, Initial Backlog | methodology, change-management |
| A2 | 수행팀 투입 및 책임 정렬 | 역할, 책임, 승인자, 의사결정 구조 확정 | Stakeholder Map, Role Map, Decision Matrix, Escalation Path | governance, raci |
| A3 | 의사소통관리 및 운영 주기 수립 | 보고체계, 회의체, Agile Ceremony, Action Item 규칙 정의 | Communication Plan, Meeting Calendar | communication |
| A4 | 산출물 검토·승인 기준 정의 | 산출물 목록, 승인자, 제출시점, Acceptance Criteria 정의 | Deliverable Matrix, Approval Workflow | deliverables, acceptance, quality |
| A5 | 환경·도구·접근권한 준비 | 협업도구, 저장소, 고객 시스템, 개발/검증 환경 권한 점검 | Environment & Access Matrix, Access Request List | environment |
| A6 | 고객 준비·보안성·리스크 점검 | 고객 준비도, 데이터, 보안, 권한, 리스크/이슈/결정 관리 | Customer Readiness, Security Checklist, RAID Log | raid |
| A7 | 오픈·전환 고려사항 및 본수행 착수 점검 | Sprint 0 결과를 종합해 착수 가능 여부 판단 | Day 1 Check, Day 1 Result, Open Item Transfer | transition |

### 6.3 A2 용어 정규화 원칙

현재 `activity_data.json`에는 A2 산출물이 `05_RACI`로 남아 있으나, 실제 상세 화면은 RACI Matrix보다 다음 산출물을 권장한다.

- Stakeholder Map
- Role & Accountability Map
- Decision & Approval Matrix
- Escalation Path
- Onboarding Checklist
- Responsibility Boundary Table, 다수 협력사 프로젝트인 경우

재구축 시스템에서는 Task 단위 RACI 작성을 기본값으로 두지 않는다. 역할과 의사결정 구조를 정리하고, 실제 Task 담당은 Sprint Backlog 또는 WBS에서 관리한다.

---

## 7. Artifact Repository 요구사항

### 7.1 기본 요구사항

Artifact Repository는 Sprint 0 Activity 수행으로 생성되는 모든 산출물을 조회, 필터링, 추적하는 저장소다.

MVP 기준 산출물 유형:

- Plan
- Brief
- Tracking
- Agreement
- Backlog
- Stakeholder/Role/Decision Matrix
- Checklist
- Communication Plan
- Rule
- Criteria
- RAID
- Report
- OpenItem

### 7.2 산출물 상태값

| 상태 | 의미 |
|---|---|
| 작성중 | 초안이 존재하나 충분히 검토되지 않음 |
| 일부생성 | 핵심 항목은 있으나 Placeholder 또는 Open Item이 남아 있음 |
| 생성완료 | Activity 기준으로 산출물이 생성됨 |
| 보완필요 | 착수 판단에 영향을 줄 수 있는 보완 항목 존재 |
| 승인완료 | 지정 승인자가 승인 완료 |

### 7.3 착수 영향값

| 착수 영향 | 의미 | Day 1 판단 영향 |
|---|---|---|
| 착수 영향 없음 | 본수행 착수에 직접 영향 없음 | Go 가능 |
| 조건부 착수 영향 | Owner/Due Date가 있는 조건부 항목 존재 | 조건부 착수 후보 |
| 착수 보류 영향 | 승인자 미정, 필수 환경 부재, 핵심 Scope 미확정 등 차단 항목 존재 | 착수 보류 후보 |

### 7.4 Repository 필터

- 키워드 검색: 산출물명, 설명
- Activity: Core, A1~A7
- 상태: 작성중, 일부생성, 생성완료, 보완필요, 승인완료
- 착수 영향: 영향 없음, 조건부, 보류
- Owner/Approver
- Chapter

### 7.5 산출물 상세 정보

각 Artifact는 다음 정보를 가져야 한다.

- Artifact ID, 이름, 유형
- Activity 출처 및 Task 출처
- 상태와 착수 영향
- Owner, Reviewer, Approver
- 설명
- 입력 데이터
- 의사결정 항목
- Open Item
- Placeholder 또는 보완 필요 항목
- 사업수행계획서 Chapter
- 버전 이력
- 관련 파일 링크
- 수행계획서 반영 상태

---

## 8. Day 1 Readiness 요구사항

### 8.1 점검 영역

Day 1 Readiness Check는 다음 영역을 종합한다.

1. Project Brief와 Scope 기준선
2. Sprint 1 후보 Backlog와 DoR 충족 여부
3. PM, 고객 PM, PO, SM, PL, QA, 보안/인프라 담당자 지정 여부
4. 산출물 승인자 지정 여부
5. 회의체와 보고 주기 확정 여부
6. 필수 환경과 접근권한 준비 여부
7. 고객 데이터와 업무 담당자 준비 여부
8. 보안교육, 보안서약, 자료 반출입 기준
9. RAID 중 High 영향 항목
10. Open Item의 Owner와 Due Date

### 8.2 판정 규칙

| 조건 | 시스템 제안 판정 |
|---|---|
| 필수 산출물 승인자 미정, 필수 환경 부재, 핵심 Scope 미확정, 착수 보류 영향 Artifact 존재 | 착수 보류 |
| 보류 항목은 없으나 조건부 착수 영향 Artifact 또는 Open Item 존재 | 조건부 착수 |
| 필수 Activity 완료, 보류/조건부 항목 없음 | Go |

### 8.3 판정 결과 산출물

- 본수행 착수점검표
- 본수행 착수점검 결과서
- 조건부 착수 조건 목록
- 착수 보류 사유 목록
- Open Item 이관 목록
- Sprint 1 Backlog 이관 목록

---

## 9. 기능 요구사항

| ID | 기능 | 설명 | 우선순위 | 수용 기준 |
|---|---|---|---|---|
| FR-01 | 프로젝트 생성 | 프로젝트 기본정보와 Sprint 0 작업공간 생성 | Must | 프로젝트 생성 후 Dashboard 접근 가능 |
| FR-02 | 프로젝트 유형 설정 | 7개 유형 중 하나 이상 선택하고 저장 | Must | 저장값이 모든 Activity 화면에 반영됨 |
| FR-03 | Play 추천 | 유형별 Activity 권장 Play, 산출물, 강도 계산 | Must | Overview와 Activity 상세에서 동일 추천 표시 |
| FR-04 | Activity Catalog | A1~A7 정의 조회 | Must | `activity_data.json` 기반 Task/Play/Owner/Output 표시 |
| FR-05 | Activity 입력 | Task별 합의/근거/리스크/액션/메모 입력 | Must | 저장 후 새로고침해도 유지 |
| FR-06 | Open Item 등록 | Activity 입력 중 미결사항 등록 | Must | Owner, Due Date, Impact가 저장됨 |
| FR-07 | RAID 등록 | Risk/Issue/Decision/Dependency 관리 | Should | RAID 항목이 Day 1 판단에 반영됨 |
| FR-08 | Artifact 자동 생성 후보 | Activity 결과와 Output 매핑으로 Artifact 생성 후보 표시 | Must | Activity 저장 후 Repository에 관련 Artifact 표시 |
| FR-09 | Artifact 상태 관리 | 작성중/일부생성/생성완료/보완필요/승인완료 관리 | Must | 상태별 필터링 가능 |
| FR-10 | 착수 영향 계산 | Artifact/Open Item/RAID 기반 영향값 산정 | Must | 조건부/보류 항목 개수가 Dashboard에 표시 |
| FR-11 | Artifact 상세 조회 | 출처, Task, Chapter, 입력, 결정, 버전, Open Item 표시 | Must | 목록에서 클릭 시 상세 패널 표시 |
| FR-12 | Artifact 버전 이력 | 산출물 수정/승인 시 버전 로그 기록 | Should | v0.1, v0.5 같은 이력 조회 가능 |
| FR-13 | Chapter 매핑 | Artifact와 사업수행계획서 Chapter 연결 | Must | Chapter별 반영 현황 조회 가능 |
| FR-14 | Day 1 Check | 전체 준비 상태를 종합 점검 | Must | Go/조건부/보류 제안 표시 |
| FR-15 | 조건부 항목 관리 | 조건부 착수 조건의 Owner/Due Date 추적 | Must | 조건부 항목 미완료 시 Dashboard에 남음 |
| FR-16 | 수행계획서 연계 | Activity 결과를 Execution Plan Section 갱신 후보로 연결 | Should | 섹션 미리보기와 적용 가능 |
| FR-17 | 변경 이력 | Activity/Artifact/Plan 변경 내역 기록 | Should | 프로젝트별 이력 조회 가능 |
| FR-18 | Export | Repository 또는 Day 1 결과 Markdown/HTML 복사 | Could | 버튼 클릭 시 내보내기 가능 |

---

## 10. 데이터 모델

### 10.1 Project

| 필드 | 설명 |
|---|---|
| project_id | 프로젝트 고유 ID |
| name | 프로젝트명 |
| customer | 고객사 |
| pm | 수행 PM |
| customer_pm | 고객 PM |
| start_date / end_date | 프로젝트 기간 |
| sprint0_start_date / sprint0_end_date | Sprint 0 기간 |
| scale_type | 프로젝트 유형/규모 |
| readiness_status | Go / Conditional / Hold / Not assessed |

### 10.2 ProjectScaleProfile

| 필드 | 설명 |
|---|---|
| scale_key | short, mid, long, regulatory, multi-vendor, agile, hybrid |
| label | 표시명 |
| description | 유형 설명 |
| recommendations | Activity별 추천 Play 목록 |

### 10.3 ActivityDefinition

| 필드 | 설명 |
|---|---|
| activity_id | way-of-working 등 |
| code | A1~A7 |
| title | Activity명 |
| purpose | 목적 |
| tasks | 수행 Task |
| play | 수행 방식 |
| owners | 역할/책임 |
| info | 입력 데이터 |
| decisions | 의사결정 항목 |
| outputs | 산출물 |
| checklist | 완료 체크리스트 |
| chapter_mapping | 사업수행계획서 Chapter |
| section_mapping | 수행계획서 섹션 |

### 10.4 ActivityResult

| 필드 | 설명 |
|---|---|
| result_id | 결과 ID |
| project_id | 프로젝트 ID |
| activity_id | Activity ID |
| task_id | Task ID |
| decision | 합의/결론 |
| rationale | 판단 근거 |
| open_issue | 미결사항/리스크 |
| action_item | 다음 액션 |
| note | 추가 메모 |
| status | draft/saved/confirmed |

### 10.5 Artifact

| 필드 | 설명 |
|---|---|
| artifact_id | 산출물 ID |
| project_id | 프로젝트 ID |
| name | 산출물명 |
| type | Plan, Checklist, Matrix 등 |
| activity_id | 생성 Activity |
| status | 작성중/일부생성/생성완료/보완필요/승인완료 |
| impact | 착수 영향 없음/조건부 착수 영향/착수 보류 영향 |
| owner / reviewer / approver | 작성/검토/승인자 |
| chapters | 사업수행계획서 Chapter |
| tasks | 연결 Task |
| inputs | 주요 입력 데이터 |
| decisions | 연결 의사결정 |
| open_items | 미결 항목 |
| placeholders | 보완 필요 항목 |
| versions | 버전 이력 |

### 10.6 OpenItem

| 필드 | 설명 |
|---|---|
| open_item_id | Open Item ID |
| title | 항목명 |
| source_activity_id | 출처 Activity |
| source_artifact_id | 출처 Artifact |
| owner | 담당자 |
| due_date | 완료 예정일 |
| impact | none/conditional/block |
| transfer_target | Sprint 1 Backlog / RAID / Execution Plan / Customer Action |
| status | open/in-progress/done/deferred |

---

## 11. 비즈니스 규칙

1. Sprint 0에서 모든 내용을 완성하려고 하지 않는다. 60~70% 초안을 준비하고, Sprint 0에서는 검토, 합의, 결정, Owner 지정에 집중한다.
2. Owner와 Due Date가 없는 Open Item은 완료로 볼 수 없다.
3. 산출물 승인자가 미정인 경우 해당 Artifact는 최소 `조건부 착수 영향` 이상이다.
4. 필수 산출물의 승인자가 미정이거나 필수 환경/권한이 제공되지 않으면 `착수 보류 영향`으로 분류한다.
5. A2에서는 Task 단위 RACI를 기본 산출물로 만들지 않는다. Role Map과 Decision Matrix를 우선한다.
6. Backlog 변경과 공식 변경요청은 구분하되, 연결 기준을 A1에서 정의해야 한다.
7. A7은 새 문서를 만드는 활동이 아니라, 앞선 Activity 결과를 검증하는 Gate다.
8. A7의 조건부 착수 항목은 반드시 Owner, Due Date, 해결 조건을 가져야 한다.
9. Artifact 상태 변경과 Day 1 판정 변경은 Change History에 남긴다.
10. AI 또는 자동 추천은 판정 초안만 만들 수 있으며, 최종 확정은 PM 또는 고객 PM 승인이 필요하다.

---

## 12. MVP 릴리스 범위

### 12.1 MVP 1차

- 프로젝트 생성/조회
- 프로젝트 유형 설정
- A1~A7 Activity 조회 및 입력
- Open Item 등록
- Artifact Repository 조회/필터/상세
- Artifact 상태와 착수 영향 수동 관리
- Day 1 Readiness Summary와 판정 초안

### 12.2 MVP 2차

- Activity 결과 기반 Artifact 자동 생성/업데이트
- 착수 영향 자동 계산
- RAID/Decision Log 통합
- Chapter 반영 현황 Dashboard
- Execution Plan Builder와 섹션 갱신 연계

### 12.3 MVP 3차

- Artifact 버전 이력과 승인 워크플로우
- Markdown/HTML Export
- AI 문장 보완 및 누락 점검
- 프로젝트 유형별 Tailoring Rule 편집 기능

---

## 13. 기존 구현과의 차이 및 보완 요구

현재 `Sprint0_Working_book` 앱은 프로젝트, Activity 입력, 수행계획서 Preview, Change History 중심으로 구현되어 있다. 재구축 PRD 기준으로는 다음 보완이 필요하다.

| 현재 구현 | 보완 필요 |
|---|---|
| 프로젝트 목록과 Activity 입력 존재 | 프로젝트 유형/규모 설정 추가 |
| ActivityResult 저장 가능 | Open Item, RAID, Artifact와 연결 필요 |
| 수행계획서 Section Mapping 존재 | Artifact Repository와 Chapter Mapping 강화 필요 |
| Plan Preview와 Apply 존재 | Day 1 Readiness 판정 화면 추가 필요 |
| A1~A7 카탈로그 로드 | A2 용어를 Role Map/Decision Matrix 기준으로 정규화 필요 |
| Artifact 타입은 단순 draft/in-review/approved/rejected | Playbook용 상태값 작성중/일부생성/생성완료/보완필요/승인완료와 착수 영향값 필요 |

---

## 14. 성공 지표

| 지표 | 목표 |
|---|---|
| Sprint 0 Activity 입력 완료율 | A1~A7 Task 기준 90% 이상 입력 가능 |
| Artifact 추적 커버리지 | Activity Output의 100%가 Artifact로 연결 |
| Open Item 추적성 | 조건부/보류 항목 100%가 Owner와 Due Date 보유 |
| Day 1 판정 근거성 | 판정 결과가 Artifact/Open Item/RAID 근거와 연결 |
| 수행계획서 반영성 | Activity 결과가 최소 1개 Execution Plan Section과 연결 |
| 재사용성 | 새 프로젝트 생성 후 10분 이내 Sprint 0 작업공간 준비 |

---

## 15. 주요 오픈 이슈

| ID | 이슈 | 확인 필요 사항 |
|---|---|---|
| OI-01 | A2 명칭 정규화 | `RACI`를 유지할지, `Role & Accountability`로 완전히 전환할지 결정 필요 |
| OI-02 | Artifact 상태값 통합 | 기존 앱의 `draft/in-review/approved/rejected`와 Repository의 한국어 상태값 통합 필요 |
| OI-03 | 기존 Execution Plan Builder와 경계 | 별도 제품으로 둘지, Sprint 0 Playbook의 하위 모듈로 합칠지 결정 필요 |
| OI-04 | 저장 방식 | MVP 파일 기반 유지 여부와 향후 DB 전환 시점 결정 필요 |
| OI-05 | 승인 주체 | 고객 PM, Sponsor, 내부 PM 중 어떤 판정에 누가 최종 승인자인지 정책 필요 |

---

## 16. 결론

재구축 대상은 단순한 Sprint 0 안내 사이트가 아니다. 핵심 제품은 `프로젝트 유형에 맞는 Sprint 0 실행 가이드`, `Activity 수행 입력`, `Artifact Repository`, `Open Item/RAID 추적`, `Day 1 착수 판단`, `사업수행계획서 반영`을 하나로 묶는 착수 준비 운영 시스템이다.

기존 `Execution Plan Builder`는 이 제품의 중요한 하위 기능이 될 수 있지만, Playbook 재구축의 중심은 문서 생성보다 `본수행에 들어갈 수 있는 상태인지 판단 가능한 구조화된 증적과 추적성`에 두어야 한다.