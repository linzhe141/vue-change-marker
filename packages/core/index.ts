import { type ComponentInternalInstance } from 'vue'

export function VueChangeMarker() {
  const ctx = initCanvas()
  function emit(event: string, ...payload: any[]) {
    if (event === 'component:updated') {
      const updatedInstance = payload[3] as ComponentInternalInstance
      // 不考虑fragment
      const type = updatedInstance.vnode.type?.toString()
      if (type === 'Symbol(v-fgt)') return

      const componentName =
        updatedInstance.type.__file || updatedInstance.type.__name || ''
      const el = updatedInstance.vnode.el! as HTMLElement
      if (!el) return
      // 注释节点之类的 transition 这类组件
      if (!el.getBoundingClientRect) return
      const rect = el.getBoundingClientRect()
      const width = ctx.canvas.width
      const height = ctx.canvas.height

      ctx.font = '14px Arial'
      ctx.fillStyle = 'red'

      ctx.fillText('updated component: ' + componentName, rect.x, rect.y - 5)

      ctx.fillStyle = 'blue'
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
      setTimeout(() => {
        ctx.clearRect(0, 0, width, height)
      }, 100)
    }
  }
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

function initCanvas() {
  const canvas = document.createElement('canvas')
  canvas.id = 'vue-change-marker-canvas'
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '2147483646'
  canvas.setAttribute('aria-hidden', 'true')
  const ctx = canvas.getContext('2d')!
  document.documentElement.appendChild(canvas)

  const dpi = window.devicePixelRatio || 1
  ctx.canvas.width = dpi * window.innerWidth
  ctx.canvas.height = dpi * window.innerHeight
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`

  ctx.resetTransform()
  ctx.scale(dpi, dpi)

  return ctx
}
