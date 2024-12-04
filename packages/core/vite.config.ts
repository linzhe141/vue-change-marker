import { defineConfig } from 'vite'
import { resolve } from 'path'
export default defineConfig({
  build: {
    lib: {
      entry: './index.ts',
    },
    minify: false,
    rollupOptions: {
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          //强制所有文件使用命名导出模式
          exports: 'named',
          //配置打包根目录
          dir: resolve(__dirname, './dist'),
        },
      ],
    },
  },
})
