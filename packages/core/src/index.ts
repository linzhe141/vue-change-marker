import { type ComponentInternalInstance } from 'vue'
import { getRect, initCanvas } from './canvas'
import { queueflush, scheduledDom } from './scheduler'

export function VueChangeMarker() {
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
    if (!el) return
    // 注释节点之类的 transition 这类组件
    if (!el.getBoundingClientRect) return
    const rect = getRect(el)
    if (rect) {
      scheduledDom.push({ dom: el, updatedInstance })
    }
    queueflush()
  }
}

function registerDevtoolsHook() {
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__?.id !== 'vue-change-marker') {
    const oldEmit = window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit = function (...args: any[]) {
      oldEmit.call(window.__VUE_DEVTOOLS_GLOBAL_HOOK__, ...args)
      // @ts-expect-error
      emit(...args)
    }
  }
  if (!window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = { id: 'vue-change-marker', emit }
  }
}
