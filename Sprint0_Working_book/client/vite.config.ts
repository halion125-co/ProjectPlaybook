import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Docker 컨테이너 안에서는 서버가 localhost가 아닌 별도 호스트명(서비스명)으로 떠 있으므로
// API_PROXY_TARGET 환경변수로 오버라이드할 수 있게 한다.
const apiProxyTarget = process.env.API_PROXY_TARGET ?? "http://localhost:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
