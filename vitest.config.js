import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    globalSetup: ["./tests/global.setup.js"],
  },
});
