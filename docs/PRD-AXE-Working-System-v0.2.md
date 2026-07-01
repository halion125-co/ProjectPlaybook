# PRD: AXE Delivery Way — Project Working System
**Version:** 0.2
**Date:** 2026-07-01
**Author:** KT AXE Delivery Way Team
**Based on:** Sprint 0 Playbook (A1~A7 TASK_GUIDE 원문 전수 검토)

---

## 1. 배경 및 목적

### 1.1 배경

Sprint 0 Playbook은 초보 PM이 프로젝트 초기 단계에 실제 프로젝트를 수행할 수 있는 수준을 준비하기 위한 Read-only 가이드다. 그러나 Playbook만으로는 한계가 있다. PM이 Playbook을 보면서 회의에서 결정한 내용, 확인한 사항, 미정 항목(Open Item)이 어딘가에 기록되어야 하고, 그 기록이 실제 프로젝트 수행의 기준이 되어야 한다.

현재는 결정 내용이 회의록, 메모, 별도 문서에 흩어지고, Sprint 0에서 만든 기준이 본수행에서 제대로 이어지지 않는 문제가 반복된다.

### 1.2 목적

Sprint 0 Playbook의 각 Activity를 수행하면서 PM이 직접 입력하고 선택한 정보가 연속성 있게 쌓이고, 그 정보가 Sprint 1 이후 본수행의 기준이 되는 **Working System**을 구축한다.

- Playbook은 가이드(Read-only)로 유지
- Working System은 실제 입력·선택·확인이 이루어지는 별도 레이어
- Working System의 데이터가 사업수행계획서 초안, Sprint 1 준비 결과서, Open Item 이관 목록 등으로 자동 생성된다

### 1.3 목표 사용자

| 사용자 | 설명 |
|--------|------|
| 주 사용자 | 초보~중급 PM. Sprint 0 수행 중 Playbook을 참고하며 결정 내용을 입력 |
| 참조 사용자 | PL, QA, 고객 PM이 결정 사항을 확인하거나 이관 항목을 추적 |
| 관리 사용자 | AXE 방법론 담당자가 양식 기준, 판정 기준을 관리 |

---

## 2. 문제 정의

| # | 문제 | 영향 |
|---|------|------|
| 1 | Sprint 0 결정 내용(수행모델, Sprint 주기, 승인자 등)이 회의록·메모에 흩어짐 | 본수행에서 기준이 불명확해져 재결정 필요 |
| 2 | 미정 항목(Open Item)이 제대로 이관되지 않음 | Sprint 1 착수 후 갑작스러운 지연 발생 |
| 3 | A1~A6의 결정사항이 A7에서 수작업으로 재정리 필요 | A7 판정의 근거가 부실하거나 누락 |
| 4 | 사업수행계획서 작성이 별도 작업으로 분리되어 Sprint 0 산출물과 연계 안 됨 | 중복 작업, 기준 불일치 |
| 5 | PM이 결정 내용을 어디에 기록할지 몰라 결국 기록 안 함 | Playbook이 실제 수행에 영향을 못 미침 |

---

## 3. 범위

### In-Scope (v1.0)
- 프로젝트 기본 정보 등록
- Sprint 0 전 구간 (A1~A7) Task별 데이터 입력 및 저장
- Open Item 등록·추적·이관
- A7 Sprint 1 시작 방식 자동 집계 + PM 판정
- 사업수행계획서 챕터별 정리표 자동 생성
- Sprint 1 실행준비 결과서 자동 생성

### Out-of-Scope (v1.0)
- Sprint 1 이후 본수행 진행 관리 (Sprint Backlog, Velocity 등)
- 실시간 협업·알림
- 외부 시스템 연동 (Jira, Confluence, 사내 그룹웨어)
- 모바일 최적화 / 다국어 지원

---

## 4. 핵심 데이터 모델

### 4.1 프로젝트 기본 정보 (ProjectProfile)

Sprint 0 시작 전 한 번 입력. 모든 Activity의 컨텍스트를 구성한다.

```
ProjectProfile {
  project_id           : UUID
  project_name         : string     // 프로젝트명
  contract_date        : date       // 계약일
  sprint0_start_date   : date       // Sprint 0 시작일
  sprint0_end_date     : date       // Sprint 0 완료 예정일
  sprint1_target_date  : date       // Sprint 1 목표 시작일
  project_type         : enum       // POC_GENERAL | POC_PUBLIC | POC_FINANCE
                                    // PROD_GENERAL | PROD_PUBLIC | PROD_FINANCE
  customer_org         : string     // 고객 기관명
  axe_pm_name          : string     // 수행 PM 이름
  created_at           : datetime
  updated_at           : datetime
}
```

### 4.2 참여자 (Participant)

A2에서 등록. 이후 모든 Activity에서 승인자·담당자·보고 대상 선택 시 참조된다.

```
Participant {
  participant_id    : UUID
  project_id        : UUID
  name              : string
  organization      : string     // 고객 | 수행 | 협력사 | 지원조직
  role_type         : enum       // CUSTOMER_PM | CUSTOMER_SPONSOR | CUSTOMER_IT_LEAD
                                 // CUSTOMER_BIZ | CUSTOMER_SECURITY | CUSTOMER_INFRA
                                 // AXE_PM | AXE_PL | AXE_QA | AXE_TECH
                                 // PARTNER | OTHER
  responsibilities  : string     // 핵심 책임 범위 (자유 텍스트)
  join_timing       : string     // 참여 시점 (예: "Sprint 0부터", "Sprint 1 착수 후")
  contact_channel   : string     // 연락처 또는 채널 (이메일, 메신저 등)
  is_approver       : boolean    // 승인자 여부
  status            : enum       // CONFIRMED | TBD
  created_at        : datetime
}
```

### 4.3 역할별 의사결정 매핑 (DecisionAuthority)

A2 Task 3에서 등록. "어떤 결정 항목을 누가 결정하는가"를 구조화한다.

```
DecisionAuthority {
  authority_id      : UUID
  project_id        : UUID
  decision_topic    : enum       // REQUIREMENT_PRIORITY | DELIVERABLE_APPROVAL
                                 // SCOPE_CHANGE | SECURITY_EXCEPTION | GO_LIVE
                                 // OTHER
  decision_topic_custom : string | null   // OTHER 선택 시 직접 입력
  decider_id        : participant_id      // 결정자
  reviewer_id       : participant_id | null   // 검토자
  consultation_ids  : [participant_id]    // 협의 대상
  escalation_id     : participant_id | null   // 지연 시 상위 보고 대상
  status            : enum       // CONFIRMED | TBD
}
```

### 4.4 이슈 보고 경로 (EscalationPath)

A2 Task 4에서 등록. 이슈 유형별 1차 조치·기준 기간·보고 대상을 구조화한다.

```
EscalationPath {
  path_id           : UUID
  project_id        : UUID
  issue_type        : enum       // SCHEDULE_DELAY | SCOPE_CHANGE | QUALITY_ISSUE
                                 // SECURITY_ISSUE | PERSONNEL_ABSENCE | OTHER
  issue_type_custom : string | null
  first_action      : string     // 1차 조치 내용
  threshold_days    : integer    // 기준 기간 (일)
  escalate_to_id    : participant_id   // 2차 보고 대상
  final_decider_id  : participant_id   // 최종 의사결정자
}
```

### 4.5 보고체계 및 회의체 (CommunicationScheme)

A3에서 등록. 운영 리듬 전체를 구조화한다.

```
CommunicationScheme {
  scheme_id         : UUID
  project_id        : UUID
  type              : enum       // WEEKLY_REPORT | MONTHLY_REPORT | ADHOC_REPORT
                                 // SPRINT_REVIEW | QUALITY_CHECK | STEERING
                                 // ISSUE_MEETING | OTHER
  type_custom       : string | null
  purpose           : string     // 회의/보고 목적
  frequency         : string     // "매주 금요일", "Sprint 완료 후 1일 이내" 등
  attendee_ids      : [participant_id]
  owner_id          : participant_id   // 운영 책임자
  output_format     : string     // 산출물 형태 (예: 회의록, 주간보고 양식)
  connected_report  : string | null  // 연결된 공식 보고 (예: 주간보고에 반영)
  created_at        : datetime
}
```

### 4.6 의사결정 관리 기준 (DecisionManagement)

A3 Task 4에서 등록. 결정 지연 추적 기준을 단일 레코드로 관리한다.

```
DecisionManagement {
  project_id         : UUID
  management_method  : enum      // DECISION_LOG | MEETING_MINUTES | SEPARATE_LIST
  action_item_owner  : participant_id   // Action Item 관리 주체
  delay_threshold_days : integer // 지연 기준 (일)
  status_normal      : string    // 정상 기준 정의
  status_caution     : string    // 주의 기준 정의
  status_danger      : string    // 위험 기준 정의
  sprint_review_connection : enum  // WEEKLY_REPORT | SEPARATE_REPORT | NOT_CONNECTED
  sprint_review_attendee_ids : [participant_id]
}
```

### 4.7 산출물 (Deliverable)

A4에서 등록. 산출물별 제출 기한·검토자·승인자·검수 기준·저장 위치를 관리한다.

```
Deliverable {
  deliverable_id      : UUID
  project_id          : UUID
  name                : string
  category            : enum     // MANDATORY | CONDITIONAL | OPTIONAL | EXCLUDED
  exclusion_reason    : string | null
  submit_basis        : enum     // BY_PHASE | BY_SPRINT | BY_GATE
  due_date            : date
  customer_review_days : integer  // 고객 검토 기간 (일)
  reviewer_id         : participant_id
  approver_id         : participant_id | null
  acceptance_criteria : string   // 검수·수용 기준
  rejection_criteria  : string   // 반려 기준
  revision_days       : integer  // 보완 기한 (일)
  storage_location    : string   // 저장 위치
  filename_rule       : string   // 파일명 규칙 (예: PROJ_설계서_v1.0)
  version_rule        : string   // 버전 기준 (예: v0.1 단위 관리)
  status              : enum     // PENDING | SUBMITTED | APPROVED | REJECTED | REVISED
  created_at          : datetime
}
```

### 4.8 환경·도구·권한·저장소 (Resource)

A5에서 등록. Sprint 1 시작 가능 여부 판단에 직접 영향을 준다.

```
Resource {
  resource_id          : UUID
  project_id           : UUID
  type                 : enum    // TOOL | ENVIRONMENT | ACCESS | REPOSITORY | ONBOARDING
  name                 : string
  is_sprint1_required  : boolean // Sprint 1 필수 여부
  ready_date           : date | null
  status               : enum    // READY | IN_PROGRESS | DELAYED | NOT_STARTED
  workaround           : string | null   // 지연 시 우회방안
  owner_id             : participant_id
  created_at           : datetime
}
```

> ONBOARDING 유형: A5 Task 6의 투입 준비 항목(출입증·상주 등록, 비상연락망, 협업도구 접근)을 담음.

### 4.9 고객·데이터·보안 준비상태 (ReadinessCheck)

A6 Task 1~3에서 등록. 준비상태를 5단계로 관리한다.

```
ReadinessCheck {
  check_id      : UUID
  project_id    : UUID
  area          : enum      // CUSTOMER | DATA | SECURITY
  item          : string    // 점검 항목명
  status        : enum      // DONE | IN_PROGRESS | DELAYED | NOT_STARTED | NOT_APPLICABLE
  owner_id      : participant_id | null
  due_date      : date | null
  note          : string | null
  sprint1_impact : enum     // NONE | CONDITIONAL | BLOCKER
}
```

### 4.10 리스크/이슈 (RiskIssue)

A6 Task 4~5에서 등록.

```
RiskIssue {
  risk_issue_id    : UUID
  project_id       : UUID
  type             : enum    // RISK | ISSUE | DECISION_NEEDED
  category         : enum    // CUSTOMER_READINESS | DATA | SECURITY | SCHEDULE | OTHER
  title            : string
  description      : string
  probability      : enum | null   // HIGH | MEDIUM | LOW  (RISK만 해당)
  impact           : enum          // HIGH | MEDIUM | LOW
  sprint1_blocking : boolean
  mitigation       : string        // 대응 전략
  owner_id         : participant_id
  due_date         : date
  status           : enum    // OPEN | MITIGATING | CLOSED
  created_at       : datetime
}
```

### 4.11 Open Item (미정 항목)

모든 Activity에서 등록 가능. 담당자·기한·Sprint 1 영향도·이관 대상을 필수로 기록한다.

```
OpenItem {
  open_item_id    : UUID
  project_id      : UUID
  source_activity : enum     // A1 | A2 | A3 | A4 | A5 | A6 | A7
  source_task_no  : integer
  title           : string
  description     : string
  owner_id        : participant_id
  due_date        : date
  sprint1_impact  : enum     // NONE | CONDITIONAL | BLOCKER
  transfer_to     : enum     // SPRINT1 | NEXT_ACTIVITY | PROJECT_PLAN | CUSTOMER_ACTION
  status          : enum     // OPEN | IN_PROGRESS | RESOLVED | TRANSFERRED
  resolved_at     : date | null
  resolution_note : string | null
  created_at      : datetime
  updated_at      : datetime
}
```

### 4.12 Sprint 1 실행준비 판정 (Sprint1Readiness)

A7에서 자동 집계 후 PM이 최종 확정한다.

```
Sprint1Readiness {
  readiness_id        : UUID
  project_id          : UUID
  activity_completion : {         // A1~A6 자동 집계
    a1: enum, a2: enum, a3: enum,
    a4: enum, a5: enum, a6: enum  // COMPLETE | PARTIAL | INCOMPLETE
  }
  blocker_open_items      : integer   // sprint1_impact = BLOCKER인 OpenItem 수
  conditional_open_items  : integer   // sprint1_impact = CONDITIONAL인 OpenItem 수
  resource_not_ready      : integer   // is_sprint1_required=true & status!=READY인 Resource 수
  blocking_risks          : integer   // sprint1_blocking=true & status=OPEN인 RiskIssue 수
  readiness_check_blockers : integer  // ReadinessCheck.sprint1_impact = BLOCKER인 항목 수
  deliverable_no_approver : integer   // Deliverable.approver_id = null/TBD인 필수 산출물 수
  system_suggestion       : enum      // NORMAL_START | CONDITIONAL_START
                                      // SCOPE_ADJUSTED_START | CONFIRM_BEFORE_START
  pm_verdict              : enum      // PM 최종 확정 (동일 enum)
  verdict_rationale       : string
  confirmed_at            : datetime
  confirmed_by            : participant_id
}
```

---

## 5. Activity별 입력 항목 전체 명세

> 각 Task 화면에는 Playbook 원문의 **prep(준비자료)**과 **example(PM 진행 예시)**이 힌트 패널로 표시된다.
> 입력 유형 범례: `single-select` `multi-select` `text` `number` `date` `boolean` `participant-ref`

---

### 5.1 A1 — 수행방식 및 Sprint 운영 기준 정렬

#### Task 1: 프로젝트 유형과 특성 Tag 확인

**힌트 패널 — 준비자료:** 계약서, 제안서, 과업범위, 고객사 정보
**힌트 패널 — 예시 질문:** "이 프로젝트는 PoC인가, 본사업인가? / 일반AX·공공AX·금융AX 중 어디에 해당하는가?"

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 프로젝트 유형 | single-select | PoC / 본사업 | Y |
| 규제 특성 Tag | multi-select | 일반AX / 공공AX / 금융AX | Y |
| 추가 점검 필요 항목 | text | 특성 Tag에 따른 추가 확인 항목 메모 | N |

**판단기준 (화면 내 표시):**
- PoC: 검증 중심
- 본사업: 구축·운영전환 중심
- 공공AX: 감리·인증 중심
- 금융AX: 금융보안·감사·데이터 통제 중심

---

#### Task 2: 수행모델 결정

**힌트 패널 — 준비자료:** AXD 방법론, 프로젝트 일정, 고객 업무 방식, 개발 범위

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 수행모델 | single-select | AXD 단계형 / Hybrid / Sprint 중심 | Y |
| 선택 사유 | text | 왜 이 모델을 선택했는가 | Y |
| 고객 합의 여부 | single-select | 합의 완료 / 협의 중 / 미확인 | Y |

**판단기준:**
- 요구사항이 명확하고 산출물 중심 → 단계형
- 변경 가능성이 높고 반복 검증 필요 → Sprint 중심
- 공식 산출물 + 반복 개발 모두 필요 → Hybrid

---

#### Task 3: Sprint 운영 기준 결정

**힌트 패널 — 준비자료:** 전체 일정, 주요 마일스톤, 팀 투입 계획

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| Sprint 주기 | single-select | 1주 / 2주 / 3주 / 기타 | Y |
| Sprint 주기 직접 입력 | text | 기타 선택 시 활성화 | 조건부 |
| Review 방식 | single-select | 내부 Review / 고객 포함 Review | Y |
| Sprint 1 시작 가능성 | single-select | 가능 / 조건부 / 보류 | Y |
| Sprint 종료 기준 | text | 무엇이 충족되면 Sprint를 끝낼 수 있는가 | Y |
| 다음 Sprint 시작 기준 | text | 무엇이 준비되어야 다음 Sprint를 시작할 수 있는가 | Y |
| Backlog 정제 주기 | single-select | 매 Sprint 중반 / Sprint 시작 전 / 별도 미정 | Y |

**판단기준:**
- 팀 규모 작고 PoC → 1주 가능
- 본사업 → 2주 단위 권장
- 고객 피드백 중요 → 고객 포함 Review 필요

---

#### Task 4: 작업 목록 관리 방식 결정

**힌트 패널 — 준비자료:** 요구사항, 초기 작업 목록, 관리 도구 후보

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 관리 도구 | single-select | Jira / Excel / AXE Playbook / 기타 | Y |
| 관리 도구 직접 입력 | text | 기타 선택 시 활성화 | 조건부 |
| 상태값 정의 | multi-select | 대기 / 준비됨 / 진행중 / 검토중 / 완료 / 보류 | Y |
| 우선순위 결정자 | participant-ref | - | Y |
| 고객 공동 관리 여부 | boolean | - | Y |

**판단기준:**
- 고객과 공동 관리 필요 → Jira / Playbook
- PoC나 소규모 → Excel 가능
- 변경 빈도 높음 → 상태값·우선순위 기준 필수

---

#### Task 5: 작업 시작 기준 정의

**힌트 패널 — 준비자료:** 초기 작업 목록, 요구사항, 환경·권한 상태

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 담당자 지정 필요 | boolean | - | Y |
| 요구사항 확인 필요 | boolean | - | Y |
| 환경·권한 준비 필요 | boolean | - | Y |
| 고객 승인자 확인 필요 | boolean | - | Y |
| 추가 시작 기준 | text | 위 항목 외 프로젝트 특수 조건 | N |
| 시작 불가 항목 처리 방식 | text | 필수 조건 미충족 시 어떻게 처리할 것인가 | Y |

---

#### Task 6: 작업 완료·검수 기준 정의

**힌트 패널 — 준비자료:** 산출물 목록, 요구사항, 고객 검수 기준

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 완료 기준 | multi-select | 내부 검토 완료 / 테스트 완료 / 고객 확인 완료 / 산출물 승인 완료 | Y |
| 반려 시 처리 방식 | single-select | 즉시 보완 / 다음 Sprint 반영 / 별도 협의 | Y |
| 보완 기한 (일) | number | 반려 후 보완 완료까지 기준 일수 | Y |

**판단기준:**
- 고객 검수 대상 작업 → 고객 확인 필수
- 기술 작업 → 테스트 또는 리뷰 기준
- 산출물 → 승인 기준 필수

---

#### Task 7: 변경관리 연결 기준 정의

**힌트 패널 — 준비자료:** 계약 범위, 과업 범위, 변경관리 기준

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 작업 목록 내 조정 기준 | text | 공식 변경관리 없이 조정 가능한 범위 | Y |
| 고객 협의 필요 기준 | text | 고객과 협의가 필요한 변경의 기준 | Y |
| 공식 변경관리 필요 기준 | text | 일정·범위·비용 영향이 있는 변경의 기준 | Y |
| 계약변경 검토 기준 | text | 계약 범위를 벗어나는 변경의 기준 | N |

---

#### Task 8: 미확정 항목 정리

→ Open Item 등록 인터페이스로 연결
→ 이 Task에서 등록된 Open Item은 `source_activity = A1`으로 저장

---

### 5.2 A2 — 참여자 역할과 의사결정 구조 확인

#### Task 1: 주요 참여자 확인

**힌트 패널 — 준비자료:** 제안서의 투입 조직 및 참여 인력 목록, 고객 조직도와 프로젝트 담당자 목록

→ Participant 테이블에 행 단위 입력

**각 참여자마다 입력:**

| 필드 | 유형 | 필수 |
|------|------|------|
| 이름 또는 부서명 | text | Y |
| 소속 구분 | single-select (고객 / 수행 / 협력사 / 지원조직) | Y |
| 역할 유형 | single-select (아래 목록) | Y |
| 핵심 책임 범위 | text | Y |
| 참여 시점 | text | Y |
| 연락처·채널 | text | Y |
| 승인자 여부 | boolean | Y |
| 확정 여부 | single-select (확정 / 미정) | Y |

**역할 유형 목록:** 고객 PM / 고객 의사결정 책임자(Sponsor) / 고객 업무 담당자 / 고객 IT Lead / 고객 보안 담당자 / 고객 인프라 담당자 / 고객 운영 담당자 / 수행 PM / 수행 PL·Tech Lead / 수행 QA / 수행 기술 담당자 / 협력사 담당자 / 기타

**필수 등록 역할 (미등록 시 경고):**
- 고객 PM
- 고객 최종 의사결정자 (Sponsor)
- 수행 PM
- 수행 PL

---

#### Task 2: 역할별 책임 범위 확인

**힌트 패널 — 준비자료:** 역할별 책임 범위 초안, 고객 조직도

→ Task 1에서 등록한 참여자별로 추가 정보를 보완하는 형태로 운영
→ 별도 입력 항목: **중복 책임 항목**, **비어 있는 책임 영역** 메모 (text, N)

**판단기준:**
- 작업 단위 역할표 작성하지 않음 (개별 작업 담당자는 Sprint 작업 목록에서 별도 관리)
- 필수 책임 영역 공백 → Open Item 등록 유도

---

#### Task 3: 승인자·의사결정자 확인

**힌트 패널 — 준비자료:** 산출물 목록과 승인 필요 항목, 변경관리 기준

→ DecisionAuthority 테이블에 행 단위 입력

**기본 제공 결정 항목:**

| 결정 항목 | 필수 여부 | 조건 |
|-----------|-----------|------|
| 요구사항 우선순위 결정 | Y | - |
| 산출물 승인 | Y | - |
| 범위 변경 승인 | Y | - |
| 보안 예외 승인 | 조건부 | 공공AX / 금융AX |
| 오픈(Go-Live) 승인 | 조건부 | 본사업 |

각 항목마다: 결정자(participant-ref) / 검토자(participant-ref) / 협의 대상(multi participant-ref) / 지연 시 상위 보고 대상(participant-ref)

**+ 커스텀 항목 추가 가능**

---

#### Task 4: 상위 보고·의사결정 경로 확인

**힌트 패널 — 준비자료:** 이슈 유형별 과거 처리 사례

→ EscalationPath 테이블에 행 단위 입력

**기본 제공 이슈 유형:**

| 이슈 유형 | 1차 조치 | 기준 기간 (일) | 2차 보고 대상 | 최종 결정자 |
|-----------|----------|----------------|---------------|------------|
| 일정 지연 | (입력) | (number) | (participant-ref) | (participant-ref) |
| 범위 변경 요청 | (입력) | (number) | (participant-ref) | (participant-ref) |
| 품질 미달 | (입력) | (number) | (participant-ref) | (participant-ref) |
| 보안 이슈 | (입력) | (number) | (participant-ref) | (participant-ref) |
| 담당자 부재 | (입력) | (number) | (participant-ref) | (participant-ref) |

**+ 커스텀 이슈 유형 추가 가능**

---

#### Task 5: 미확정 항목 및 Sprint 1 시작 영향 정리

→ Open Item 등록 인터페이스 (`source_activity = A2`)

**Sprint 1 영향 판단 기준 (화면 내 표시):**
- 담당자·기한 있음 → CONDITIONAL
- 핵심 승인자·결정자 없음 → BLOCKER

---

#### Task 6: 협력사 참여 시 책임 경계 확인

**힌트 패널 — 준비자료:** 협력사 계약·과업 범위, 협력사 조직도

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 협력사 참여 여부 | single-select | 없음 / 단일 협력사 / 다수 협력사 | Y |
| 협력사별 업무 범위 | text (협력사당 1행) | - | 조건부 |
| 협력사 산출물 검토자 | participant-ref | - | 조건부 |
| 협력사 이슈 보고 경로 | text | - | 조건부 |

---

### 5.3 A3 — 커뮤니케이션 및 운영 리듬 수립

#### Task 1: 보고 주기와 대상 정리

**힌트 패널 — 준비자료:** 고객 보고 요구사항 및 공식 공문 처리 기준, Sprint 일정과 주요 마일스톤

→ CommunicationScheme 테이블에 행 단위 입력 (type = 보고 유형)

**각 보고 항목마다 입력:**

| 필드 | 유형 | 필수 |
|------|------|------|
| 보고 유형 | single-select (주간보고 / 월간보고 / 수시보고 / 기타) | Y |
| 보고 대상 | multi participant-ref | Y |
| 보고 주기 | text (예: 매주 금요일 오후 2시) | Y |
| 보고 양식 | text (예: KT 주간보고 양식, PPT 등) | Y |
| 운영 책임자 | participant-ref | Y |

**필수 등록 (미등록 시 경고):** 주간보고 (또는 해당 없음 사유 입력)

---

#### Task 2: 회의체 정리

**힌트 패널 — 준비자료:** 기존 AXD 의사소통관리 계획표, 품질점검·감리·CCB 등 필수 회의 일정

→ CommunicationScheme 테이블에 행 단위 입력 (type = 회의체 유형)

**각 회의체마다 입력:**

| 필드 | 유형 | 필수 |
|------|------|------|
| 회의체 유형 | single-select (Sprint Review / 품질점검회의 / 쟁점회의 / Steering Committee / 기타) | Y |
| 회의 목적 | text | Y |
| 주기 | text | Y |
| 참석자 | multi participant-ref | Y |
| 산출물 형태 | text (예: 회의록, 결과 보고서) | Y |
| 운영 책임자 | participant-ref | Y |

**필수 등록:** Sprint Review

---

#### Task 3: Sprint Review와 공식 보고 연결

**힌트 패널 — 준비자료:** Sprint 일정, 고객/수행팀 핵심 인력의 참석 가능 시간

→ DecisionManagement.sprint_review_connection 및 attendee_ids 입력

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| Sprint Review 결과 보고 연결 | single-select | 주간보고 반영 / 별도 보고 / 미연결 | Y |
| 고객 참석자 | multi participant-ref | - | Y |

---

#### Task 4: 의사결정 관리 기준 정리

**힌트 패널 — 준비자료:** 기존 Decision Log 양식, 주요 의사결정 항목 후보

→ DecisionManagement 레코드에 저장

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| 결정 항목 관리 방식 | single-select | Decision Log / 회의록 내 기록 / 별도 목록 | Y |

---

#### Task 5: Action Item 관리 기준 정리

**힌트 패널 — 준비자료:** 회의록 작성 기준, 기존 Action Item 관리 방식

→ DecisionManagement 레코드에 저장

| 입력 항목 | 유형 | 선택지 / 설명 | 필수 |
|-----------|------|---------------|------|
| Action Item 관리 주체 | participant-ref | - | Y |
| 지연 기준 (일) | number | N일 이상 미처리 시 PM 알림 | Y |
| 이슈 보고 기준 — 정상 | text | 정상 상태 정의 | Y |
| 이슈 보고 기준 — 주의 | text | 주의 상태 정의 | Y |
| 이슈 보고 기준 — 위험 | text | 위험 상태 정의 | Y |

---

### 5.4 A4 — 산출물·검토·승인 기준 정렬

→ Deliverable 테이블에 행 단위 입력. 프로젝트 유형별 프리셋 목록 자동 제공.

**프로젝트 유형별 프리셋:**

| 산출물 | PoC | 본사업 |
|--------|-----|--------|
| 사업수행계획서 | 필수 | 필수 |
| 요구사항 정의서 | 필수 | 필수 |
| 아키텍처 설계서 | 조건부 | 필수 |
| 상세 설계서 | 조건부 | 필수 |
| 테스트 계획서 | 조건부 | 필수 |
| 테스트 결과서 | 조건부 | 필수 |
| 운영이관 계획서 | 해당없음 | 필수 |
| 완료보고서 | 필수 | 필수 |

---

#### Task 1: 산출물 목록 정리

**힌트 패널 — 준비자료:** AXD 사업관리·개발 산출물 목록, 계약/SOW/RFP의 제출 산출물 요구사항

각 산출물마다:

| 필드 | 유형 | 필수 |
|------|------|------|
| 산출물명 | text | Y |
| 분류 | single-select (필수 / 조건부 / 선택 / 제외) | Y |
| 제외 사유 | text | 제외 선택 시 |

---

#### Task 2: 제출 시점 정리

**힌트 패널 — 준비자료:** 전체 일정과 주요 마일스톤, 고객 검토 기간

각 산출물마다:

| 필드 | 유형 | 필수 |
|------|------|------|
| 제출 기준 | single-select (단계별 / Sprint별 / Gate별) | Y |
| 제출 예정일 | date | Y |
| 고객 검토 기간 (일) | number | Y |

---

#### Task 3: 검토·승인자 확인

**힌트 패널 — 준비자료:** 고객 산출물 승인 절차와 검토 기간, 산출물별 책임자 후보

각 산출물마다:

| 필드 | 유형 | 필수 |
|------|------|------|
| 검토자 | participant-ref | Y |
| 승인자 | participant-ref | Y (미정 시 TBD + Open Item 자동 생성) |

---

#### Task 4: 검수·수용 기준 정리

**힌트 패널 — 준비자료:** 품질점검 대상 산출물과 감리/검수 대상 산출물, 문서작성표준

각 산출물마다:

| 필드 | 유형 | 필수 |
|------|------|------|
| 검수·수용 기준 | text | Y |
| 반려 기준 | text | Y |
| 보완 기한 (일) | number | Y |

---

#### Task 5: 저장·버전 기준 정리

**힌트 패널 — 준비자료:** 문서작성표준, 파일명 규칙, 문서번호 체계

각 산출물마다 (또는 전체 공통 기준으로 입력):

| 필드 | 유형 | 필수 |
|------|------|------|
| 저장 위치 | single-select (문서관리 시스템 / 파일서버 / Playbook 저장소 / 기타) | Y |
| 파일명 규칙 | text (예: PROJ_설계서_v1.0) | Y |
| 버전 기준 | text (예: v0.1 단위 관리, 승인 후 v1.0 확정) | Y |

---

### 5.5 A5 — 환경·도구·접근권한 준비상태 확인

→ Resource 테이블에 행 단위 입력. 유형별 프리셋 제공.

#### Task 1: 필수 도구 확인

**힌트 패널 — 준비자료:** 목표시스템 구성도, 소스저장소·문서저장소·이슈관리 도구 후보

**TOOL 프리셋 항목:**

| 항목 | 기본 상태 | 설명 |
|------|-----------|------|
| 협업도구 | NOT_STARTED | Teams, Slack 등 |
| 문서관리 도구 | NOT_STARTED | SharePoint, Confluence 등 |
| 이슈관리 도구 | NOT_STARTED | Jira, Redmine 등 |
| 소스관리 도구 | NOT_STARTED | Git, SVN 등 |
| 테스트관리 도구 | NOT_STARTED | Xray, TestRail 등 |

각 항목마다:

| 필드 | 유형 | 필수 |
|------|------|------|
| 도구명 (직접 입력 가능) | text | Y |
| 고객 공동 사용 여부 | boolean | Y |
| Sprint 1 필수 여부 | boolean | Y |
| 현재 상태 | single-select (READY / IN_PROGRESS / DELAYED / NOT_STARTED) | Y |
| 사용 가능 예정일 | date | 조건부 |
| 담당자 | participant-ref | Y |

---

#### Task 2: 접근권한 확인

**힌트 패널 — 준비자료:** 고객 IT 보안정책, 계정 신청 절차, VPN/VDI 신청 기준, 사용자 목록·역할별 권한 수준

**ACCESS 프리셋 항목:**

| 항목 | 설명 |
|------|------|
| 고객 시스템 접근 | 업무 시스템 조회·운영 권한 |
| 내부망 접근 | 고객 내부망 또는 수행사 망 |
| VPN / VDI | 원격 접속 수단 |
| 클라우드 콘솔 | AWS, Azure, GCP 등 |

각 항목마다 Resource 공통 필드 + `권한 신청 담당자(participant-ref)`

---

#### Task 3: 환경 준비상태 확인

**힌트 패널 — 준비자료:** 개발/검증/운영 환경 계획

**ENVIRONMENT 프리셋 항목:** 개발 환경 / 검증 환경 / 운영 환경 / Sandbox

각 항목마다 Resource 공통 필드

**판단기준 (화면 내 표시):**
- 환경 사용 가능일이 Sprint 1 시작일보다 늦음 → 우회방안 필수

---

#### Task 4: 저장소·형상관리 기준 확인

**힌트 패널 — 준비자료:** 문서저장소·소스저장소 후보, Branch 전략

**REPOSITORY 프리셋 항목:** 문서 저장소 / 소스 저장소

각 항목마다 Resource 공통 필드 + `접근 통제 기준(text)` + `Branch 전략(text)`

---

#### Task 5: 우회방안 정리

**힌트 패널 — 준비자료:** 환경·권한 점검 결과

→ 각 Resource 항목의 `workaround` 필드 입력을 유도하는 화면
→ is_sprint1_required = true이고 status = DELAYED인 항목을 자동 목록화하여 표시

---

#### Task 6: 투입 준비 확인항목 점검

**힌트 패널 — 준비자료:** 인력투입계획, 출입증·상주 등록 기준, 비상연락망 양식

**ONBOARDING 프리셋 항목:**

| 항목 | 설명 |
|------|------|
| 협업도구 접근 권한 | 전 팀원 공통 |
| 출입증·상주 등록 | 해당자 한정 |
| 비상연락망 등록 | 전 팀원 공통 |

각 항목마다 Resource 공통 필드

---

### 5.6 A6 — 고객 준비도·보안·리스크 점검

#### Task 1: 고객 준비상태 확인

**힌트 패널 — 준비자료:** 고객 담당자 및 승인자 목록

→ ReadinessCheck 테이블 (area = CUSTOMER)

| 점검 항목 | 입력 유형 | 필수 |
|-----------|-----------|------|
| 고객 담당자 지정 여부 | boolean + participant-ref | Y |
| 고객 승인자 지정 여부 | boolean + participant-ref | Y |
| 고객 참여 가능 시간 충분성 | single-select (충분 / 부족 / 미확인) | Y |
| 각 항목 준비 상태 | single-select (완료 / 진행 / 지연 / 미완료 / 해당없음) | Y |
| Sprint 1 영향도 | single-select (없음 / 조건부 / 차단) | Y |

---

#### Task 2: 데이터 준비상태 확인

**힌트 패널 — 준비자료:** 데이터 제공 계획, 개인정보/민감정보 처리 기준

→ ReadinessCheck 테이블 (area = DATA)

| 점검 항목 | 입력 유형 | 필수 |
|-----------|-----------|------|
| 데이터 제공 예정일 | date | Y |
| 데이터 제공 방식 | single-select (샘플 데이터 / 원천 접근 / Mock 데이터) | Y |
| 마스킹 필요 여부 | boolean | Y |
| 원천 데이터 접근 가능 여부 | boolean | Y |
| 준비 상태 | single-select (완료 / 진행 / 지연 / 미완료 / 해당없음) | Y |
| Sprint 1 영향도 | single-select (없음 / 조건부 / 차단) | Y |

---

#### Task 3: 보안 준비상태 확인

**힌트 패널 — 준비자료:** 보안교육, 보안서약, 자료반출입 기준

→ ReadinessCheck 테이블 (area = SECURITY)

| 점검 항목 | 입력 유형 | 필수 |
|-----------|-----------|------|
| 보안교육 이수 기준 확인 | boolean | Y |
| 보안서약서 징구 기준 확인 | boolean | Y |
| 자료 반출입 기준 확인 | boolean | Y |
| 망접속 기준 확인 | boolean | Y |
| 각 항목 준비 상태 | single-select (완료 / 진행 / 지연 / 미완료 / 해당없음) | Y |
| Sprint 1 영향도 | single-select (없음 / 조건부 / 차단) | Y |

---

#### Task 4: 이슈·리스크 등록

**힌트 패널 — 준비자료:** 과거 유사 프로젝트 위험목록, Lessons Learned

→ RiskIssue 테이블에 행 단위 입력

| 필드 | 유형 | 필수 |
|------|------|------|
| 유형 | single-select (Risk / Issue / 결정 필요) | Y |
| 분류 | single-select (고객준비도 / 데이터 / 보안 / 일정 / 기타) | Y |
| 제목 | text | Y |
| 설명 | text | Y |
| 발생가능성 | single-select (높음 / 중간 / 낮음) | Risk만 |
| 영향도 | single-select (높음 / 중간 / 낮음) | Y |
| Sprint 1 차단 여부 | boolean | Y |
| 대응 전략 | text | Y |
| 담당자 | participant-ref | Y |
| 확인 기한 | date | Y |

---

#### Task 5: Sprint 1 시작 차단요소 판단

**힌트 패널 — 준비자료:** 고객·데이터·보안 준비상태 점검 결과

→ RiskIssue에서 sprint1_blocking = true인 항목이 자동 집계되어 표시
→ 각 차단요소에 대해 PM이 최종 판단 선택:

| 필드 | 유형 | 필수 |
|------|------|------|
| 항목별 판단 | single-select (조건부 진행 / 시작 전 확인 필요) | Y |
| 판단 근거 | text | Y |

---

### 5.7 A7 — Sprint 1 실행준비 및 미정 항목 이관

A7은 **집계 + 판정** 중심. 직접 입력 항목은 PM 최종 판정뿐이다.

#### Task 1: A1~A6 완료 상태 확인

→ 자동 집계 (Activity별 필수 입력 항목 완료율 기준)

| 항목 | 집계 방식 |
|------|-----------|
| A1 완료 상태 | Task 1~8 필수 항목 완료율 → COMPLETE / PARTIAL / INCOMPLETE |
| A2 완료 상태 | Task 1~6 필수 항목 + 필수 역할 등록 여부 |
| A3 완료 상태 | Task 1~5 필수 항목 + 필수 회의체 등록 여부 |
| A4 완료 상태 | 필수 산출물 전체 필드 완료 여부 |
| A5 완료 상태 | Sprint 1 필수 Resource 상태 |
| A6 완료 상태 | ReadinessCheck + RiskIssue 등록 여부 |

---

#### Task 2: Sprint 1 시작 조건 확인

→ 아래 항목이 자동 집계되어 표시됨

| 집계 항목 | 집계 방식 |
|-----------|-----------|
| BLOCKER Open Item 수 | sprint1_impact = BLOCKER & status = OPEN |
| CONDITIONAL Open Item 수 | sprint1_impact = CONDITIONAL & status = OPEN |
| Sprint 1 필수 미완료 Resource | is_sprint1_required = true & status ≠ READY |
| 차단 리스크 수 | sprint1_blocking = true & status = OPEN |
| 준비상태 차단 항목 | ReadinessCheck.sprint1_impact = BLOCKER |
| 승인자 미정 필수 산출물 | Deliverable.category = MANDATORY & approver_id = TBD |

---

#### Task 3: 조건부 진행 항목 정리

→ sprint1_impact = CONDITIONAL인 Open Item 목록 자동 표시
→ 각 항목에 다음을 추가 입력:

| 필드 | 유형 | 필수 |
|------|------|------|
| 확인 조건 | text | Y |
| 담당자 | participant-ref | Y |
| 확인 기한 | date | Y |
| 만료일 (미해소 시 재판단 기준일) | date | Y |

---

#### Task 4: 시작 전 확인 필요 항목 판단

→ sprint1_impact = BLOCKER인 Open Item + sprint1_blocking RiskIssue 자동 표시
→ 각 항목에 다음을 추가 입력:

| 필드 | 유형 | 필수 |
|------|------|------|
| 확인 필요 사유 | single-select (승인자 미정 / 환경 미준비 / 데이터 미확정 / 보안 미확인 / 기타) | Y |
| Sponsor 보고 필요 여부 | boolean | Y |

---

#### Task 5: 미정 항목(Open Item) 이관

→ status = OPEN인 전체 Open Item 목록 표시
→ 각 항목에 이관 대상 선택:

| 필드 | 유형 | 필수 |
|------|------|------|
| 이관 대상 | single-select (Sprint 1 / 후속 Activity / 사업수행계획서 보완 / 고객 Action) | Y |

---

#### Task 6: Sprint 1 시작 방식 기록

**시스템 자동 판정 로직:**
```
if (BLOCKER Open Item > 0 OR sprint1_blocking Risk > 0 OR ReadinessCheck BLOCKER > 0):
  suggest = "시작 전 확인 필요"
elif (CONDITIONAL Open Item > 0 OR sprint1_required Resource not READY > 0):
  suggest = "조건부 시작"
else:
  suggest = "정상 시작"
```

→ 시스템 제안 판정을 화면에 표시한 후 PM 최종 입력:

| 입력 항목 | 유형 | 필수 |
|-----------|------|------|
| PM 최종 판정 | single-select (정상 시작 / 조건부 시작 / 범위 조정 후 시작 / 시작 전 확인 필요) | Y |
| 판정 근거 | text | Y |
| 확인자 | participant-ref | Y |
| 확정일 | date (자동) | Y |

---

## 6. 이행 확인 체크리스트

각 Activity 완료 처리 전 PM이 직접 셀프 체크한다. 체크 결과는 저장되어 A7 집계에 반영된다.

### A1 체크리스트
1. 수행모델이 프로젝트 유형과 맞게 정리되어 있는가
2. Sprint 주기와 Review 방식이 실제 일정에 반영되어 있는가
3. 작업 목록 관리 기준이 실제 관리 도구나 문서에 반영되어 있는가
4. 작업 시작·완료·검수 기준이 Sprint 1 후보 작업에 적용 가능한가
5. 변경관리 연결 기준이 범위·일정·비용 영향 기준으로 구분되어 있는가

### A2 체크리스트
1. 고객·수행·지원조직의 핵심 참여자가 실제 이름 또는 부서로 확인되어 있는가
2. 주요 책임 영역에 공백이 없는가
3. 산출물, 요구사항, 범위 변경, 오픈 승인자가 확인되어 있는가
4. 일정·범위·품질·보안 이슈의 상위 보고 경로가 명확한가
5. 핵심 의사결정자가 미정인 항목이 별도 관리되고 있는가

### A3 체크리스트
1. 주간보고, Sprint Review, 주요 회의체 일정이 실제 Calendar에 반영되어 있는가
2. 각 회의체의 목적·참석자·결과물이 중복 없이 정의되어 있는가
3. Action Item과 의사결정 항목을 추적하는 기준이 하나로 정리되어 있는가
4. 고객 보고와 내부 보고의 주기·내용 차이가 정리되어 있는가
5. 이슈 발생 시 보고 기준이 정상/주의/위험 수준으로 구분되어 있는가

### A4 체크리스트
1. 계약·과업 기준 필수 산출물이 누락 없이 반영되어 있는가
2. 산출물별 검토자와 승인자가 실제 이름 또는 부서로 확인되어 있는가
3. 제출 시점이 단계, Sprint, Gate 기준으로 구분되어 있는가
4. 검수·반려·보완 기준이 고객과 내부 모두 이해할 수 있게 정리되어 있는가
5. 최종본 저장 위치와 버전 기준이 명확한가

### A5 체크리스트
1. Sprint 1 수행에 필요한 필수 도구와 저장소가 준비되어 있는가
2. 개발·검증 환경의 사용 가능일이 확인되어 있는가
3. 고객 시스템 접근권한, VPN/VDI/망접속 기준이 확인되어 있는가
4. 권한 또는 환경 지연이 Sprint 1 시작에 영향을 주는지 구분되어 있는가
5. 환경 지연 시 우회방안이 있는가

### A6 체크리스트
1. 고객 담당자, 승인자, 업무 담당자의 참여 가능 일정이 확인되어 있는가
2. 데이터 제공 일정, 제공 방식, 마스킹 기준이 확인되어 있는가
3. 보안·개인정보·자료 반출입 기준이 확인되어 있는가
4. 주요 이슈와 리스크가 영향도 기준으로 구분되어 있는가
5. Sprint 1 시작을 막을 수 있는 차단 리스크가 별도로 식별되어 있는가

### A7 체크리스트
1. A1~A6의 핵심 결정사항과 미흡 항목이 종합되어 있는가
2. 정상 시작/조건부 시작/범위 조정 후 시작/시작 전 확인 필요 판단 근거가 명확한가
3. 조건부 진행 항목에 담당자와 확인 기한이 정리되어 있는가
4. 시작 전 확인 필요 항목이 실제 Sprint 1 시작에 영향을 주는지 검토되었는가
5. 미정 항목(Open Item)이 Sprint 1 또는 후속 Activity로 이관되어 있는가

---

## 7. 자동 생성 출력물

### 7.1 사업수행계획서 챕터별 정리표

| 챕터 | 소스 | 주요 데이터 |
|------|------|-------------|
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
| 15. 형상관리 계획 | A4, A5 | 저장소, 버전·파일명 기준 |
| 18. 보안 대책 | A5, A6 | 접근권한 기준, 보안 점검 결과 |

출력 형태: HTML 인쇄 / JSON Export

### 7.2 Sprint 1 실행준비 결과서

포함 항목:
- 프로젝트명, 판정일, 판정자
- Sprint 1 시작 방식 (판정 결과)
- 판정 근거
- A1~A6 완료 상태 요약
- 조건부 진행 항목 목록 (담당·기한·만료일 포함)
- 시작 전 확인 필요 항목 목록 (확인 사유 포함)
- 이관된 Open Item 목록

출력 형태: HTML 인쇄 / PDF

### 7.3 Open Item 이관 목록

status = TRANSFERRED인 항목을 이관 대상별로 정리한 목록.

---

## 8. 사용자 흐름

### 8.1 기본 흐름

```
[프로젝트 생성]
  → 기본 정보 입력 (프로젝트명, 유형, 일정)
  → Sprint 0 대시보드 진입 (A1~A7 상태 한눈에 표시)

[Activity 수행 (A1~A6 반복)]
  → Playbook 힌트 패널 (접이식, 현재 Task의 준비자료 + 예시 질문 표시)
  → Task별 입력 폼
  → Open Item 등록 버튼 (언제든 등록 가능)
  → 이행 확인 체크리스트 (Task 전체 완료 후 셀프 체크)
  → Activity 완료 처리

[A7 종합 판정]
  → 집계 현황 자동 표시 (BLOCKER / CONDITIONAL / 미완료 Resource 등)
  → Open Item 이관 처리
  → PM 최종 판정 입력
  → 결과서 자동 생성 + 출력
```

### 8.2 Activity 화면 구조

```
┌─────────────────────────────────────────────────────────────┐
│  [상단] A1~A7 진행 현황 바 (완료 / 진행중 / 미시작)        │
├────────────────┬────────────────────────────────────────────┤
│  [좌측]        │  [우측] 입력 패널                          │
│  Playbook      │  — Task 탭 (1 / 2 / 3 ...)                │
│  힌트 패널     │  — 입력 폼                                 │
│  (접이식)      │  — 판단기준 인라인 표시                    │
│                │  — Open Item 등록 버튼                     │
│  · 준비자료    │  — [하단] 이행 확인 체크리스트             │
│  · 예시 질문   │  — Activity 완료 처리 버튼                 │
└────────────────┴────────────────────────────────────────────┘
```

---

## 9. 기술 요구사항

### 9.1 아키텍처

| 항목 | v1.0 | v2.0 |
|------|------|------|
| 클라이언트 | Web App (Vanilla TS 또는 React) | 동일 |
| 데이터 저장 | LocalStorage (JSON) | 서버 DB (PostgreSQL 등) |
| 인증 | 없음 (단일 PM 로컬 운용) | 사용자 인증 추가 |
| 배포 | 정적 파일 (GitHub Pages 또는 내부 서버) | 서버 배포 |
| 데이터 내보내기 | JSON Export / HTML 인쇄 / PDF | 동일 + API |

### 9.2 비기능 요구사항

| 항목 | 기준 |
|------|------|
| 응답성 | 모든 입력 반응 100ms 이내 |
| 데이터 보존 | 브라우저 재시작 후에도 입력 데이터 유지 |
| 한글 처리 | UTF-8 전용 |
| 접근성 | Tab 키보드 탐색 가능 |
| 화면 크기 | 1280px 이상 랩탑 기준 최적화 |

---

## 10. 제약 및 전제

- Sprint 0 Playbook(Read-only HTML)은 별도 유지. Working System 힌트 패널에서 링크로 연결.
- v1.0은 다중 사용자 동시 편집 미지원.
- 사업수행계획서 자동 생성은 챕터별 정리표 형태. KT 공식 양식과의 완전 일치는 v2.0 목표.
- 프로젝트 유형(6종)에 따라 일부 입력 항목이 숨겨지거나 필수로 변경됨.

---

## 11. 마일스톤 (안)

| 단계 | 내용 | 산출물 |
|------|------|--------|
| M1 | 데이터 모델 확정 + 프로젝트 생성 + A1 입력 구현 | A1 Working 화면 |
| M2 | A2 입력 + Participant 재사용 체계 + DecisionAuthority / EscalationPath | A2 Working 화면 |
| M3 | A3~A4 입력 구현 (CommunicationScheme, Deliverable) | A3~A4 Working 화면 |
| M4 | A5~A6 입력 구현 (Resource, ReadinessCheck, RiskIssue) | A5~A6 Working 화면 |
| M5 | A7 집계·판정 + 결과서 자동 생성 | A7 판정 화면 + 결과서 |
| M6 | 사업수행계획서 챕터 정리표 자동 생성 + JSON Export | 완성 MVP |

---

## Appendix A. 데이터 연결 맵

```
ProjectProfile
  └─ project_type → A4 산출물 프리셋 결정
  └─ project_type (공공/금융) → A2 보안예외승인자 필수화
  └─ sprint1_target_date → A5 환경 준비일과 비교 → 지연 여부 판단

A1 결정사항
  └─ Sprint 주기 → A3 회의체 주기 기본값 참고
  └─ Sprint 종료/시작 기준 → A7 판정 근거 참고
  └─ 작업 완료 기준 → A4 검수 기준 참고

A2 Participant
  └─ 전체 → A3 회의 참석자 선택지
  └─ 승인자(is_approver=true) → A4 산출물 승인자 선택지
  └─ 전체 → A6 담당자·보고 대상 선택지
  └─ 전체 → A7 확인자 선택지

A2 DecisionAuthority
  └─ decider_id = TBD → Open Item 자동 생성

A3 DecisionManagement
  └─ delay_threshold_days → Open Item 지연 알림 기준

A4 Deliverable
  └─ approver_id = TBD → A7 승인자 미정 산출물 집계

A5 Resource
  └─ is_sprint1_required=true & status≠READY → A7 미완료 자원 집계
  └─ ready_date vs ProjectProfile.sprint1_target_date → 지연 자동 판단

A6 ReadinessCheck
  └─ sprint1_impact=BLOCKER → A7 집계 + 시스템 판정에 반영

A6 RiskIssue
  └─ sprint1_blocking=true → A7 차단 리스크 집계

OpenItem (전체 Activity)
  └─ sprint1_impact=BLOCKER → A7 자동 판정 "시작 전 확인 필요"
  └─ sprint1_impact=CONDITIONAL → A7 자동 판정 "조건부 시작"
  └─ transfer_to → A7 이관 처리
```

---

## Appendix B. 용어 정의

| 용어 | 정의 |
|------|------|
| Sprint 0 | 계약 이후 Sprint 1 시작 전까지, 본수행 착수를 준비하는 단계 |
| Working System | PM이 실제 입력·선택·확인을 하는 데이터 관리 시스템 (이 PRD의 대상) |
| Playbook | Read-only 가이드. Working System과 별도로 존재하며 힌트 패널에서 참조 |
| Open Item | Sprint 0 중 결정되지 않은 미정 항목. 담당자·기한·Sprint 1 영향도 필수 |
| BLOCKER | Sprint 1 시작을 막는 항목. 해소 전 Sprint 1 시작 불가 |
| CONDITIONAL | Sprint 1 시작 가능하나 기한 내 해소 조건이 붙은 항목 |
| 판정 (Verdict) | A7에서 PM이 내리는 Sprint 1 시작 방식 결정 |
| prep | 각 Task 수행 전 준비해야 할 자료 목록. 힌트 패널에 표시 |
| example | Playbook의 PM 진행 예시 대화. 힌트 패널에 표시 |
| DecisionAuthority | 결정 항목별 결정자·검토자·협의 대상·보고 경로를 구조화한 데이터 |
| EscalationPath | 이슈 유형별 1차 조치·기준 기간·보고 대상을 구조화한 데이터 |
| ReadinessCheck | 고객·데이터·보안 준비상태를 5단계로 관리하는 점검 항목 |
