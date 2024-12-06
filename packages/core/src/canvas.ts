import type { ComponentInternalInstance } from 'vue'

export let ctx: CanvasRenderingContext2D | null = null
const updateCounters = new WeakMap<HTMLElement, number>()
const elements = new Set<HTMLElement>()

export function initCanvas() {
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

  const canvasCtx = canvas.getContext('2d')!
  ctx = canvasCtx

  document.documentElement.appendChild(canvas)

  const dpi = window.devicePixelRatio || 1
  canvasCtx.canvas.width = dpi * window.innerWidth
  canvasCtx.canvas.height = dpi * window.innerHeight
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  canvasCtx.resetTransform()
  canvasCtx.scale(dpi, dpi)
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  ctx.clearRect(0, 0, width, height)
  ctx.restore()
}
export function resetCounters() {
  elements.forEach((el) => {
    updateCounters.set(el, 0)
  })
}

export function highlight(
  ctx: CanvasRenderingContext2D,
  el: HTMLElement,
  updatedInstance: ComponentInternalInstance,
) {
  let updateCounter = updateCounters.get(el) || 0
  updateCounter++

  updateCounters.set(el, updateCounter)
  elements.add(el)

  const padding = 4

  const opacity = Math.min(0.8, updateCounter * 0.3)
  const rect = el.getBoundingClientRect()

  const componentName =
    updatedInstance.type.__name || updatedInstance.type.__file || ''

  ctx.save()
  if (rect.width >= 120) {
    ctx.font = '14px Arial'
    const componentText = `updated component: ${componentName}`
    const timesText = `updated times: ${updateCounter}`
    const textWidth = Math.max(
      ctx.measureText(componentText).width,
      ctx.measureText(timesText).width,
    )
    ctx.fillStyle = `rgba(74, 222, 128, ${opacity})`
    if (rect.y > 40) {
      ctx.fillRect(rect.x, rect.y - 40, textWidth + padding * 2, 40)
    } else {
      ctx.fillRect(rect.x, rect.y, textWidth + padding * 2, 40)
    }

    ctx.fillStyle = `white`
    if (rect.y > 40) {
      ctx.fillText(componentText, rect.x + padding, rect.y - 25)
      ctx.fillText(timesText, rect.x + padding, rect.y - 5)
    } else {
      ctx.fillText(componentText, rect.x + padding, rect.y - 25 + 40)
      ctx.fillText(timesText, rect.x + padding, rect.y - 5 + 40)
    }
  } else {
    ctx.font = '14px Arial'
    const timesTextWidth = ctx.measureText(`${updateCounter}`).width
    ctx.fillStyle = `rgba(74, 222, 128, ${opacity})`
    ctx.fillRect(rect.x, rect.y - 20, timesTextWidth + padding * 2, 20)

    ctx.fillStyle = `white`
    ctx.fillText(`${updateCounter}`, rect.x + padding, rect.y - padding)
  }
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`
  ctx.lineWidth = 1
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
  ctx.restore()
}
