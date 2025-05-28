import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";

// Load environment variables
dotenv.config();

// https://vitejs.dev/config/
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
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    cssMinify: true,
    modulePreload: {
      polyfill: true,
    },
    commonjsOptions: {
      include: [/node_modules/],
      extensions: [".js", ".cjs", ".mjs"],
      strictRequires: true,
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query",
            "react-hot-toast",
          ],
        },
      },
    },
  },
  css: {
    postcss: {
      plugins: [postcssImport, postcssNesting, tailwindcss, autoprefixer],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: [],
    esbuildOptions: {
      target: "es2020",
    },
  },
});
