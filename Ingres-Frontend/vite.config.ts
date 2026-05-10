import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // ✅ Removed incorrect absolute references
      // react: path.resolve(__dirname, "node_modules/react"),
      // "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
});
