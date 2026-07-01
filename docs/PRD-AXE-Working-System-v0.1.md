# PRD: AXE Delivery Way — Project Working System
**Version:** 0.1 (Draft)
**Date:** 2026-07-01
**Author:** KT AXE Delivery Way Team

---

## 1. 배경 및 목적

### 1.1 배경

Sprint 0 Playbook은 초보 PM이 프로젝트 초기 단계에 실제 프로젝트를 수행할 수 있는 수준을 준비하기 위한 Read-only 가이드다.
그러나 Playbook만으로는 한계가 있다.
PM이 Playbook을 보면서 회의에서 결정한 내용, 확인한 사항, 미정 항목(Open Item)이 어딘가에 기록되어야 하고, 그 기록이 실제 프로젝트 수행의 기준이 되어야 한다.

현재는 결정 내용이 회의록, 메모, 별도 문서에 흩어지고, Sprint 0에서 만든 기준이 본수행에서 제대로 이어지지 않는 문제가 반복된다.

### 1.2 목적

Sprint 0 Playbook의 각 Activity를 수행하면서 PM이 직접 입력하고 선택한 정보가 연속성 있게 쌓이고, 그 정보가 Sprint 1 이후 본수행의 기준이 되는 **Working System**을 구축한다.

- Playbook은 가이드(Read-only)로 유지
- Working System은 실제 입력·선택·확인이 이루어지는 별도 레이어
- 두 시스템은 연결되어 있으며, Working System의 데이터가 사업수행계획서 초안, Sprint 1 준비 결과, Open Item 이관 목록 등으로 자동 생성된다

### 1.3 목표 사용자

| 사용자 | 설명 |
|--------|------|
| 주 사용자 | 초보~중급 PM. Sprint 0 수행 중 Playbook을 참고하며 실제 결정 내용을 입력 |
| 참조 사용자 | PL, QA, 고객 PM이 특정 결정 사항을 확인하거나 이관 항목을 추적 |
| 관리 사용자 | AXE 방법론 담당자가 양식 기준, 판정 기준을 관리 |

---

## 2. 문제 정의

| # | 문제 | 영향 |
|---|------|------|
| 1 | Sprint 0에서 결정한 내용(수행모델, Sprint 주기, 승인자 등)이 회의록·메모에 흩어짐 | 본수행에서 기준이 불명확해져 재결정 필요 |
| 2 | 미정 항목(Open Item)이 제대로 이관되지 않음 | Sprint 1 착수 후 갑작스러운 지연 발생 |
| 3 | A1~A6의 결정사항이 A7에서 종합될 때 수작업으로 재정리 필요 | A7 판정의 근거가 부실하거나 누락 |
| 4 | 사업수행계획서 작성이 별도 작업으로 분리되어 Sprint 0 산출물과 연계가 안 됨 | 중복 작업, 기준 불일치 |
| 5 | PM이 Playbook을 보면서 결정한 내용을 어디에 기록할지 몰라 결국 기록 안 함 | Playbook이 실제 수행에 영향을 못 미침 |

---

## 3. 범위

### In-Scope (v1.0)
- Sprint 0 전 구간 (A1~A7) 데이터 입력 및 관리
- 프로젝트 기본 정보 등록
- Activity별 결정사항 입력 및 저장
- Open Item(미정 항목) 등록, 추적, 이관
- A7 Sprint 1 시작 방식 판정 (정상/조건부/범위조정후/확인필요)
- 사업수행계획서 초안 자동 생성 (챕터별 정리표 형태)
- Sprint 1 실행준비 결과서 자동 생성

### Out-of-Scope (v1.0)
- Sprint 1 이후 본수행 진행 관리 (Sprint Backlog, Velocity 등)
- 실시간 협업 기능 (동시 편집, 알림)
- 외부 시스템 연동 (Jira, Confluence, 사내 그룹웨어)
- 모바일 최적화
- 다국어 지원

---

## 4. 핵심 데이터 모델

### 4.1 프로젝트 기본 정보 (Project Profile)

Sprint 0 시작 전 한 번 입력. 모든 Activity의 컨텍스트를 구성한다.

```
ProjectProfile {
  project_id          : UUID
  project_name        : string           // 프로젝트명
  contract_date       : date             // 계약일
  sprint0_start_date  : date             // Sprint 0 시작일
  sprint0_end_date    : date             // Sprint 0 완료 예정일
  sprint1_target_date : date             // Sprint 1 목표 시작일
  project_type        : enum             // POC_GENERAL | POC_PUBLIC | POC_FINANCE
                                         // PROD_GENERAL | PROD_PUBLIC | PROD_FINANCE
  customer_org        : string           // 고객 기관명
  axe_pm              : string           // 수행 PM 이름
  created_at          : datetime
  updated_at          : datetime
}
```

### 4.2 참여자 (Participant)

A2에서 등록. 이후 모든 Activity에서 승인자/담당자 선택 시 참조된다.

```
Participant {
  participant_id   : UUID
  project_id       : UUID
  name             : string
  organization     : string           // 고객 | 수행 | 협력사 | 지원조직
  role_type        : enum             // CUSTOMER_PM | CUSTOMER_SPONSOR | CUSTOMER_IT_LEAD
                                      // CUSTOMER_BIZ | CUSTOMER_SECURITY | CUSTOMER_INFRA
                                      // AXE_PM | AXE_PL | AXE_QA | AXE_TECH
                                      // PARTNER | OTHER
  responsibilities : string           // 핵심 책임 범위 (자유 텍스트)
  contact_channel  : string           // 연락처/채널
  is_approver      : boolean          // 승인자 여부
  status           : enum             // CONFIRMED | TBD
  created_at       : datetime
}
```

### 4.3 의사결정 항목 (Decision)

각 Activity의 Task에서 결정된 항목. 이것이 Working System의 핵심 데이터다.

```
Decision {
  decision_id      : UUID
  project_id       : UUID
  activity_id      : enum             // A1 | A2 | A3 | A4 | A5 | A6 | A7
  task_no          : integer          // Task 번호
  task_title       : string
  category         : string           // 결정 분류 (수행모델, Sprint운영, 역할, 산출물 등)
  question         : string           // 결정이 필요했던 질문
  selected_option  : string           // 선택된 옵션 또는 입력된 값
  rationale        : string           // 선택 사유 (선택 입력)
  agreed_with      : [participant_id] // 합의에 참여한 참여자
  decided_at       : date             // 결정일
  status           : enum             // DECIDED | CONDITIONAL | OPEN
  open_item_id     : UUID | null      // OPEN 상태이면 연결된 Open Item
  created_at       : datetime
  updated_at       : datetime
}
```

### 4.4 Open Item (미정 항목)

미결 사항을 등록하고 Sprint 1 시작 영향도까지 추적한다.

```
OpenItem {
  open_item_id     : UUID
  project_id       : UUID
  source_activity  : enum             // 어떤 Activity에서 발생했는지
  source_task_no   : integer
  title            : string           // 미정 항목 제목
  description      : string           // 상세 내용
  owner_id         : participant_id   // 담당자
  due_date         : date             // 확인 기한
  sprint1_impact   : enum             // NONE | CONDITIONAL | BLOCKER
  transfer_to      : enum             // SPRINT1 | NEXT_ACTIVITY | PROJECT_PLAN | CUSTOMER_ACTION
  status           : enum             // OPEN | IN_PROGRESS | RESOLVED | TRANSFERRED
  resolved_at      : date | null
  resolution_note  : string | null
  created_at       : datetime
  updated_at       : datetime
}
```

### 4.5 산출물 (Deliverable)

A4에서 등록. 제출 기한, 승인자, 검수 기준을 관리한다.

```
Deliverable {
  deliverable_id   : UUID
  project_id       : UUID
  name             : string
  category         : enum             // MANDATORY | CONDITIONAL | OPTIONAL | EXCLUDED
  exclusion_reason : string | null
  submit_basis     : enum             // BY_PHASE | BY_SPRINT | BY_GATE
  due_date         : date
  reviewer_id      : participant_id
  approver_id      : participant_id
  acceptance_criteria : string        // 검수 기준
  rejection_criteria  : string        // 반려 기준
  revision_deadline   : integer       // 보완 기한 (일)
  storage_location : string           // 저장 위치
  version_rule     : string           // 버전 기준
  status           : enum             // PENDING | SUBMITTED | APPROVED | REJECTED | REVISED
  created_at       : datetime
}
```

### 4.6 환경/도구/권한 항목 (Resource)

A5에서 등록. Sprint 1 시작 가능 여부 판단에 직접 영향을 준다.

```
Resource {
  resource_id      : UUID
  project_id       : UUID
  type             : enum             // TOOL | ENVIRONMENT | ACCESS | REPOSITORY
  name             : string           // 예: "개발 환경", "Jira", "VPN 접속"
  is_sprint1_required : boolean       // Sprint 1 필수 여부
  ready_date       : date | null      // 사용 가능 예정일
  status           : enum             // READY | IN_PROGRESS | DELAYED | NOT_STARTED
  workaround       : string | null    // 지연 시 우회방안
  owner_id         : participant_id
  created_at       : datetime
}
```

### 4.7 리스크/이슈 (RiskIssue)

A6에서 등록. 영향도와 Sprint 1 차단 여부를 함께 관리한다.

```
RiskIssue {
  risk_issue_id    : UUID
  project_id       : UUID
  type             : enum             // RISK | ISSUE | DECISION_NEEDED
  category         : enum             // CUSTOMER_READINESS | DATA | SECURITY | SCHEDULE | OTHER
  title            : string
  description      : string
  probability      : enum             // HIGH | MEDIUM | LOW        (Risk만)
  impact           : enum             // HIGH | MEDIUM | LOW
  sprint1_blocking : boolean          // Sprint 1 차단 여부
  mitigation       : string           // 대응 전략
  owner_id         : participant_id
  due_date         : date
  status           : enum             // OPEN | MITIGATING | CLOSED
  created_at       : datetime
}
```

### 4.8 보고체계 (ReportingScheme)

A3에서 등록. 운영 리듬 전체를 구조화한다.

```
ReportingScheme {
  scheme_id        : UUID
  project_id       : UUID
  type             : enum             // WEEKLY_REPORT | MONTHLY_REPORT | SPRINT_REVIEW
                                      // QUALITY_CHECK | STEERING | ISSUE_MEETING | AD_HOC
  target_audience  : [participant_id]
  frequency        : string           // "매주 금요일", "Sprint 완료 후 1일 이내" 등
  owner_id         : participant_id   // 운영 책임자
  output_format    : string           // 회의록, 주간보고 양식 등
  connected_to     : string | null    // 연결된 공식 보고 (예: 주간보고 반영)
  created_at       : datetime
}
```

### 4.9 Sprint 1 실행준비 판정 (Sprint1Readiness)

A7 최종 판정. 모든 데이터를 종합하여 자동 집계 후 PM이 최종 확정한다.

```
Sprint1Readiness {
  readiness_id         : UUID
  project_id           : UUID
  activity_completion  : {           // A1~A6 완료 상태 자동 집계
    a1: enum,  // COMPLETE | PARTIAL | INCOMPLETE
    a2: enum,
    a3: enum,
    a4: enum,
    a5: enum,
    a6: enum
  }
  blocker_count        : integer     // sprint1_impact = BLOCKER인 Open Item 수
  conditional_count    : integer     // sprint1_impact = CONDITIONAL인 Open Item 수
  resource_not_ready   : integer     // is_sprint1_required = true & status != READY인 Resource 수
  high_risk_blocking   : integer     // sprint1_blocking = true인 RiskIssue 수
  system_suggestion    : enum        // 시스템 자동 제안 판정
  pm_verdict           : enum        // PM 최종 확정
                                     // NORMAL_START | CONDITIONAL_START
                                     // SCOPE_ADJUSTED_START | CONFIRM_BEFORE_START
  verdict_rationale    : string      // 판정 근거
  confirmed_at         : datetime
  confirmed_by         : participant_id
}
```

---

## 5. Activity별 입력 항목 상세 명세

### 5.1 A1 — 수행방식 및 Sprint 운영 기준

#### Task 1: 프로젝트 유형과 특성 Tag 확인
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 프로젝트 유형 | single-select | PoC / 본사업 | Y |
| 규제 특성 Tag | multi-select | 일반AX / 공공AX / 금융AX | Y |
| 추가 점검 필요 항목 | text | - | N |

#### Task 2: 수행모델 결정
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 수행모델 | single-select | AXD 단계형 / Hybrid / Sprint 중심 | Y |
| 선택 사유 | text | - | Y |
| 고객 합의 여부 | single-select | 합의 완료 / 협의 중 / 미확인 | Y |

#### Task 3: Sprint 운영 기준 결정
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| Sprint 주기 | single-select | 1주 / 2주 / 3주 / 기타 | Y |
| Sprint 주기 (기타) | text | - | 조건부 |
| Review 방식 | single-select | 내부 Review / 고객 포함 Review | Y |
| Sprint 종료 기준 | text | - | Y |
| 다음 Sprint 시작 기준 | text | - | Y |
| Backlog 정제 주기 | single-select | 매 Sprint 중반 / Sprint 시작 전 / 별도 미정 | Y |

#### Task 4: 작업 목록 관리 방식 결정
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 관리 도구 | single-select | Jira / Excel / AXE Playbook / 기타 | Y |
| 상태값 정의 | multi-select | 대기 / 진행 중 / 검토 중 / 완료 / 보류 | Y |
| 우선순위 결정자 | participant-ref | - | Y |
| 고객 공동 관리 여부 | boolean | - | Y |

#### Task 5: 작업 시작 기준 정의
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 담당자 지정 필요 | boolean | - | Y |
| 요구사항 확인 필요 | boolean | - | Y |
| 환경·권한 준비 필요 | boolean | - | Y |
| 고객 승인자 확인 필요 | boolean | - | Y |
| 추가 시작 기준 | text | - | N |

#### Task 6: 작업 완료·검수 기준 정의
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 완료 기준 | multi-select | 내부 검토 완료 / 테스트 완료 / 고객 확인 완료 / 산출물 승인 완료 | Y |
| 반려 시 처리 방식 | single-select | 즉시 보완 / 다음 Sprint 반영 / 별도 협의 | Y |
| 보완 기한 기준 (일) | number | - | Y |

#### Task 7: 변경관리 연결 기준 정의
| 입력 항목 | 유형 | 선택지 | 필수 |
|-----------|------|--------|------|
| 작업 목록 내 조정 기준 | text | - | Y |
| 고객 협의 필요 기준 | text | - | Y |
| 공식 변경관리 기준 | text | - | Y |
| 계약변경 검토 기준 | text | - | N |

#### Task 8: 미확정 항목 정리
→ Open Item 등록 인터페이스로 연결 (Open Item 테이블에 저장)

---

### 5.2 A2 — 참여자 역할과 의사결정 구조

#### Task 1~2: 주요 참여자 및 역할 확인
→ Participant 테이블 직접 입력 (이름, 소속, 역할 유형, 핵심 책임, 연락처, 승인자 여부)

**필수 등록 역할 (미등록 시 경고)**
- 고객 PM
- 고객 최종 의사결정자 (Sponsor)
- 수행 PM
- 수행 PL

#### Task 3: 승인자·의사결정자 확인
| 의사결정 항목 | 입력 | 필수 |
|---------------|------|------|
| 요구사항 우선순위 결정자 | participant-ref | Y |
| 산출물 승인자 | participant-ref | Y |
| 범위 변경 승인자 | participant-ref | Y |
| 보안 예외 승인자 | participant-ref | 조건부 (공공/금융) |
| 오픈(Go-Live) 승인자 | participant-ref | 조건부 (본사업) |

#### Task 4: 상위 보고·의사결정 경로
| 이슈 유형 | 1차 조치 | 기준 기간 | 2차 보고 대상 |
|-----------|----------|-----------|---------------|
| 일정 지연 | (입력) | (일 단위 입력) | (participant-ref) |
| 범위 변경 요청 | (입력) | (입력) | (participant-ref) |
| 품질 미달 | (입력) | (입력) | (participant-ref) |
| 보안 이슈 | (입력) | (입력) | (participant-ref) |
| 담당자 부재 | (입력) | (입력) | (participant-ref) |

---

### 5.3 A3 — 커뮤니케이션 및 운영 리듬

#### Task 1~2: 보고체계 및 회의체
→ ReportingScheme 테이블에 행 단위 입력
→ 유형 선택 후 주기, 참석자, 산출물 형태 입력

**필수 등록 항목 (미등록 시 경고)**
- 주간보고 (또는 해당 없음 사유)
- Sprint Review

#### Task 3: Sprint Review와 공식 보고 연결
| 입력 항목 | 유형 | 필수 |
|-----------|------|------|
| Sprint Review 결과 반영 방식 | single-select (주간보고 반영 / 별도 보고 / 미연결) | Y |
| 고객 참석자 | participant-ref (multi) | Y |

#### Task 4~5: 의사결정 및 Action Item 관리 기준
| 입력 항목 | 유형 | 필수 |
|-----------|------|------|
| 의사결정 관리 방식 | single-select (Decision Log / 회의록 내 / 별도 목록) | Y |
| Action Item 관리 주체 | participant-ref | Y |
| 지연 기준 (일) | number | Y |
| 이슈 보고 기준 - 정상 | text | Y |
| 이슈 보고 기준 - 주의 | text | Y |
| 이슈 보고 기준 - 위험 | text | Y |

---

### 5.4 A4 — 산출물·검토·승인 기준

#### Task 1~5: 산출물 목록
→ Deliverable 테이블에 행 단위 입력

**계약 필수 산출물 기본 목록 제공** (프로젝트 유형별 프리셋):
- 사업수행계획서
- 요구사항 정의서
- 설계서 (아키텍처 설계, 상세 설계)
- 테스트 계획서 / 결과서
- 운영이관 계획서 (본사업만)
- 완료보고서

각 산출물마다 입력:
- 필수/조건부/선택/제외
- 제출 기준 (단계별/Sprint별/Gate별)
- 제출 예정일
- 검토자 (participant-ref)
- 승인자 (participant-ref)
- 검수 기준 (text)
- 반려 기준 (text)
- 보완 기한 (일)
- 저장 위치
- 버전 기준

---

### 5.5 A5 — 환경·도구·접근권한 준비상태

#### Task 1~6: 환경/도구/권한 항목
→ Resource 테이블에 행 단위 입력

**유형별 프리셋 항목 제공:**

| 유형 | 기본 항목 |
|------|-----------|
| TOOL | 협업도구, 문서관리, 이슈관리 (Jira 등), 소스관리 (Git 등), 테스트관리 |
| ENVIRONMENT | 개발 환경, 검증 환경, 운영 환경, Sandbox |
| ACCESS | 고객 시스템 접근, 내부망, VPN/VDI, 클라우드 콘솔 |
| REPOSITORY | 문서 저장소, 소스 저장소 |

각 항목마다 입력:
- Sprint 1 필수 여부 (boolean)
- 현재 상태 (READY / IN_PROGRESS / DELAYED / NOT_STARTED)
- 사용 가능 예정일
- 담당자 (participant-ref)
- 지연 시 우회방안 (text)

---

### 5.6 A6 — 고객 준비도·보안·리스크 점검

#### Task 1~3: 준비상태 확인 항목

| 점검 영역 | 점검 항목 | 입력 유형 |
|-----------|-----------|-----------|
| 고객 준비 | 고객 담당자 지정 여부 | boolean + participant-ref |
| 고객 준비 | 고객 승인자 지정 여부 | boolean + participant-ref |
| 고객 준비 | 고객 참여 가능 시간 충분성 | single-select (충분 / 부족 / 미확인) |
| 데이터 | 데이터 제공 일정 확인 | date + 제공방식 select |
| 데이터 | 마스킹 필요 여부 | boolean |
| 데이터 | 원천 데이터 접근 가능 여부 | boolean |
| 보안 | 보안교육 이수 기준 확인 | boolean |
| 보안 | 보안서약서 징구 기준 | boolean |
| 보안 | 자료 반출입 기준 확인 | boolean |
| 보안 | 망접속 기준 확인 | boolean |

#### Task 4~5: 리스크/이슈 등록
→ RiskIssue 테이블에 행 단위 입력

각 항목:
- 유형 (RISK / ISSUE / DECISION_NEEDED)
- 분류 (고객준비도 / 데이터 / 보안 / 일정 / 기타)
- 제목, 설명
- 영향도 / 발생가능성 (Risk만)
- Sprint 1 차단 여부 (boolean)
- 대응 전략
- 담당자, 기한

---

### 5.7 A7 — Sprint 1 실행준비 및 미정 항목 이관

A7은 입력 중심이 아닌 **집계 및 판정** 중심이다.

#### 자동 집계 표시 (입력 불필요, 시스템이 계산)

| 항목 | 집계 방식 |
|------|-----------|
| A1~A6 완료 상태 | 각 Activity의 필수 입력 항목 완료율로 COMPLETE / PARTIAL / INCOMPLETE 자동 판정 |
| Open Item 총계 | 전체 / BLOCKER / CONDITIONAL / RESOLVED 건수 |
| Sprint 1 필수 미완료 자원 | Resource.is_sprint1_required = true & status != READY인 항목 |
| 고위험 차단 항목 | RiskIssue.sprint1_blocking = true & status = OPEN인 항목 |
| 승인자 미정 산출물 | Deliverable.approver_id가 없거나 TBD인 항목 |

#### 시스템 자동 제안 판정 로직

```
if (BLOCKER Open Item > 0 OR sprint1_blocking Risk > 0):
  suggest = CONFIRM_BEFORE_START
elif (CONDITIONAL Open Item > 0 OR sprint1_required Resource not READY > 0):
  suggest = CONDITIONAL_START
else:
  suggest = NORMAL_START
```

#### PM 최종 입력

| 입력 항목 | 유형 | 필수 |
|-----------|------|------|
| 최종 판정 | single-select (정상 시작 / 조건부 시작 / 범위 조정 후 시작 / 시작 전 확인 필요) | Y |
| 판정 근거 | text | Y |
| 확인자 | participant-ref | Y |

#### 미정 항목 이관 확인
→ status = OPEN인 Open Item 목록 표시
→ 각 항목에 이관 대상 선택 (SPRINT1 / NEXT_ACTIVITY / PROJECT_PLAN / CUSTOMER_ACTION)

---

## 6. 자동 생성 출력물

### 6.1 사업수행계획서 챕터별 정리표

Sprint 0 Working System에 입력된 데이터를 챕터별로 자동 매핑하여 초안 형태로 출력한다.

| 챕터 | 소스 Activity | 주요 데이터 |
|------|--------------|-------------|
| 4. 사업 범위 | A4, A6 | 필수 산출물, 고객 준비도 |
| 5. 사업 추진 체계 | A2 | 참여자, 역할, 책임 범위, 승인 구조 |
| 6. 사업 추진 절차 | A1 | 수행모델, Sprint 운영 기준 |
| 7. 산출물 계획 | A4 | 산출물 목록, 제출 기준, 승인자 |
| 8. 일정 계획 | A1, A3, A5 | Sprint 주기, 보고 주기, 환경 준비일 |
| 10. 변경관리 계획 | A1 | 변경관리 연결 기준 |
| 11. 품질관리 계획 | A1, A4 | 완료 기준, 검수 기준 |
| 12. 인력관리 계획 | A2 | 참여자 목록 |
| 13. 의사소통관리 계획 | A2, A3 | 보고체계, 회의체, 의사결정 경로 |
| 14. 위험관리 계획 | A6 | 리스크/이슈 목록 |
| 15. 형상관리 계획 | A4, A5 | 저장소, 버전 기준 |
| 18. 보안 대책 | A5, A6 | 접근권한 기준, 보안 점검 결과 |

출력 형태: HTML 또는 Excel 다운로드

### 6.2 Sprint 1 실행준비 결과서

A7 판정 결과 + Open Item 이관 목록 + 조건부 항목 목록을 1페이지 형태로 자동 생성.

포함 항목:
- 프로젝트명, 판정일, 판정자
- Sprint 1 시작 방식 (판정 결과)
- 판정 근거
- 조건부 진행 항목 목록 (담당, 기한 포함)
- 시작 전 확인 필요 항목 목록
- 이관된 Open Item 목록

출력 형태: HTML 인쇄 / PDF 다운로드

### 6.3 Open Item 이관 목록

status = TRANSFERRED인 항목을 이관 대상별로 정리한 목록.

---

## 7. 사용자 흐름 (User Flow)

### 7.1 기본 흐름

```
[프로젝트 생성]
  → 기본 정보 입력 (프로젝트명, 유형, 일정)
  → Sprint 0 대시보드 진입

[A1 수행]
  → Playbook 참고 링크 제공 (Read-only Playbook 탭 연결)
  → Task별 입력 인터페이스
  → Open Item 등록
  → A1 이행 확인 체크리스트 셀프 체크
  → A1 완료 처리

[A2~A6 순차 수행]
  → 동일 패턴 반복
  → 참여자 정보는 A2에서 등록 후 이후 Activity에서 재사용

[A7 종합 판정]
  → 집계 현황 자동 표시
  → Open Item 이관 처리
  → PM 최종 판정 입력
  → 결과서 자동 생성
```

### 7.2 Activity 화면 구조

```
┌─────────────────────────────────────────────────────────┐
│  [상단] 진행 현황 바 (A1~A7 완료 상태)                  │
├─────────────────────────────────────────────────────────┤
│  [좌측] Playbook 패널 (Read-only, 접이식)               │
│  — 현재 Task의 Playbook 가이드 표시                     │
├─────────────────────────────────────────────────────────┤
│  [우측] 입력 패널                                       │
│  — Task별 탭                                            │
│  — 각 Task 입력 폼                                      │
│  — Open Item 등록 버튼                                  │
│  — 이행 확인 체크리스트 (하단)                          │
│  — 완료 처리 버튼                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 8. 기술 요구사항

### 8.1 아키텍처 방향

| 항목 | 결정 |
|------|------|
| 클라이언트 | Web App (React 또는 Vanilla TS) |
| 데이터 저장 | LocalStorage (v1.0 MVP) → 서버 DB (v2.0) |
| 인증 | 불필요 (v1.0), 단일 PM이 로컬에서 운용 |
| 배포 | 정적 파일 배포 (GitHub Pages 또는 내부 서버) |
| 데이터 내보내기 | JSON Export / HTML 출력 / PDF (인쇄) |

> v1.0은 서버 없는 완전 정적 구현으로 시작. DB와 인증은 v2.0에서 추가.

### 8.2 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 응답성 | 모든 입력 반응 100ms 이내 |
| 데이터 보존 | 브라우저 재시작 후에도 입력 데이터 유지 (LocalStorage) |
| 한글 처리 | UTF-8 전용, 모든 입력·출력 한글 정상 처리 |
| 접근성 | 키보드 탐색 가능 (최소한 Tab 이동) |
| 화면 크기 | 1280px 이상 랩탑 기준 최적화 |

---

## 9. 제약 및 전제

- Sprint 0 Playbook(Read-only HTML)은 별도로 유지하며 Working System에서 참조 링크로 연결한다.
- v1.0에서는 다중 사용자 동시 편집을 지원하지 않는다.
- 사업수행계획서 자동 생성은 챕터별 정리표 형태이며, KT 공식 양식과의 완전한 일치는 v2.0 목표다.
- 프로젝트 유형(6종)에 따라 일부 입력 항목이 숨겨지거나 필수로 변경된다.

---

## 10. 마일스톤 (안)

| 단계 | 내용 | 산출물 |
|------|------|--------|
| M1 | 데이터 모델 확정 + 프로젝트 생성 + A1 입력 구현 | A1 Working 화면 |
| M2 | A2~A4 입력 구현 + 참여자 재사용 | A1~A4 Working 화면 |
| M3 | A5~A6 입력 구현 + Open Item 관리 | A5~A6 Working 화면 |
| M4 | A7 집계·판정 + 결과서 자동 생성 | A7 판정 화면 + 결과서 |
| M5 | 사업수행계획서 챕터 정리표 자동 생성 + JSON Export | 완성 MVP |

---

## Appendix A. 데이터 연결 맵

```
Project Profile
  └─ 프로젝트 유형 → 산출물 프리셋 결정 (A4)
  └─ 규제 특성 Tag → 보안 점검 필수 항목 결정 (A6)

A1 결정사항
  └─ Sprint 주기 → A3 회의체 주기 기본값
  └─ Sprint 종료/시작 기준 → A7 판정 근거 참고
  └─ 작업 완료 기준 → A4 검수 기준 참고

A2 참여자
  └─ 역할별 참여자 → A3 회의 참석자 선택지
  └─ 승인자 목록 → A4 산출물 승인자 선택지
  └─ 의사결정 경로 → A7 확인자 선택지

A4 산출물
  └─ 승인자 → A7 승인자 미정 여부 집계

A5 Resource
  └─ is_sprint1_required + status → A7 미완료 자원 집계

A6 RiskIssue
  └─ sprint1_blocking → A7 고위험 차단 항목 집계

Open Items (전체)
  └─ sprint1_impact = BLOCKER → A7 자동 판정에 반영
  └─ transfer_to → A7 이관 처리
```

---

## Appendix B. 용어 정의

| 용어 | 정의 |
|------|------|
| Sprint 0 | 프로젝트 본수행 착수 전 준비 단계. 계약 이후, Sprint 1 시작 전까지의 기간 |
| Working System | PM이 실제 입력·선택·확인을 하는 데이터 관리 시스템 (이 PRD의 대상) |
| Open Item | Sprint 0 중 결정되지 않은 미정 항목. 담당자, 기한, Sprint 1 영향도를 반드시 포함 |
| BLOCKER | Sprint 1 시작을 막는 Open Item. 해소 전까지 Sprint 1 시작 불가 |
| CONDITIONAL | Sprint 1 시작 가능하지만 기한 내 해소 조건이 붙은 Open Item |
| Playbook | Read-only 가이드. Working System과 별도로 존재하며 참조 용도 |
| 판정 (Verdict) | A7에서 PM이 내리는 Sprint 1 시작 방식 결정. 정상/조건부/범위조정후/확인필요 |
