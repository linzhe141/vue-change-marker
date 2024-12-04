import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'

export default defineConfig({
  resolve: {
    // 直接使用源码
    alias: [
      {
        find: 'vue-scan',
        replacement: join(__dirname, '../packages/core/index.ts'),
      },
    ],
  },
  plugins: [vue()],
})
