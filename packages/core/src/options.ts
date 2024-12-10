import type { Options } from './types'

const defaultOptions: Options = {
  hideDelay: 300,
}

export const currentOptions: Options = Object.assign({}, defaultOptions)

export function mergeOptions(options: Options) {
  Object.assign(currentOptions, options)
}
