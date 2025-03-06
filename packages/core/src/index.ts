import { type ComponentInternalInstance } from 'vue'
import { initCanvas } from './canvas'
import { queueflush, scheduledDom } from './scheduler'
import { mergeOptions } from './options'
import type { Options } from './types'

const HOOK = '__VUE_DEVTOOLS_GLOBAL_HOOK__'

export function VueChangeMarker(options?: Options) {
  if (options) mergeOptions(options)
  initCanvas()
  registerDevtoolsHook()
}

function emit(event: string, ...payload: any[]) {
  if (event === 'component:updated') {
    const updatedInstance = payload[3] as ComponentInternalInstance
    // 不考虑fragment
    const type = updatedInstance.vnode.type?.toString()
    if (type === 'Symbol(v-fgt)') return

    const el = updatedInstance.vnode.el! as HTMLElement | null
    if (!(el instanceof HTMLElement)) return
    scheduledDom.push({ dom: el, updatedInstance })
    queueflush()
  }
}

function registerDevtoolsHook() {
  if (!window[HOOK]) {
    window[HOOK] = { id: 'vue-change-marker', emit }
  }
  if (window[HOOK].id !== 'vue-change-marker') {
    const oldEmit = window[HOOK].emit
    window[HOOK].emit = function (...args: any[]) {
      oldEmit.call(window[HOOK], ...args)
      // @ts-expect-error
      emit(...args)
    }
  }
}
