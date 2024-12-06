import type { ComponentInternalInstance } from 'vue'
import { clearCanvas, ctx, highlight, resetCounters } from './canvas'

let isPending = false
let timer: number = 0
export const scheduledDom: {
  dom: HTMLElement
  updatedInstance: ComponentInternalInstance
}[] = []

function flush() {
  const item = scheduledDom[0]
  if (item) {
    const { dom, updatedInstance } = item
    highlight(ctx!, dom, updatedInstance)
    scheduledDom.shift()
    if (scheduledDom.length) {
      flush()
    } else {
      isPending = false
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        clearCanvas(ctx!)
        resetCounters()
      }, 300)
    }
  }
}

export function queueflush() {
  if (!isPending) {
    isPending = true
    Promise.resolve().then(flush)
  }
}
