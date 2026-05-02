import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true, // dùng describe/it/expect không cần import
    environment: "jsdom", // giả lập browser environment
    setupFiles: "./src/test/setup.ts",
    css: false, // không cần parse CSS trong test
  },
  server: {
    watch: {
      usePolling: true, // Bật nếu HMR không nhận diện thay đổi file
    },
    // Tự động mở trình duyệt khi chạy lệnh dev
    open: true,
  },
});
