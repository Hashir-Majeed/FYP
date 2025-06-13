import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "^(/multipass/api|/api)": {
        target: "https://hashir.euw-3.palantirfoundry.co.uk",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
