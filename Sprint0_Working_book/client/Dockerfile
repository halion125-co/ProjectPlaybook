FROM node:20-slim

WORKDIR /app

COPY ["Sprint0_Working_book/client/package.json", "./"]
RUN npm install

COPY ["Sprint0_Working_book/client/tsconfig.json", "Sprint0_Working_book/client/vite.config.ts", "Sprint0_Working_book/client/index.html", "./"]
COPY ["Sprint0_Working_book/client/src", "./src"]

EXPOSE 5173
CMD ["npx", "vite", "--host", "0.0.0.0"]
