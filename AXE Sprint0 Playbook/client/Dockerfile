FROM node:20-slim

WORKDIR /app

COPY ["AXE Sprint0 Playbook/client/package.json", "./"]
RUN npm install

COPY ["AXE Sprint0 Playbook/client/tsconfig.json", "AXE Sprint0 Playbook/client/vite.config.ts", "AXE Sprint0 Playbook/client/index.html", "./"]
COPY ["AXE Sprint0 Playbook/client/src", "./src"]

EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]
