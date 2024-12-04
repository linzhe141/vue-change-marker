import { type ComponentInternalInstance } from 'vue'

let ctx: CanvasRenderingContext2D | null = null
const updateCounters = new WeakMap<HTMLElement, number>()
const elements = new Set<HTMLElement>()

export function VueChangeMarker() {
  ctx = initCanvas()

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

      scheduler.addTask(() => highlight(ctx!, el, componentName))
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

function clearCanvas(ctx: CanvasRenderingContext2D) {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  ctx.clearRect(0, 0, width, height)
}
function resetAllUpdateCounters() {
  elements.forEach((el) => {
    updateCounters.set(el, 0) // 将每个元素的更新计数器重置为 0
  })
}

type HighlightTask = {
  fn: () => void
}

class HighlightScheduler {
  taskQueue: HighlightTask[] = []
  addTask(fn: () => void) {
    this.taskQueue.push({ fn })
  }

  // 执行队列中的所有任务
  async executeTasks() {
    if (this.taskQueue.length === 0) return
    while (this.taskQueue.length) {
      const task = this.taskQueue.shift()!
      task.fn()
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
    if (this.taskQueue.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      clearCanvas(ctx!)
      resetAllUpdateCounters()
    }
  }
}

// 测试
const scheduler = new HighlightScheduler()
executeTasks()

async function executeTasks() {
  if (scheduler.taskQueue.length) {
    await scheduler.executeTasks()
  }
  await new Promise((resolve) => setTimeout(resolve, 100))
  await executeTasks()
}

function highlight(
  ctx: CanvasRenderingContext2D,
  el: HTMLElement,
  componentName: string,
) {
  clearCanvas(ctx!)

  let updateCounter = updateCounters.get(el) || 0
  updateCounter++

  updateCounters.set(el, updateCounter)
  elements.add(el)

  const opacity = Math.min(0.7, updateCounter * 0.2)
  const rect = el.getBoundingClientRect()

  ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`
  ctx.fillRect(rect.x, rect.y - 20, rect.width, 20)

  ctx.fillStyle = `white`
  ctx.font = '14px Arial'
  ctx.fillText(
    'updated component: ' + componentName + '    x:' + updateCounter,
    rect.x,
    rect.y - 5,
  )

  ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`
  ctx.lineWidth = 1
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
}
