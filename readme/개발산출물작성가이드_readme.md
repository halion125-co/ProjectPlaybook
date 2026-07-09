# 개발산출물작성가이드 README

## 1. 문서 목적

본 문서는 SI 프로젝트에서 개발 완료 또는 테스트 단계에 진입한 이후, 실제 개발 저장소(repository), DB 스키마, 설정 파일, 배포 정보 등을 기준으로 개발 산출물을 작성하기 위한 안내 문서이다.

기존처럼 Word, PPT 중심으로 산출물을 새로 작성하는 방식이 아니라, 이미 개발된 소스와 DB를 분석하여 고객에게 필요한 수준의 산출물을 작성하는 것을 목표로 한다.

이 문서는 전체 산출물을 순서대로 작성하라는 의미가 아니다. 프로젝트 범위와 고객 요청에 따라 필요한 산출물만 선택하여 작성한다.

예를 들어 다음과 같은 방식으로 선택 작성할 수 있다.

- 아키텍처정의서 중 Infra만 작성
- 아키텍처정의서 중 Software와 Data만 작성
- 데이터베이스설계서 중 Table 정의서만 작성
- 프로그램설계서 중 프로그램 목록과 인터페이스 설계서만 작성
- 배치가 없는 프로젝트에서는 배치 설계서 제외

---

## 2. 함께 제공되는 문서 구성

| 문서명 | 용도 | 사용 대상 |
|---|---|---|
| `개발산출물작성가이드_readme.md` | 산출물 작성 원칙, 산출물 선택 기준, 작성 범위 설명 | PM, PL, 개발리더, 고객 검토자 |
| `개발산출물생성.md` | 실제 산출물 작성 시 사용할 입력 양식, 생성 지시문, 산출물별 템플릿 | 개발리더, 개발자, 산출물 작성자 |

`개발산출물작성가이드_readme.md`는 산출물 작성 방향을 설명하는 안내서이다.  
`개발산출물생성.md`는 실제 프로젝트 정보를 채워 넣고 산출물을 작성할 때 사용하는 실행용 템플릿이다.

---

## 3. 산출물 작성 기본 원칙

산출물 작성자는 다음 원칙을 따른다.

| 원칙 | 설명 |
|---|---|
| 실제 구현 기준 | 기존 설계 문서보다 현재 repository와 DB를 우선한다. |
| 고객 필요 중심 | 고객이 시스템 구조, 운영 영향도, 유지보수 범위를 이해하는 데 필요한 내용 위주로 작성한다. |
| 선택 작성 | 모든 산출물을 일괄 작성하지 않고, 프로젝트 범위와 고객 요청에 맞게 선택 작성한다. |
| 과도한 상세 제외 | 소스코드 라인, 모든 클래스, 모든 메서드 수준의 상세 설명은 제외한다. |
| 기준 정보 명시 | repository, branch, commit ID, DB 기준일을 문서에 남긴다. |
| 수동 보완 구분 | 자동 추출 가능한 정보와 사람이 업무적으로 보완해야 하는 정보를 구분한다. |

---

## 4. 산출물 작성 단위

다음 산출물은 각각 독립적으로 작성할 수 있다.

| 산출물 분류 | 개별 산출물 | 주요 목적 |
|---|---|---|
| 아키텍처정의서 | Infra 아키텍처정의서 | 서버, 네트워크, 배포, 보안 구조 정의 |
| 아키텍처정의서 | Software 아키텍처정의서 | 애플리케이션, repository, 기술스택, 소스 구조 정의 |
| 아키텍처정의서 | Data 아키텍처정의서 | 데이터 저장소, DB, 데이터 흐름, 데이터 보안 정의 |
| 데이터베이스설계서 | DB Object 정의서 | Table, View, Procedure, Function, Trigger 등 DB Object 정의 |
| 데이터베이스설계서 | Entity 정의서 | 업무 Entity와 관계 정의 |
| 데이터베이스설계서 | Table 정의서 | 물리 Table, Column, Key, Index, Constraint 정의 |
| 데이터베이스설계서 | ERD | Table 간 관계 시각화 |
| 프로그램설계서 | 프로그램 목록 | 화면, API, Service, Common, Module 목록 정의 |
| 프로그램설계서 | 인터페이스 설계서 | 외부/내부 시스템 연계 구조, 전문, 오류 처리 정의 |
| 프로그램설계서 | 배치 설계서 | Batch, Scheduler, Job 처리 및 운영 기준 정의 |

---

## 5. 산출물 선택 기준

프로젝트에서 어떤 산출물을 작성해야 할지 판단할 때 다음 기준을 적용한다.

| 고객 요구 또는 프로젝트 상황 | 작성 권장 산출물 |
|---|---|
| 인프라 구성 설명이 필요함 | Infra 아키텍처정의서 |
| 서버, 포트, 배포, 보안 구조를 설명해야 함 | Infra 아키텍처정의서 |
| repository, application, module 구조 설명이 필요함 | Software 아키텍처정의서 |
| 개발자가 유지보수 구조를 빠르게 이해해야 함 | Software 아키텍처정의서 |
| 데이터 저장소와 데이터 흐름 설명이 필요함 | Data 아키텍처정의서 |
| DB Object 목록 제출이 필요함 | DB Object 정의서 |
| 업무 데이터 의미 설명이 필요함 | Entity 정의서 |
| 물리 테이블과 컬럼 정의가 필요함 | Table 정의서 |
| 테이블 관계를 시각적으로 설명해야 함 | ERD |
| 개발된 프로그램 전체 목록이 필요함 | 프로그램 목록 |
| 외부 또는 내부 시스템 연계가 있음 | 인터페이스 설계서 |
| 스케줄러, 정기 배치, 대량 처리 Job이 있음 | 배치 설계서 |

---

## 6. 산출물 작성 흐름

개발리더는 아래 흐름으로 산출물을 작성한다.

### 6.1 작성할 산출물 선택

먼저 고객 요구와 프로젝트 범위를 기준으로 필요한 산출물을 선택한다.

예를 들어 고객이 다음을 요구했다고 가정한다.

> 운영 이관을 위해 인프라 구성, 프로그램 목록, DB 테이블, 외부 연계, 배치 정보를 정리해 주세요.

이 경우 작성 대상은 다음과 같다.

| 고객 요구 | 작성 산출물 |
|---|---|
| 인프라 구성 | Infra 아키텍처정의서 |
| 프로그램 목록 | 프로그램 목록 |
| DB 테이블 | Table 정의서 |
| 외부 연계 | 인터페이스 설계서 |
| 배치 정보 | 배치 설계서 |

이 경우 Software 아키텍처정의서, Data 아키텍처정의서, Entity 정의서, ERD는 고객 요청이 없으면 제외할 수 있다.

### 6.2 기준 정보 확정

각 산출물에는 반드시 기준 정보를 먼저 작성한다.

```md
## 문서 기본 정보

| 항목 | 내용 |
|---|---|
| 시스템명 | 주문관리시스템 |
| 산출물명 | Infra 아키텍처정의서 |
| 작성 기준일 | 2026-06-16 |
| 대상 Repository | order-service, order-admin, order-batch |
| 대상 Branch | release/v1.0 |
| 기준 Commit ID | a13f9c2 |
| 대상 환경 | STG, PRD |
| DB 기준일 | 2026-06-15 |
```

이 정보가 중요한 이유는 나중에 소스나 DB가 변경되었을 때, 해당 산출물이 어떤 시점의 구현을 기준으로 작성되었는지 확인할 수 있기 때문이다.

### 6.3 Repository와 DB에서 정보 추출

| 추출 대상 | 주요 확인 내용 |
|---|---|
| Controller | API URL, Method, Request/Response DTO |
| Frontend Route | 화면 목록, 메뉴, URL/Route |
| Service | 업무 기능, 주요 처리 흐름, 트랜잭션 |
| Repository/Mapper/DAO | 사용 Table, SQL, DB 접근 방식 |
| Entity/Domain | Table/Column 매핑, 주요 데이터 구조 |
| application.yml/properties | DB, Redis, 외부 API, 포트, profile |
| Dockerfile | 실행 방식, runtime, 배포 패키지 |
| Kubernetes manifest/Helm | Deployment, Service, Ingress, CronJob |
| CI/CD pipeline | 빌드 및 배포 방식 |
| Cron/Scheduler 설정 | 배치 실행 주기 |
| DB metadata/DDL | Table, Column, PK, FK, Index, Constraint |

### 6.4 자동 추출 내용과 수동 보완 내용 분리

| 구분 | 예시 |
|---|---|
| 자동 추출 가능 | API URL, Method, Controller명, Table명, Column명, Data Type, Index명, Cron Expression |
| 수동 보완 필요 | 프로그램명, 업무 설명, 데이터 의미, 장애 처리 기준, 운영 재처리 절차, 논리 관계, 개인정보 판단 |

예를 들어 소스에서 다음 정보는 자동으로 확인할 수 있다.

```java
@PostMapping("/api/orders")
public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request)
```

자동 추출 가능 정보는 다음과 같다.

| 항목 | 값 |
|---|---|
| Method | POST |
| URL | /api/orders |
| Request DTO | OrderRequest |
| Response DTO | OrderResponse |

그러나 아래 정보는 사람이 보완해야 한다.

| 항목 | 보완 내용 |
|---|---|
| 프로그램명 | 주문 등록 |
| 업무 설명 | 사용자가 상품을 주문하고 결제를 요청하는 기능 |
| 사용 Table | TB_ORDER, TB_ORDER_ITEM, TB_PAYMENT |
| 예외 처리 | 재고 부족, 결제 실패, 주문 중복 요청 처리 |

---

## 7. 산출물별 작성 기준 요약

### 7.1 Infra 아키텍처정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 시스템이 어떤 인프라 환경에서 실행되고, 어떤 경로로 접근되며, 어떻게 배포되는지 설명 |
| 반드시 포함 | 환경 구분, 서버/컨테이너 역할, 사용자 접근 경로, 주요 포트, 배포 방식, 보안 구조 |
| 필요 시 포함 | 이중화, 장애 조치, Auto Scaling, 모니터링, 백업, 방화벽 상세 |
| 필요 정보 | 인프라 구성도, 서버 목록, Dockerfile, Kubernetes manifest, CI/CD, config, 보안 정보 |

권장 목차는 다음과 같다.

| 목차 | 작성 내용 |
|---|---|
| 문서 개요 | 작성 목적, 대상 시스템, 작성 기준 |
| 전체 인프라 구성 | 시스템 전체 구성도, 주요 구성요소 설명 |
| 환경별 구성 | DEV, STG, PRD 환경별 서버 및 서비스 구성 |
| 서버/컨테이너 구성 | 서버명, 역할, OS, 사양, 배포 서비스 |
| 네트워크 구성 | 사용자 접근 경로, 내부 통신 경로, 포트, 프로토콜 |
| 외부 연계 구성 | 외부 시스템 연결 구조, 연계 방향, 통신 방식 |
| 배포 구성 | 배포 단위, 배포 방식, CI/CD, 실행 방식 |
| 보안 구성 | HTTPS, 인증서, 접근제어, Secret 관리 |
| 특이사항 및 제약사항 | 운영 시 주의사항, 제약사항, 미확정 사항 |

### 7.2 Software 아키텍처정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 애플리케이션, 모듈, 기술스택, 소스 구조, 공통 기능 구조 설명 |
| 반드시 포함 | repository 목록, 애플리케이션 역할, 기술스택, 소스 계층 구조, 주요 처리 흐름, 공통 기능 |
| 필요 시 포함 | 멀티 모듈, 공통 library, 인증/인가, 예외 처리, 로깅, 파일 처리, 메시지 처리 |
| 필요 정보 | repository, build.gradle/pom.xml/package.json, package 구조, config, common module, security config |

권장 목차는 다음과 같다.

| 목차 | 작성 내용 |
|---|---|
| 문서 개요 | 작성 목적, 대상 시스템, 작성 기준 |
| 애플리케이션 구성 | repository, module, application 목록과 역할 |
| 기술스택 | 언어, framework, runtime, build tool, 주요 library |
| 소스 구조 | 주요 directory/package 구조와 역할 |
| 계층 구조 | Controller, Service, Repository, Domain 등 계층 설명 |
| 주요 처리 흐름 | 사용자 요청 또는 API 요청의 처리 흐름 |
| 공통 기능 구조 | 인증/인가, 예외, 로그, 공통응답, 파일, 암복호화 등 |
| 외부 연계 구조 | 외부 API Client, 연계 모듈, 연계 방식 |
| 특이사항 및 제약사항 | 구현상 주의사항, 기술 제약, 미확정 사항 |

### 7.3 Data 아키텍처정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 데이터 저장소, DB 구성, 주요 데이터 흐름, 데이터 보안 구조 설명 |
| 반드시 포함 | DBMS, Schema, 주요 저장소, 주요 데이터 흐름, 개인정보/중요정보 처리 여부 |
| 필요 시 포함 | Cache, 파일 저장소, 로그 저장소, 백업, 보관/삭제 정책, 암호화/마스킹 상세 |
| 필요 정보 | datasource config, DB metadata, DDL, migration script, Redis/Object Storage 설정, batch/interface source |

권장 목차는 다음과 같다.

| 목차 | 작성 내용 |
|---|---|
| 문서 개요 | 작성 목적, 대상 시스템, 작성 기준 |
| 데이터 저장소 구성 | DB, Cache, File Storage, Object Storage 등 구성 |
| DB 및 Schema 구성 | DBMS, schema, 주요 업무 영역 |
| 주요 데이터 흐름 | 생성, 조회, 변경, 삭제, 연계, 배치 흐름 |
| 데이터 보안 | 개인정보, 암호화, 마스킹, 접근제어 |
| 데이터 보관 및 삭제 | 보관 기간, 삭제 기준, 이력 관리 |
| 특이사항 및 제약사항 | 데이터 관리상 주의사항, 미확정 사항 |

### 7.4 DB Object 정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | DB에 존재하는 Table, View, Index, Sequence, Procedure, Function, Trigger 등 Object 목록과 용도 정의 |
| 반드시 포함 | Object 유형, Object명, Schema, 설명, 사용 여부, 관련 프로그램 또는 업무 |
| 필요 시 포함 | View SQL, Procedure/Function Parameter, Trigger 발생 조건, 미사용 Object |
| 필요 정보 | DB metadata, DDL, DB source, SQL mapper, repository, DAO, service source |

### 7.5 Entity 정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 업무 관점에서 관리해야 하는 주요 데이터 대상과 관계 설명 |
| 반드시 포함 | Entity명, 설명, 관련 업무, 대응 Table, 주요 식별자, 주요 속성, Entity 관계 |
| 필요 시 포함 | 생성/변경/삭제 조건, 업무 규칙, 논리 관계, 코드성/이력성 Entity 여부 |
| 필요 정보 | ORM Entity, domain class, table/column comment, FK, SQL join, service logic |

### 7.6 Table 정의서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 실제 DB에 생성된 물리 Table, Column, Key, Index, Constraint 정보 정의 |
| 반드시 포함 | Table명, 설명, Column명, Data Type, Length, Null, PK, FK, Default, Index |
| 필요 시 포함 | Tablespace, 보관 기간, 개인정보, 암호화, 마스킹, 파티션, 사용 프로그램 |
| 필요 정보 | DB metadata, DDL, DB comment, constraint/index metadata, code table, enum, SQL mapper |

### 7.7 ERD

| 항목 | 내용 |
|---|---|
| 작성 목적 | Table 간 관계를 시각적으로 표현하여 데이터 구조 이해 지원 |
| 반드시 포함 | 주요 Table, PK/FK 관계, 업무 영역별 관계, 주요 참조 관계, 관계 기준 컬럼 |
| 필요 시 포함 | FK가 없는 논리 관계, 코드 테이블 관계, 이력 테이블 관계, 대용량 테이블 관계 |
| 필요 정보 | Table 목록, PK/FK, SQL join, ORM relation, service logic, 업무 영역 기준 |

### 7.8 프로그램 목록

| 항목 | 내용 |
|---|---|
| 작성 목적 | 시스템을 구성하는 화면, API, Service, Module, Common 기능 목록 정리 |
| 반드시 포함 | 프로그램ID, 프로그램명, 유형, 업무 영역, 소스 경로, 주요 기능, 관련 API/화면, 사용 Table |
| 필요 시 포함 | 권한 Role, 호출 Service, Request/Response DTO, 외부 연계 여부, 개발 상태, 담당자 |
| 필요 정보 | frontend route, controller, swagger/openapi, service class, repository/mapper, security config |

### 7.9 인터페이스 설계서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 외부 또는 내부 시스템 간 API, 메시지, 파일, 데이터 연계 구조 정의 |
| 반드시 포함 | 인터페이스ID, 명칭, 송수신 시스템, 방향, 방식, Endpoint, 요청/응답, 인증, 오류 처리 |
| 필요 시 포함 | Timeout, Retry, 전문 예시, 파일 레이아웃, Queue/Topic, 로그 테이블, 수동 재처리 |
| 필요 정보 | API client, external system config, DTO, swagger/openapi, mapper, retry config, log table |

### 7.10 배치 설계서

| 항목 | 내용 |
|---|---|
| 작성 목적 | 정해진 주기 또는 조건에 따라 실행되는 Batch, Scheduler, Job 처리 구조와 운영 기준 정의 |
| 반드시 포함 | 배치ID, 배치명, 실행 주기, 실행 방식, 소스 경로, 목적, 사용 Table, 처리 흐름, 실패 처리, 재실행 가능 여부 |
| 필요 시 포함 | Cron Expression, Job/Step, 입출력 파일, 외부 연계, 상태 관리 테이블, 중복 방지, 알림 대상 |
| 필요 정보 | batch package, scheduler config, cron, Jenkins job, Spring Batch config, shell, Kubernetes CronJob |

---

## 8. 실제 작성 시 추천 방식

### Step 1. 산출물별 작성 대상 정하기

| 산출물 | 작성 여부 | 사유 |
|---|---|---|
| Infra 아키텍처정의서 | 작성 | 운영 이관 필요 |
| Software 아키텍처정의서 | 작성 | 유지보수 구조 설명 필요 |
| Data 아키텍처정의서 | 제외 | Table 정의서로 대체 가능 |
| DB Object 정의서 | 제외 | Procedure/Trigger 없음 |
| Entity 정의서 | 제외 | 고객 요청 없음 |
| Table 정의서 | 작성 | DB 설계 정보 제출 필요 |
| ERD | 작성 | 테이블 관계 설명 필요 |
| 프로그램 목록 | 작성 | 개발 범위 정리 필요 |
| 인터페이스 설계서 | 작성 | 결제/배송 연계 존재 |
| 배치 설계서 | 작성 | 정기 배치 존재 |

### Step 2. Repository와 DB에서 정보 추출하기

| 추출 대상 | 추출 결과 |
|---|---|
| Controller | API 목록 |
| Service | 프로그램 기능, 처리 흐름 |
| Repository/Mapper | 사용 Table |
| Entity | Table/Column 매핑 |
| application.yml | DB, Redis, 외부 API, 포트 |
| Dockerfile | 실행 방식 |
| Kubernetes manifest | 배포 구성 |
| Cron 설정 | 배치 실행 주기 |
| DB metadata | Table, Column, PK, Index |

### Step 3. 자동 추출 내용과 수동 보완 내용 분리하기

| 구분 | 예시 |
|---|---|
| 자동 추출 가능 | API URL, Method, Controller명, Table명, Column명, Data Type |
| 수동 보완 필요 | 프로그램명, 업무 설명, 데이터 의미, 장애 처리 기준, 운영 재처리 절차 |

---

## 9. 산출물별 핵심 작성 관점

| 산출물 | 핵심 작성 관점 | 예시 내용 |
|---|---|---|
| Infra 아키텍처정의서 | 어디에 어떻게 배포되는가 | 서버, 네트워크, 포트, 배포, 보안 |
| Software 아키텍처정의서 | 애플리케이션이 어떻게 구성되는가 | repository, module, 기술스택, 계층 구조 |
| Data 아키텍처정의서 | 데이터가 어디에 저장되고 흐르는가 | DB, Cache, File Storage, 데이터 흐름 |
| DB Object 정의서 | DB 내부 Object는 무엇인가 | Table, View, Procedure, Function, Trigger |
| Entity 정의서 | 업무 데이터의 의미는 무엇인가 | Entity, 주요 속성, 업무 규칙, 관계 |
| Table 정의서 | DB 물리 구조는 어떻게 되어 있는가 | Table, Column, PK, FK, Index |
| ERD | Table 간 관계는 어떻게 되는가 | 업무 영역별 Table 관계 |
| 프로그램 목록 | 어떤 기능이 개발되었는가 | 화면, API, Service, 사용 Table |
| 인터페이스 설계서 | 외부 시스템과 무엇을 주고받는가 | Endpoint, 요청/응답, 인증, 오류 처리 |
| 배치 설계서 | 정기 작업이 어떻게 실행되는가 | 실행주기, 처리 대상, 실패/재처리 |

---

## 10. 작성 제외 가능 기준

다음 내용은 고객 요청이 없거나 운영 영향도가 낮다면 제외할 수 있다.

| 제외 가능 항목 | 제외 기준 |
|---|---|
| Method 단위 상세 로직 | 소스코드 수준의 과도한 설명인 경우 |
| 모든 Class 목록 | 고객이 유지보수 단위로 필요로 하지 않는 경우 |
| 모든 SQL 상세 | 주요 SQL 또는 중요 처리만 설명해도 충분한 경우 |
| 모든 Library 설명 | 핵심 Framework와 주요 Library만 설명해도 충분한 경우 |
| 내부 Utility 상세 | 업무 영향도가 낮고 공통 모듈 목록으로 충분한 경우 |
| 테스트 코드 설명 | 고객 산출물 범위에 포함되지 않는 경우 |

---

## 11. 개발리더에게 전달할 핵심 메시지

> 본 가이드는 모든 산출물을 일괄 작성하라는 의미가 아니다.  
> 프로젝트 범위와 고객 요청에 따라 필요한 산출물만 선택하여 작성한다.  
> 각 산출물은 실제 repository, DB, 설정 파일, 배포 정보를 기준으로 작성하며, 고객이 시스템을 이해하고 운영·유지보수에 활용할 수 있는 수준으로 작성한다.  
> 소스코드의 모든 클래스나 메서드를 나열하는 것이 아니라, 프로그램 구조, 데이터 구조, 연계 구조, 배치 처리, 운영 영향도를 중심으로 정리한다.

개발리더는 산출물을 작성할 때 다음 질문을 기준으로 판단한다.

> 이 산출물을 보는 고객이나 운영자가 무엇을 알아야 하는가?

그 답이 산출물의 핵심 내용이다.

| 산출물 영역 | 설명해야 할 핵심 |
|---|---|
| Infra | 운영 구조 |
| Software | 개발 구조 |
| Data/Table/ERD | 데이터 구조 |
| 프로그램 목록 | 기능 구조 |
| 인터페이스 | 연계 구조 |
| 배치 | 운영 처리 구조 |

---

## 12. 실제 산출물 작성 시 사용할 문서

실제 산출물을 작성할 때는 `개발산출물생성.md`를 사용한다.

`개발산출물생성.md`에는 다음 내용이 포함되어 있다.

- 프로젝트 기본 정보 입력 양식
- 작성 대상 산출물 선택표
- repository 및 DB 분석 결과 입력 양식
- 산출물 생성 지시문
- 산출물별 작성 템플릿
- 산출물별 작성 예시
- 최종 검수 체크리스트
