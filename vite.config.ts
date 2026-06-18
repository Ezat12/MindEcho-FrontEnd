import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://chef-reclining-deodorize.ngrok-free.dev",
        // target: "https://0e313f85-d390-4324-842b-04ffd79950e9.mock.pstmn.io",
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
  },
});
