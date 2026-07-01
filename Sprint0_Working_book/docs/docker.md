# Docker로 로컬 기동

빌드 컨텍스트가 repo 루트(`d:\ProjectPlaybook`)이므로, 명령은 `Sprint0_Working_book/` 안에서 실행한다.
(server가 기존 mock의 `Sprint0_Playbook/activity_data.json`을 읽기 전용으로 참조하기 때문.)

```bash
cd Sprint0_Working_book
docker compose up -d --build
```

- 클라이언트: http://localhost:5173
- 서버 API: http://localhost:4000

## 데이터 영속성

- `data/`, `output/` 디렉터리를 호스트와 바인드 마운트한다. 컨테이너를 내리거나 재시작해도
  프로젝트 데이터와 `execution-plan.md`는 호스트에 그대로 남는다.
- `server/src`, `server/templates`, `client/src`도 마운트되어 있어 코드 수정 시 컨테이너
  재빌드 없이 즉시 반영된다(server는 `tsx watch`, client는 Vite HMR).

## 종료

```bash
docker compose down
```

## 로그 확인

```bash
docker compose logs -f server
docker compose logs -f client
```
