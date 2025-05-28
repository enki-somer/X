import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL),
  },
});
