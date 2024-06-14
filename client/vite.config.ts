import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    server: {
      host: "0.0.0.0",
      ...(mode === 'development' && {
        proxy: {
          "/api": {
            target: env.VITE_BACKEND_URL,
            changeOrigin: true,
            secure: false,
          },
        },
      }),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react()],
  };
});
