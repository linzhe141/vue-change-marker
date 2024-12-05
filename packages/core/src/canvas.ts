import { ComponentInternalInstance } from 'vue'

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
  clearCanvas(ctx!)

  let updateCounter = updateCounters.get(el) || 0
  updateCounter++

  updateCounters.set(el, updateCounter)
  elements.add(el)

  const opacity = Math.min(0.9, updateCounter * 0.2)
  const rect = el.getBoundingClientRect()

  const componentName =
    updatedInstance.type.__name || updatedInstance.type.__file || ''

  ctx.save()
  ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`
  ctx.fillRect(rect.x, rect.y - 40, Math.max(250, rect.width), 40)
  ctx.fillStyle = `white`
  ctx.font = '14px Arial'
  ctx.fillText('updated component: ' + componentName, rect.x, rect.y - 25)
  ctx.fillText('updated times: ' + updateCounter, rect.x, rect.y - 5)
  ctx.restore()

  ctx.save()
  ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`
  ctx.lineWidth = 1
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
  ctx.restore()
}

export const getRect = (domNode: Element): DOMRect | null => {
  const style = window.getComputedStyle(domNode)
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return null
  }

  const rect = domNode.getBoundingClientRect()

  const isVisible =
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth

  if (!isVisible || !rect.width || !rect.height) {
    return null
  }

  return rect
}
