# Project Name

간단한 프로젝트 소개를 한두 문장으로 적습니다.

## 개요

이 프로젝트는 `frontend`와 `backend`로 구성된 웹 애플리케이션 템플릿입니다.  
필요한 기능과 기술 스택은 프로젝트 목적에 맞게 수정해서 사용하세요.

## 주요 기능

- 사용자 인증 및 권한 관리
- 핵심 비즈니스 기능
- 데이터 조회 및 수정
- 상태 관리 및 알림
- 운영 및 모니터링 지원

## 기술 스택

### Frontend
- Framework: React / Vue / Svelte 등
- Build Tool: Vite / Webpack / Next.js 등
- Styling: Tailwind CSS / CSS Modules / SCSS 등
- Routing: 프로젝트에 맞는 라우터
- State Management: TanStack Query / Redux / Zustand 등

### Backend
- Language: Go / Node.js / Python / Java 등
- Framework: Echo / Express / FastAPI / Spring 등
- Database: SQLite / PostgreSQL / MySQL 등
- Authentication: JWT / Session / API Key 등

### Infrastructure
- Container: Docker / Docker Compose
- CI/CD: GitHub Actions / GitLab CI / Jenkins 등
- Logging / Monitoring: 프로젝트에 맞게 구성

## 개발 환경

### 사전 요구사항

- Git
- Docker 및 Docker Compose
- Node.js, Go 등 필요한 런타임

### 환경 변수

`.env.example` 파일을 참고해 `.env`를 생성합니다.

```bash
cp .env.example .env
```

필요한 값은 프로젝트 설정에 맞게 채웁니다.

### 빠른 시작

```bash
docker compose up --build
```

실행 후 접속 주소는 프로젝트 설정에 맞게 수정합니다.

## 로컬 개발

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
go mod download
go run ./...
```

## 프로젝트 구조

```text
project-name/
├── frontend/              # 프론트엔드 애플리케이션
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/               # 백엔드 애플리케이션
│   ├── cmd/
│   ├── internal/
│   ├── migrations/
│   └── go.mod
│
├── docs/                  # 문서
├── data/                  # 로컬 데이터 파일
├── docker-compose.yml
├── .env.example
└── README.md
```

## API 문서

주요 API 엔드포인트와 요청/응답 예시는 `docs/api/`에 정리합니다.

예시:

- `POST /api/auth/login`
- `GET /api/items`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

## 개발 원칙

- 단순한 구조를 우선합니다.
- 명시적인 타입과 에러 처리를 사용합니다.
- 검증되지 않은 추상화는 최소화합니다.
- 비즈니스 로직과 인프라 코드를 분리합니다.

## Git Workflow

```bash
git checkout -b feature/your-feature
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

## 테스트

### Frontend

```bash
cd frontend
npm run test
```

### Backend

```bash
cd backend
go test ./...
```

## 배포

배포 방식은 프로젝트 환경에 맞게 작성합니다.

예시:

```bash
docker compose -f docker-compose.prod.yml up -d
```

## 백업 및 복구

데이터가 있는 프로젝트라면 백업 경로와 복구 절차를 여기에 적습니다.

## 라이선스

MIT License 또는 프로젝트에 맞는 라이선스를 기재합니다.

## 문의

프로젝트 관련 문의 채널을 여기에 적습니다.
