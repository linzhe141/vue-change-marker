import { ComponentInternalInstance } from 'vue'
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
    requestAnimationFrame(() => {
      highlight(ctx!, dom, updatedInstance)
      scheduledDom.shift()
      if (scheduledDom.length) {
        requestAnimationFrame(flush)
      } else {
        isPending = false
        clearTimeout(timer)
        timer = window.setTimeout(() => {
          clearCanvas(ctx!)
          resetCounters()
        }, 300)
      }
    })
  }
}

export const queueflush = async () => {
  if (!isPending) {
    isPending = true
    flush()
  }
}
