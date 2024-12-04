import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'

export default defineConfig({
  base: './',
  build: {
    minify: false,
    rollupOptions: {},
  },
  resolve: {
    // 直接使用源码
    alias: [
      {
        find: 'vue',
        replacement: join(
          __dirname,
          '../node_modules/vue/dist/vue.esm-browser.js'
        ),
      },
      {
        find: 'vue-change-marker',
        replacement: join(__dirname, '../packages/core/index.ts'),
      },
    ],
  },
  plugins: [vue()],
})
