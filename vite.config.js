import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import NodeModulesPolyfills from '@esbuild-plugins/node-modules-polyfill'
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

const builtinsPlugin ={ ...builtins({ crypto: true }), name: 'rollup-plugin-node-builtins' } // required, see https://github.com/vitejs/vite/issues/728
const globalsPlugin = { ...globals(), name: 'rollup-plugin-node-globals' } // required, see https://github.com/vitejs/vite/issues/728

export default defineConfig({
  plugins: [
    NodeModulesPolyfills(),
    GlobalsPolyfills(),
    reactRefresh()
  ],
  build: {
    rollupOptions: {
      plugins: [
        builtinsPlugin,
        globalsPlugin
      ]
    }
  }
})