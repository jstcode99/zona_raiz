import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts", "./__tests__/setup/components.tsx"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/components/ui": path.resolve(__dirname, "./app/components/ui"),
      "@/app/components/ui": path.resolve(__dirname, "./app/components/ui"),
    },
  },
});
