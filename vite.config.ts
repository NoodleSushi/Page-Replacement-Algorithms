/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
  plugins: [vue()],
})
