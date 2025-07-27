import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // hoặc dùng '0.0.0.0' để cho phép truy cập từ mạng LAN
    port: 5173, // hoặc cổng tùy bạn muốn
  },
});
