# Table 정의서

## 문서 기본 정보

| 항목 | 내용 |
|---|---|
| 시스템명 | AXE Delivery Way Project Working System |
| 프로젝트명 | ProjectPlaybook |
| 산출물명 | Table 정의서 |
| 작성 기준일 | 2026-07-01 |
| 작성자 | GitHub Copilot |
| 대상 Repository | ProjectPlaybook |
| 대상 Branch | master |
| 기준 Commit ID | a82cf9f |
| 대상 환경 | DEV |
| 대상 DBMS | 미정(PostgreSQL 적용 가능 기준으로 작성) |
| 대상 Schema | axe_working |
| DB 기준일 | 2026-07-01 |
| 비고 | 실제 DB DDL이 아직 없으므로 PRD v0.2 핵심 데이터 모델을 기준으로 작성한 물리 테이블 정의 초안 |

## 작성 기준

- 기준 문서: `docs/PRD-AXE-Working-System-v0.2.md`
- 현재 구현은 JSON 파일 저장소 기반이며, 본 문서는 향후 RDB 전환 또는 설계 검토를 위한 테이블 정의 초안이다.
- ID 컬럼은 UUID 사용을 기본으로 한다.
- 코드성 값은 VARCHAR로 정의하고, 허용값은 Constraint 정의에 명시한다.
- 다중 참여자 참조처럼 배열로 정의된 항목은 조회성과 참조 무결성을 위해 별도 매핑 테이블로 분리한다.
- `activity_completion`처럼 집계 결과 성격이 강한 구조는 JSONB 후보로 정의한다.

## Table 목록

| Table명 | 설명 | Schema | 관련 업무 | 사용 프로그램 | 비고 |
|---|---|---|---|---|---|
| TB_PROJECT_PROFILE | 프로젝트 기본 정보 | axe_working | 프로젝트 등록, Sprint 0 컨텍스트 | Working System Server | PRD ProjectProfile |
| TB_PARTICIPANT | 프로젝트 참여자 | axe_working | 참여자/승인자/담당자 관리 | Working System Server | PRD Participant |
| TB_DECISION_AUTHORITY | 의사결정 권한 매핑 | axe_working | 승인자·의사결정자 관리 | Working System Server | PRD DecisionAuthority |
| TB_DECISION_AUTHORITY_CONSULTATION | 의사결정 협의 대상 매핑 | axe_working | 의사결정 협의자 관리 | Working System Server | 다중 participant-ref 분리 |
| TB_ESCALATION_PATH | 이슈 보고 경로 | axe_working | 상위 보고·의사결정 경로 | Working System Server | PRD EscalationPath |
| TB_COMMUNICATION_SCHEME | 보고체계 및 회의체 | axe_working | 회의체/보고 주기 관리 | Working System Server | PRD CommunicationScheme |
| TB_COMMUNICATION_ATTENDEE | 회의체 참석자 매핑 | axe_working | 회의체 참석자 관리 | Working System Server | 다중 participant-ref 분리 |
| TB_DECISION_MANAGEMENT | 의사결정 관리 기준 | axe_working | 결정 지연 추적 기준 관리 | Working System Server | 프로젝트당 1건 |
| TB_DECISION_REVIEW_ATTENDEE | Sprint Review 참석자 매핑 | axe_working | Sprint Review 참석자 관리 | Working System Server | 다중 participant-ref 분리 |
| TB_DELIVERABLE | 산출물 | axe_working | 산출물 제출·검토·승인 관리 | Working System Server | PRD Deliverable |
| TB_RESOURCE | 환경·도구·권한·저장소 | axe_working | Sprint 1 필수 리소스 준비 관리 | Working System Server | PRD Resource |
| TB_READINESS_CHECK | 고객·데이터·보안 준비상태 | axe_working | 준비상태 점검 | Working System Server | PRD ReadinessCheck |
| TB_RISK_ISSUE | 리스크/이슈/의사결정 필요 항목 | axe_working | RAID 및 착수 저해요인 관리 | Working System Server | PRD RiskIssue |
| TB_OPEN_ITEM | 미정 항목 | axe_working | Open Item 추적·이관 | Working System Server | PRD OpenItem |
| TB_SPRINT1_READINESS | Sprint 1 실행준비 판정 | axe_working | A7 자동 집계 및 PM 판정 | Working System Server | PRD Sprint1Readiness |

## Table 상세 정의 - TB_PROJECT_PROFILE

| 항목 | 내용 |
|---|---|
| Table명 | TB_PROJECT_PROFILE |
| 설명 | Sprint 0 시작 전 등록하는 프로젝트 기본 정보 |
| Schema | axe_working |
| 주요 업무 | 프로젝트 등록, Activity 입력 컨텍스트 제공, 산출물 생성 기준 제공 |
| 데이터 생성 주체 | PM 사용자, Working System Server |
| 데이터 변경 주체 | PM 사용자, Working System Server |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 포함 가능(PM 이름) |
| 비고 | 현재 구현의 Project 모델보다 PRD v0.2 기준이 넓음 |

### Column 정의 - TB_PROJECT_PROFILE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | PROJECT_ID | 프로젝트 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_NAME | 프로젝트명 | VARCHAR | 200 | N | N | N |  |  |
| 3 | CONTRACT_DATE | 계약일 | DATE |  | N | N | Y |  |  |
| 4 | SPRINT0_START_DATE | Sprint 0 시작일 | DATE |  | N | N | Y |  |  |
| 5 | SPRINT0_END_DATE | Sprint 0 완료 예정일 | DATE |  | N | N | Y |  |  |
| 6 | SPRINT1_TARGET_DATE | Sprint 1 목표 시작일 | DATE |  | N | N | Y |  |  |
| 7 | PROJECT_TYPE | 프로젝트 유형 | VARCHAR | 30 | N | N | N |  | POC_GENERAL 등 |
| 8 | CUSTOMER_ORG | 고객 기관명 | VARCHAR | 200 | N | N | N |  |  |
| 9 | AXE_PM_NAME | 수행 PM 이름 | VARCHAR | 100 | N | N | N |  | 개인정보 가능 |
| 10 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |
| 11 | UPDATED_AT | 수정 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_PARTICIPANT

| 항목 | 내용 |
|---|---|
| Table명 | TB_PARTICIPANT |
| 설명 | 프로젝트 참여자, 승인자, 보고 대상, 담당자 후보를 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A2 참여자 등록, 담당자/승인자 참조 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 포함(이름, 연락 채널) |
| 비고 | 연락처·채널은 민감도 검토 필요 |

### Column 정의 - TB_PARTICIPANT

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | PARTICIPANT_ID | 참여자 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | NAME | 이름 또는 부서명 | VARCHAR | 100 | N | N | N |  | 개인정보 가능 |
| 4 | ORGANIZATION | 소속 구분 | VARCHAR | 30 | N | N | N |  | CUSTOMER, AXE 등 |
| 5 | ROLE_TYPE | 역할 유형 | VARCHAR | 40 | N | N | N |  | CUSTOMER_PM 등 |
| 6 | RESPONSIBILITIES | 핵심 책임 범위 | TEXT |  | N | N | N |  |  |
| 7 | JOIN_TIMING | 참여 시점 | VARCHAR | 100 | N | N | N |  |  |
| 8 | CONTACT_CHANNEL | 연락처 또는 채널 | VARCHAR | 200 | N | N | Y |  | 이메일/메신저 등 |
| 9 | IS_APPROVER | 승인자 여부 | BOOLEAN |  | N | N | N | FALSE |  |
| 10 | STATUS | 확정 상태 | VARCHAR | 20 | N | N | N | 'TBD' | CONFIRMED, TBD |
| 11 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_DECISION_AUTHORITY

| 항목 | 내용 |
|---|---|
| Table명 | TB_DECISION_AUTHORITY |
| 설명 | 결정 항목별 결정자, 검토자, 지연 시 보고 대상을 정의하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A2 승인자·의사결정자 확인 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | 협의 대상은 별도 매핑 테이블로 관리 |

### Column 정의 - TB_DECISION_AUTHORITY

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | AUTHORITY_ID | 의사결정 권한 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | DECISION_TOPIC | 결정 항목 | VARCHAR | 40 | N | N | N |  | REQUIREMENT_PRIORITY 등 |
| 4 | DECISION_TOPIC_CUSTOM | 기타 결정 항목명 | VARCHAR | 200 | N | N | Y |  | DECISION_TOPIC=OTHER 시 사용 |
| 5 | DECIDER_ID | 결정자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 6 | REVIEWER_ID | 검토자 ID | UUID |  | N | Y | Y |  | TB_PARTICIPANT 참조 |
| 7 | ESCALATION_ID | 지연 시 상위 보고 대상 ID | UUID |  | N | Y | Y |  | TB_PARTICIPANT 참조 |
| 8 | STATUS | 확정 상태 | VARCHAR | 20 | N | N | N | 'TBD' | CONFIRMED, TBD |

## Table 상세 정의 - TB_DECISION_AUTHORITY_CONSULTATION

| 항목 | 내용 |
|---|---|
| Table명 | TB_DECISION_AUTHORITY_CONSULTATION |
| 설명 | 의사결정 항목별 협의 대상 참여자 매핑 테이블 |
| Schema | axe_working |
| 주요 업무 | A2 의사결정 협의 대상 관리 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 부모 데이터 보관 기간과 동일 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | AUTHORITY_ID, PARTICIPANT_ID 복합 PK |

### Column 정의 - TB_DECISION_AUTHORITY_CONSULTATION

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | AUTHORITY_ID | 의사결정 권한 ID | UUID |  | Y | Y | N |  | TB_DECISION_AUTHORITY 참조 |
| 2 | PARTICIPANT_ID | 협의 대상 참여자 ID | UUID |  | Y | Y | N |  | TB_PARTICIPANT 참조 |

## Table 상세 정의 - TB_ESCALATION_PATH

| 항목 | 내용 |
|---|---|
| Table명 | TB_ESCALATION_PATH |
| 설명 | 이슈 유형별 1차 조치, 기준 기간, 보고 대상, 최종 결정자를 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A2 상위 보고·의사결정 경로 확인 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 |  |

### Column 정의 - TB_ESCALATION_PATH

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | PATH_ID | 보고 경로 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | ISSUE_TYPE | 이슈 유형 | VARCHAR | 40 | N | N | N |  | SCHEDULE_DELAY 등 |
| 4 | ISSUE_TYPE_CUSTOM | 기타 이슈 유형명 | VARCHAR | 200 | N | N | Y |  | ISSUE_TYPE=OTHER 시 사용 |
| 5 | FIRST_ACTION | 1차 조치 내용 | TEXT |  | N | N | N |  |  |
| 6 | THRESHOLD_DAYS | 기준 기간(일) | INTEGER |  | N | N | N |  | 0 이상 |
| 7 | ESCALATE_TO_ID | 2차 보고 대상 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 8 | FINAL_DECIDER_ID | 최종 의사결정자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |

## Table 상세 정의 - TB_COMMUNICATION_SCHEME

| 항목 | 내용 |
|---|---|
| Table명 | TB_COMMUNICATION_SCHEME |
| 설명 | 보고체계와 회의체의 목적, 주기, 운영 책임자, 산출물 형식을 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A3 보고 주기, 회의체, Sprint Review 연결 관리 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | 참석자는 별도 매핑 테이블로 관리 |

### Column 정의 - TB_COMMUNICATION_SCHEME

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | SCHEME_ID | 보고체계/회의체 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | TYPE | 보고/회의체 유형 | VARCHAR | 40 | N | N | N |  | WEEKLY_REPORT 등 |
| 4 | TYPE_CUSTOM | 기타 유형명 | VARCHAR | 200 | N | N | Y |  | TYPE=OTHER 시 사용 |
| 5 | PURPOSE | 목적 | TEXT |  | N | N | N |  |  |
| 6 | FREQUENCY | 주기 | VARCHAR | 200 | N | N | N |  | 예: 매주 금요일 |
| 7 | OWNER_ID | 운영 책임자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 8 | OUTPUT_FORMAT | 산출물 형태 | VARCHAR | 200 | N | N | N |  | 회의록, 주간보고 등 |
| 9 | CONNECTED_REPORT | 연결 공식 보고 | VARCHAR | 200 | N | N | Y |  |  |
| 10 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_COMMUNICATION_ATTENDEE

| 항목 | 내용 |
|---|---|
| Table명 | TB_COMMUNICATION_ATTENDEE |
| 설명 | 보고체계/회의체별 참석자 매핑 테이블 |
| Schema | axe_working |
| 주요 업무 | A3 참석자 관리 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 부모 데이터 보관 기간과 동일 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | SCHEME_ID, PARTICIPANT_ID 복합 PK |

### Column 정의 - TB_COMMUNICATION_ATTENDEE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | SCHEME_ID | 보고체계/회의체 ID | UUID |  | Y | Y | N |  | TB_COMMUNICATION_SCHEME 참조 |
| 2 | PARTICIPANT_ID | 참석자 ID | UUID |  | Y | Y | N |  | TB_PARTICIPANT 참조 |

## Table 상세 정의 - TB_DECISION_MANAGEMENT

| 항목 | 내용 |
|---|---|
| Table명 | TB_DECISION_MANAGEMENT |
| 설명 | 의사결정 관리 방식, 지연 기준, 상태 기준, Sprint Review 연결 방식을 프로젝트 단위로 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A3 의사결정 관리 기준 설정 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | PROJECT_ID를 PK로 사용하여 프로젝트당 1건 유지 |

### Column 정의 - TB_DECISION_MANAGEMENT

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | PROJECT_ID | 프로젝트 ID | UUID |  | Y | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 2 | MANAGEMENT_METHOD | 관리 방식 | VARCHAR | 30 | N | N | N |  | DECISION_LOG 등 |
| 3 | ACTION_ITEM_OWNER_ID | Action Item 관리 주체 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 4 | DELAY_THRESHOLD_DAYS | 지연 기준(일) | INTEGER |  | N | N | N |  | 0 이상 |
| 5 | STATUS_NORMAL | 정상 기준 정의 | VARCHAR | 500 | N | N | N |  |  |
| 6 | STATUS_CAUTION | 주의 기준 정의 | VARCHAR | 500 | N | N | N |  |  |
| 7 | STATUS_DANGER | 위험 기준 정의 | VARCHAR | 500 | N | N | N |  |  |
| 8 | SPRINT_REVIEW_CONNECTION | Sprint Review 연결 방식 | VARCHAR | 30 | N | N | N |  | WEEKLY_REPORT 등 |

## Table 상세 정의 - TB_DECISION_REVIEW_ATTENDEE

| 항목 | 내용 |
|---|---|
| Table명 | TB_DECISION_REVIEW_ATTENDEE |
| 설명 | 의사결정 관리 기준의 Sprint Review 참석자 매핑 테이블 |
| Schema | axe_working |
| 주요 업무 | A3 Sprint Review 참석자 관리 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 부모 데이터 보관 기간과 동일 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | PROJECT_ID, PARTICIPANT_ID 복합 PK |

### Column 정의 - TB_DECISION_REVIEW_ATTENDEE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | PROJECT_ID | 프로젝트 ID | UUID |  | Y | Y | N |  | TB_DECISION_MANAGEMENT 참조 |
| 2 | PARTICIPANT_ID | Sprint Review 참석자 ID | UUID |  | Y | Y | N |  | TB_PARTICIPANT 참조 |

## Table 상세 정의 - TB_DELIVERABLE

| 항목 | 내용 |
|---|---|
| Table명 | TB_DELIVERABLE |
| 설명 | 산출물별 제출 기준, 검토·승인자, 검수 기준, 저장 위치, 상태를 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A4 산출물·검토·승인 기준 관리 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자, 승인 처리 기능 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 |  |

### Column 정의 - TB_DELIVERABLE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | DELIVERABLE_ID | 산출물 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | NAME | 산출물명 | VARCHAR | 200 | N | N | N |  |  |
| 4 | CATEGORY | 산출물 구분 | VARCHAR | 20 | N | N | N |  | MANDATORY 등 |
| 5 | EXCLUSION_REASON | 제외 사유 | TEXT |  | N | N | Y |  | CATEGORY=EXCLUDED 시 사용 |
| 6 | SUBMIT_BASIS | 제출 기준 | VARCHAR | 20 | N | N | N |  | BY_PHASE 등 |
| 7 | DUE_DATE | 제출 기한 | DATE |  | N | N | Y |  |  |
| 8 | CUSTOMER_REVIEW_DAYS | 고객 검토 기간(일) | INTEGER |  | N | N | Y |  | 0 이상 |
| 9 | REVIEWER_ID | 검토자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 10 | APPROVER_ID | 승인자 ID | UUID |  | N | Y | Y |  | TB_PARTICIPANT 참조 |
| 11 | ACCEPTANCE_CRITERIA | 검수·수용 기준 | TEXT |  | N | N | N |  |  |
| 12 | REJECTION_CRITERIA | 반려 기준 | TEXT |  | N | N | N |  |  |
| 13 | REVISION_DAYS | 보완 기한(일) | INTEGER |  | N | N | Y |  | 0 이상 |
| 14 | STORAGE_LOCATION | 저장 위치 | VARCHAR | 500 | N | N | Y |  |  |
| 15 | FILENAME_RULE | 파일명 규칙 | VARCHAR | 300 | N | N | Y |  |  |
| 16 | VERSION_RULE | 버전 기준 | VARCHAR | 200 | N | N | Y |  |  |
| 17 | STATUS | 산출물 상태 | VARCHAR | 20 | N | N | N | 'PENDING' | PENDING 등 |
| 18 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_RESOURCE

| 항목 | 내용 |
|---|---|
| Table명 | TB_RESOURCE |
| 설명 | 환경, 도구, 접근권한, 저장소, 온보딩 준비 항목을 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A5 환경·도구·접근권한 준비상태 확인 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | Sprint 1 필수 여부와 준비 상태는 A7 판정에 사용 |

### Column 정의 - TB_RESOURCE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | RESOURCE_ID | 리소스 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | TYPE | 리소스 유형 | VARCHAR | 30 | N | N | N |  | TOOL 등 |
| 4 | NAME | 리소스명 | VARCHAR | 200 | N | N | N |  |  |
| 5 | IS_SPRINT1_REQUIRED | Sprint 1 필수 여부 | BOOLEAN |  | N | N | N | FALSE |  |
| 6 | READY_DATE | 준비 예정/완료일 | DATE |  | N | N | Y |  |  |
| 7 | STATUS | 준비 상태 | VARCHAR | 20 | N | N | N | 'NOT_STARTED' | READY 등 |
| 8 | WORKAROUND | 지연 시 우회방안 | TEXT |  | N | N | Y |  |  |
| 9 | OWNER_ID | 담당자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 10 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_READINESS_CHECK

| 항목 | 내용 |
|---|---|
| Table명 | TB_READINESS_CHECK |
| 설명 | 고객, 데이터, 보안 준비상태 점검 결과를 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A6 고객 준비도·보안·리스크 점검 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | Sprint 1 영향도는 A7 판정에 사용 |

### Column 정의 - TB_READINESS_CHECK

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | CHECK_ID | 준비상태 점검 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | AREA | 점검 영역 | VARCHAR | 20 | N | N | N |  | CUSTOMER, DATA, SECURITY |
| 4 | ITEM | 점검 항목명 | VARCHAR | 300 | N | N | N |  |  |
| 5 | STATUS | 점검 상태 | VARCHAR | 20 | N | N | N | 'NOT_STARTED' | DONE 등 |
| 6 | OWNER_ID | 담당자 ID | UUID |  | N | Y | Y |  | TB_PARTICIPANT 참조 |
| 7 | DUE_DATE | 확인 기한 | DATE |  | N | N | Y |  |  |
| 8 | NOTE | 비고 | TEXT |  | N | N | Y |  |  |
| 9 | SPRINT1_IMPACT | Sprint 1 영향도 | VARCHAR | 20 | N | N | N | 'NONE' | NONE 등 |

## Table 상세 정의 - TB_RISK_ISSUE

| 항목 | 내용 |
|---|---|
| Table명 | TB_RISK_ISSUE |
| 설명 | 리스크, 이슈, 의사결정 필요 항목을 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A6 리스크/이슈 관리, A7 착수 저해요인 집계 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 |  |

### Column 정의 - TB_RISK_ISSUE

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | RISK_ISSUE_ID | 리스크/이슈 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | TYPE | 항목 유형 | VARCHAR | 30 | N | N | N |  | RISK 등 |
| 4 | CATEGORY | 분류 | VARCHAR | 40 | N | N | N |  | CUSTOMER_READINESS 등 |
| 5 | TITLE | 제목 | VARCHAR | 300 | N | N | N |  |  |
| 6 | DESCRIPTION | 상세 설명 | TEXT |  | N | N | N |  |  |
| 7 | PROBABILITY | 발생 가능성 | VARCHAR | 10 | N | N | Y |  | RISK만 해당 |
| 8 | IMPACT | 영향도 | VARCHAR | 10 | N | N | N |  | HIGH 등 |
| 9 | SPRINT1_BLOCKING | Sprint 1 착수 저해 여부 | BOOLEAN |  | N | N | N | FALSE |  |
| 10 | MITIGATION | 대응 전략 | TEXT |  | N | N | N |  |  |
| 11 | OWNER_ID | 담당자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 12 | DUE_DATE | 조치 기한 | DATE |  | N | N | Y |  |  |
| 13 | STATUS | 상태 | VARCHAR | 20 | N | N | N | 'OPEN' | OPEN 등 |
| 14 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_OPEN_ITEM

| 항목 | 내용 |
|---|---|
| Table명 | TB_OPEN_ITEM |
| 설명 | Activity 진행 중 확정되지 않은 항목과 이관 대상을 관리하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A1~A7 Open Item 등록, 추적, 이관 |
| 데이터 생성 주체 | PM 사용자 |
| 데이터 변경 주체 | PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | Sprint 1 영향도와 상태는 A7 판정에 사용 |

### Column 정의 - TB_OPEN_ITEM

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | OPEN_ITEM_ID | 미정 항목 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | SOURCE_ACTIVITY | 출처 Activity | VARCHAR | 10 | N | N | N |  | A1~A7 |
| 4 | SOURCE_TASK_NO | 출처 Task 번호 | INTEGER |  | N | N | N |  | 1 이상 |
| 5 | TITLE | 제목 | VARCHAR | 300 | N | N | N |  |  |
| 6 | DESCRIPTION | 상세 설명 | TEXT |  | N | N | N |  |  |
| 7 | OWNER_ID | 담당자 ID | UUID |  | N | Y | N |  | TB_PARTICIPANT 참조 |
| 8 | DUE_DATE | 확인 기한 | DATE |  | N | N | N |  |  |
| 9 | SPRINT1_IMPACT | Sprint 1 영향도 | VARCHAR | 20 | N | N | N | 'NONE' | NONE 등 |
| 10 | TRANSFER_TO | 이관 대상 | VARCHAR | 30 | N | N | N |  | SPRINT1 등 |
| 11 | STATUS | 상태 | VARCHAR | 20 | N | N | N | 'OPEN' | OPEN 등 |
| 12 | RESOLVED_AT | 해결 일자 | DATE |  | N | N | Y |  |  |
| 13 | RESOLUTION_NOTE | 해결 내용 | TEXT |  | N | N | Y |  |  |
| 14 | CREATED_AT | 생성 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |
| 15 | UPDATED_AT | 수정 일시 | TIMESTAMP |  | N | N | N | CURRENT_TIMESTAMP |  |

## Table 상세 정의 - TB_SPRINT1_READINESS

| 항목 | 내용 |
|---|---|
| Table명 | TB_SPRINT1_READINESS |
| 설명 | A1~A6 집계 결과와 Sprint 1 실행준비 판정 결과를 저장하는 테이블 |
| Schema | axe_working |
| 주요 업무 | A7 Sprint 1 시작 방식 자동 집계 및 PM 최종 판정 |
| 데이터 생성 주체 | Working System Server, PM 사용자 |
| 데이터 변경 주체 | Working System Server, PM 사용자 |
| 보관 기간 | 프로젝트 종료 후 고객/운영 정책에 따름 |
| 개인정보 포함 여부 | 참여자 참조를 통해 포함 가능 |
| 비고 | 집계값은 판정 시점의 스냅샷으로 저장 |

### Column 정의 - TB_SPRINT1_READINESS

| 순번 | 컬럼명 | 설명 | Data Type | Length | PK | FK | Null | Default | 비고 |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | READINESS_ID | 실행준비 판정 ID | UUID |  | Y | N | N | gen_random_uuid() |  |
| 2 | PROJECT_ID | 프로젝트 ID | UUID |  | N | Y | N |  | TB_PROJECT_PROFILE 참조 |
| 3 | ACTIVITY_COMPLETION | A1~A6 완료상태 집계 | JSONB |  | N | N | N |  | a1~a6: COMPLETE/PARTIAL/INCOMPLETE |
| 4 | BLOCKER_OPEN_ITEMS | BLOCKER Open Item 수 | INTEGER |  | N | N | N | 0 |  |
| 5 | CONDITIONAL_OPEN_ITEMS | CONDITIONAL Open Item 수 | INTEGER |  | N | N | N | 0 |  |
| 6 | RESOURCE_NOT_READY | 필수 리소스 미준비 수 | INTEGER |  | N | N | N | 0 |  |
| 7 | BLOCKING_RISKS | Sprint 1 저해 리스크 수 | INTEGER |  | N | N | N | 0 |  |
| 8 | READINESS_CHECK_BLOCKERS | 준비상태 BLOCKER 수 | INTEGER |  | N | N | N | 0 |  |
| 9 | DELIVERABLE_NO_APPROVER | 승인자 미정 필수 산출물 수 | INTEGER |  | N | N | N | 0 |  |
| 10 | SYSTEM_SUGGESTION | 시스템 제안 판정 | VARCHAR | 40 | N | N | N |  | NORMAL_START 등 |
| 11 | PM_VERDICT | PM 최종 판정 | VARCHAR | 40 | N | N | N |  | NORMAL_START 등 |
| 12 | VERDICT_RATIONALE | 판정 근거 | TEXT |  | N | N | N |  |  |
| 13 | CONFIRMED_AT | 확정 일시 | TIMESTAMP |  | N | N | Y |  |  |
| 14 | CONFIRMED_BY | 확정자 ID | UUID |  | N | Y | Y |  | TB_PARTICIPANT 참조 |

## Key 정의

| Key명 | 유형 | Table | Column | 참조 Table | 참조 Column | 설명 |
|---|---|---|---|---|---|---|
| PK_TB_PROJECT_PROFILE | PK | TB_PROJECT_PROFILE | PROJECT_ID |  |  | 프로젝트 기본 정보 식별자 |
| PK_TB_PARTICIPANT | PK | TB_PARTICIPANT | PARTICIPANT_ID |  |  | 참여자 식별자 |
| FK_PARTICIPANT_PROJECT | FK | TB_PARTICIPANT | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 참여자의 프로젝트 참조 |
| PK_TB_DECISION_AUTHORITY | PK | TB_DECISION_AUTHORITY | AUTHORITY_ID |  |  | 의사결정 권한 식별자 |
| FK_DECISION_AUTHORITY_PROJECT | FK | TB_DECISION_AUTHORITY | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_DECISION_AUTHORITY_DECIDER | FK | TB_DECISION_AUTHORITY | DECIDER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 결정자 참조 |
| FK_DECISION_AUTHORITY_REVIEWER | FK | TB_DECISION_AUTHORITY | REVIEWER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 검토자 참조 |
| FK_DECISION_AUTHORITY_ESCALATION | FK | TB_DECISION_AUTHORITY | ESCALATION_ID | TB_PARTICIPANT | PARTICIPANT_ID | 상위 보고 대상 참조 |
| PK_TB_DECISION_AUTHORITY_CONSULTATION | PK | TB_DECISION_AUTHORITY_CONSULTATION | AUTHORITY_ID, PARTICIPANT_ID |  |  | 협의 대상 복합 식별자 |
| FK_AUTH_CONSULTATION_AUTHORITY | FK | TB_DECISION_AUTHORITY_CONSULTATION | AUTHORITY_ID | TB_DECISION_AUTHORITY | AUTHORITY_ID | 의사결정 권한 참조 |
| FK_AUTH_CONSULTATION_PARTICIPANT | FK | TB_DECISION_AUTHORITY_CONSULTATION | PARTICIPANT_ID | TB_PARTICIPANT | PARTICIPANT_ID | 참여자 참조 |
| PK_TB_ESCALATION_PATH | PK | TB_ESCALATION_PATH | PATH_ID |  |  | 보고 경로 식별자 |
| FK_ESCALATION_PATH_PROJECT | FK | TB_ESCALATION_PATH | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_ESCALATION_PATH_TO | FK | TB_ESCALATION_PATH | ESCALATE_TO_ID | TB_PARTICIPANT | PARTICIPANT_ID | 2차 보고 대상 참조 |
| FK_ESCALATION_PATH_DECIDER | FK | TB_ESCALATION_PATH | FINAL_DECIDER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 최종 결정자 참조 |
| PK_TB_COMMUNICATION_SCHEME | PK | TB_COMMUNICATION_SCHEME | SCHEME_ID |  |  | 보고체계/회의체 식별자 |
| FK_COMMUNICATION_SCHEME_PROJECT | FK | TB_COMMUNICATION_SCHEME | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_COMMUNICATION_SCHEME_OWNER | FK | TB_COMMUNICATION_SCHEME | OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 운영 책임자 참조 |
| PK_TB_COMMUNICATION_ATTENDEE | PK | TB_COMMUNICATION_ATTENDEE | SCHEME_ID, PARTICIPANT_ID |  |  | 참석자 복합 식별자 |
| FK_COMM_ATTENDEE_SCHEME | FK | TB_COMMUNICATION_ATTENDEE | SCHEME_ID | TB_COMMUNICATION_SCHEME | SCHEME_ID | 회의체 참조 |
| FK_COMM_ATTENDEE_PARTICIPANT | FK | TB_COMMUNICATION_ATTENDEE | PARTICIPANT_ID | TB_PARTICIPANT | PARTICIPANT_ID | 참석자 참조 |
| PK_TB_DECISION_MANAGEMENT | PK | TB_DECISION_MANAGEMENT | PROJECT_ID |  |  | 프로젝트별 의사결정 관리 기준 식별자 |
| FK_DECISION_MANAGEMENT_PROJECT | FK | TB_DECISION_MANAGEMENT | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_DECISION_MANAGEMENT_OWNER | FK | TB_DECISION_MANAGEMENT | ACTION_ITEM_OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | Action Item 관리 주체 참조 |
| PK_TB_DECISION_REVIEW_ATTENDEE | PK | TB_DECISION_REVIEW_ATTENDEE | PROJECT_ID, PARTICIPANT_ID |  |  | Sprint Review 참석자 복합 식별자 |
| FK_DECISION_REVIEW_PROJECT | FK | TB_DECISION_REVIEW_ATTENDEE | PROJECT_ID | TB_DECISION_MANAGEMENT | PROJECT_ID | 의사결정 관리 기준 참조 |
| FK_DECISION_REVIEW_PARTICIPANT | FK | TB_DECISION_REVIEW_ATTENDEE | PARTICIPANT_ID | TB_PARTICIPANT | PARTICIPANT_ID | 참석자 참조 |
| PK_TB_DELIVERABLE | PK | TB_DELIVERABLE | DELIVERABLE_ID |  |  | 산출물 식별자 |
| FK_DELIVERABLE_PROJECT | FK | TB_DELIVERABLE | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_DELIVERABLE_REVIEWER | FK | TB_DELIVERABLE | REVIEWER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 검토자 참조 |
| FK_DELIVERABLE_APPROVER | FK | TB_DELIVERABLE | APPROVER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 승인자 참조 |
| PK_TB_RESOURCE | PK | TB_RESOURCE | RESOURCE_ID |  |  | 리소스 식별자 |
| FK_RESOURCE_PROJECT | FK | TB_RESOURCE | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_RESOURCE_OWNER | FK | TB_RESOURCE | OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 담당자 참조 |
| PK_TB_READINESS_CHECK | PK | TB_READINESS_CHECK | CHECK_ID |  |  | 준비상태 점검 식별자 |
| FK_READINESS_CHECK_PROJECT | FK | TB_READINESS_CHECK | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_READINESS_CHECK_OWNER | FK | TB_READINESS_CHECK | OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 담당자 참조 |
| PK_TB_RISK_ISSUE | PK | TB_RISK_ISSUE | RISK_ISSUE_ID |  |  | 리스크/이슈 식별자 |
| FK_RISK_ISSUE_PROJECT | FK | TB_RISK_ISSUE | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_RISK_ISSUE_OWNER | FK | TB_RISK_ISSUE | OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 담당자 참조 |
| PK_TB_OPEN_ITEM | PK | TB_OPEN_ITEM | OPEN_ITEM_ID |  |  | Open Item 식별자 |
| FK_OPEN_ITEM_PROJECT | FK | TB_OPEN_ITEM | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_OPEN_ITEM_OWNER | FK | TB_OPEN_ITEM | OWNER_ID | TB_PARTICIPANT | PARTICIPANT_ID | 담당자 참조 |
| PK_TB_SPRINT1_READINESS | PK | TB_SPRINT1_READINESS | READINESS_ID |  |  | Sprint 1 판정 식별자 |
| FK_SPRINT1_READINESS_PROJECT | FK | TB_SPRINT1_READINESS | PROJECT_ID | TB_PROJECT_PROFILE | PROJECT_ID | 프로젝트 참조 |
| FK_SPRINT1_READINESS_CONFIRMED_BY | FK | TB_SPRINT1_READINESS | CONFIRMED_BY | TB_PARTICIPANT | PARTICIPANT_ID | 확정자 참조 |

## Index 정의

| Index명 | Table | Column | Unique | 목적 | 비고 |
|---|---|---|---|---|---|
| IDX_PROJECT_PROFILE_01 | TB_PROJECT_PROFILE | PROJECT_TYPE | N | 프로젝트 유형별 조회 |  |
| IDX_PARTICIPANT_01 | TB_PARTICIPANT | PROJECT_ID, ROLE_TYPE | N | 프로젝트별 역할 조회 |  |
| IDX_PARTICIPANT_02 | TB_PARTICIPANT | PROJECT_ID, IS_APPROVER | N | 승인자 후보 조회 |  |
| IDX_DECISION_AUTHORITY_01 | TB_DECISION_AUTHORITY | PROJECT_ID, DECISION_TOPIC | N | 결정 항목별 권한 조회 |  |
| IDX_ESCALATION_PATH_01 | TB_ESCALATION_PATH | PROJECT_ID, ISSUE_TYPE | N | 이슈 유형별 보고 경로 조회 |  |
| IDX_COMMUNICATION_SCHEME_01 | TB_COMMUNICATION_SCHEME | PROJECT_ID, TYPE | N | 보고/회의체 유형별 조회 |  |
| IDX_DELIVERABLE_01 | TB_DELIVERABLE | PROJECT_ID, STATUS | N | 산출물 상태별 조회 |  |
| IDX_DELIVERABLE_02 | TB_DELIVERABLE | PROJECT_ID, DUE_DATE | N | 산출물 기한 조회 |  |
| IDX_RESOURCE_01 | TB_RESOURCE | PROJECT_ID, IS_SPRINT1_REQUIRED, STATUS | N | Sprint 1 필수 리소스 미준비 집계 |  |
| IDX_READINESS_CHECK_01 | TB_READINESS_CHECK | PROJECT_ID, AREA, STATUS | N | 영역별 준비상태 조회 |  |
| IDX_READINESS_CHECK_02 | TB_READINESS_CHECK | PROJECT_ID, SPRINT1_IMPACT | N | Sprint 1 영향도 집계 |  |
| IDX_RISK_ISSUE_01 | TB_RISK_ISSUE | PROJECT_ID, STATUS | N | 리스크/이슈 상태별 조회 |  |
| IDX_RISK_ISSUE_02 | TB_RISK_ISSUE | PROJECT_ID, SPRINT1_BLOCKING, STATUS | N | Sprint 1 저해 리스크 집계 |  |
| IDX_OPEN_ITEM_01 | TB_OPEN_ITEM | PROJECT_ID, STATUS | N | Open Item 상태별 조회 |  |
| IDX_OPEN_ITEM_02 | TB_OPEN_ITEM | PROJECT_ID, SPRINT1_IMPACT | N | Sprint 1 영향도별 Open Item 집계 |  |
| IDX_OPEN_ITEM_03 | TB_OPEN_ITEM | PROJECT_ID, SOURCE_ACTIVITY, SOURCE_TASK_NO | N | Activity/Task별 Open Item 추적 |  |
| IDX_SPRINT1_READINESS_01 | TB_SPRINT1_READINESS | PROJECT_ID, CONFIRMED_AT | N | 프로젝트별 판정 이력 조회 |  |

## Constraint 정의

| Constraint명 | 유형 | Table | Column | 조건 | 설명 |
|---|---|---|---|---|---|
| CK_PROJECT_PROFILE_TYPE | CHECK | TB_PROJECT_PROFILE | PROJECT_TYPE | IN ('POC_GENERAL','POC_PUBLIC','POC_FINANCE','PROD_GENERAL','PROD_PUBLIC','PROD_FINANCE') | 프로젝트 유형 제한 |
| CK_PARTICIPANT_ORGANIZATION | CHECK | TB_PARTICIPANT | ORGANIZATION | IN ('CUSTOMER','AXE','PARTNER','SUPPORT','OTHER') | 소속 구분 제한 |
| CK_PARTICIPANT_STATUS | CHECK | TB_PARTICIPANT | STATUS | IN ('CONFIRMED','TBD') | 참여자 확정 상태 제한 |
| CK_DECISION_AUTHORITY_STATUS | CHECK | TB_DECISION_AUTHORITY | STATUS | IN ('CONFIRMED','TBD') | 의사결정 권한 확정 상태 제한 |
| CK_ESCALATION_THRESHOLD | CHECK | TB_ESCALATION_PATH | THRESHOLD_DAYS | THRESHOLD_DAYS >= 0 | 기준 기간 음수 방지 |
| CK_DECISION_DELAY_THRESHOLD | CHECK | TB_DECISION_MANAGEMENT | DELAY_THRESHOLD_DAYS | DELAY_THRESHOLD_DAYS >= 0 | 지연 기준 음수 방지 |
| CK_DELIVERABLE_CATEGORY | CHECK | TB_DELIVERABLE | CATEGORY | IN ('MANDATORY','CONDITIONAL','OPTIONAL','EXCLUDED') | 산출물 구분 제한 |
| CK_DELIVERABLE_SUBMIT_BASIS | CHECK | TB_DELIVERABLE | SUBMIT_BASIS | IN ('BY_PHASE','BY_SPRINT','BY_GATE') | 제출 기준 제한 |
| CK_DELIVERABLE_STATUS | CHECK | TB_DELIVERABLE | STATUS | IN ('PENDING','SUBMITTED','APPROVED','REJECTED','REVISED') | 산출물 상태 제한 |
| CK_DELIVERABLE_REVIEW_DAYS | CHECK | TB_DELIVERABLE | CUSTOMER_REVIEW_DAYS | CUSTOMER_REVIEW_DAYS IS NULL OR CUSTOMER_REVIEW_DAYS >= 0 | 검토 기간 음수 방지 |
| CK_DELIVERABLE_REVISION_DAYS | CHECK | TB_DELIVERABLE | REVISION_DAYS | REVISION_DAYS IS NULL OR REVISION_DAYS >= 0 | 보완 기한 음수 방지 |
| CK_RESOURCE_TYPE | CHECK | TB_RESOURCE | TYPE | IN ('TOOL','ENVIRONMENT','ACCESS','REPOSITORY','ONBOARDING') | 리소스 유형 제한 |
| CK_RESOURCE_STATUS | CHECK | TB_RESOURCE | STATUS | IN ('READY','IN_PROGRESS','DELAYED','NOT_STARTED') | 리소스 상태 제한 |
| CK_READINESS_AREA | CHECK | TB_READINESS_CHECK | AREA | IN ('CUSTOMER','DATA','SECURITY') | 준비상태 영역 제한 |
| CK_READINESS_STATUS | CHECK | TB_READINESS_CHECK | STATUS | IN ('DONE','IN_PROGRESS','DELAYED','NOT_STARTED','NOT_APPLICABLE') | 준비상태 제한 |
| CK_SPRINT1_IMPACT_READINESS | CHECK | TB_READINESS_CHECK | SPRINT1_IMPACT | IN ('NONE','CONDITIONAL','BLOCKER') | Sprint 1 영향도 제한 |
| CK_RISK_ISSUE_TYPE | CHECK | TB_RISK_ISSUE | TYPE | IN ('RISK','ISSUE','DECISION_NEEDED') | 리스크/이슈 유형 제한 |
| CK_RISK_ISSUE_CATEGORY | CHECK | TB_RISK_ISSUE | CATEGORY | IN ('CUSTOMER_READINESS','DATA','SECURITY','SCHEDULE','OTHER') | 리스크/이슈 분류 제한 |
| CK_RISK_ISSUE_PROBABILITY | CHECK | TB_RISK_ISSUE | PROBABILITY | PROBABILITY IS NULL OR PROBABILITY IN ('HIGH','MEDIUM','LOW') | 발생 가능성 제한 |
| CK_RISK_ISSUE_IMPACT | CHECK | TB_RISK_ISSUE | IMPACT | IN ('HIGH','MEDIUM','LOW') | 영향도 제한 |
| CK_RISK_ISSUE_STATUS | CHECK | TB_RISK_ISSUE | STATUS | IN ('OPEN','MITIGATING','CLOSED') | 리스크/이슈 상태 제한 |
| CK_OPEN_ITEM_SOURCE_ACTIVITY | CHECK | TB_OPEN_ITEM | SOURCE_ACTIVITY | IN ('A1','A2','A3','A4','A5','A6','A7') | 출처 Activity 제한 |
| CK_OPEN_ITEM_TASK_NO | CHECK | TB_OPEN_ITEM | SOURCE_TASK_NO | SOURCE_TASK_NO >= 1 | Task 번호 양수 제한 |
| CK_OPEN_ITEM_IMPACT | CHECK | TB_OPEN_ITEM | SPRINT1_IMPACT | IN ('NONE','CONDITIONAL','BLOCKER') | Sprint 1 영향도 제한 |
| CK_OPEN_ITEM_TRANSFER_TO | CHECK | TB_OPEN_ITEM | TRANSFER_TO | IN ('SPRINT1','NEXT_ACTIVITY','PROJECT_PLAN','CUSTOMER_ACTION') | 이관 대상 제한 |
| CK_OPEN_ITEM_STATUS | CHECK | TB_OPEN_ITEM | STATUS | IN ('OPEN','IN_PROGRESS','RESOLVED','TRANSFERRED') | Open Item 상태 제한 |
| CK_SPRINT1_COUNTERS | CHECK | TB_SPRINT1_READINESS | BLOCKER_OPEN_ITEMS, CONDITIONAL_OPEN_ITEMS, RESOURCE_NOT_READY, BLOCKING_RISKS, READINESS_CHECK_BLOCKERS, DELIVERABLE_NO_APPROVER | 각 카운트 >= 0 | 집계 건수 음수 방지 |
| CK_SPRINT1_VERDICT | CHECK | TB_SPRINT1_READINESS | SYSTEM_SUGGESTION, PM_VERDICT | IN ('NORMAL_START','CONDITIONAL_START','SCOPE_ADJUSTED_START','CONFIRM_BEFORE_START') | Sprint 1 판정값 제한 |

## 특이사항 및 제약사항

- 실제 DB가 아직 구성되어 있지 않아 DB metadata, DDL, table comment, column comment는 확인되지 않았다.
- 현재 `Sprint0_Working_book` 구현은 JSON 파일 저장 방식이며, 본 문서는 RDB 도입 시 기준이 되는 초안이다.
- `Activity`, `ActivityResult`, `ExecutionPlan`, `Approval`, `ChangeHistory` 등 기존 구현 모델은 현행 Execution Plan Builder 영역에 이미 존재하므로, 본 문서는 PRD v0.2 Working System 핵심 모델(A1~A7 입력·판정 레이어)을 우선 대상으로 작성했다.
- 개인정보 가능 항목은 `TB_PARTICIPANT.NAME`, `TB_PARTICIPANT.CONTACT_CHANNEL`, `TB_PROJECT_PROFILE.AXE_PM_NAME`이며, 운영 DB 적용 시 암호화/마스킹/접근권한 정책 확인이 필요하다.
- PostgreSQL 기준으로 작성했으나, 실제 DBMS가 확정되면 UUID, JSONB, CHECK 제약, timestamp default 표현은 DBMS별 문법으로 조정해야 한다.
- 코드성 값은 초기에는 CHECK 제약으로 정의했으며, 운영 중 코드 관리가 필요해지면 공통코드 테이블로 분리하는 방안을 검토한다.
