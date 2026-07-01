# 빌드 컨텍스트는 repo 루트(d:\ProjectPlaybook)여야 한다.
# server/src/repositories/activityCatalog.ts가 ../../Sprint0_Playbook/activity_data.json
# (기존 mock, 읽기 전용)을 참조하므로 해당 폴더도 함께 이미지에 포함한다.
# 호스트 폴더명("Sprint0_Working_book")은 컨테이너 내부에서는
# 경로 문제를 피하기 위해 axe-sprint0-playbook(공백 없음)으로 옮겨 사용한다.
FROM node:20-slim

WORKDIR /repo

COPY Sprint0_Playbook/activity_data.json Sprint0_Playbook/activity_data.json

WORKDIR /repo/axe-sprint0-playbook/server
COPY ["Sprint0_Working_book/server/package.json", "./"]
RUN npm install

COPY ["Sprint0_Working_book/server/tsconfig.json", "./"]
COPY ["Sprint0_Working_book/server/src", "./src"]
COPY ["Sprint0_Working_book/server/templates", "./templates"]

EXPOSE 4000
CMD ["npx", "tsx", "watch", "src/index.ts"]
