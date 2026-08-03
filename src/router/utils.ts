import type { RouterObject } from '@/router/names.ts'

export const completeRouterNames = (root: RouterObject, base = '') => {
  for (let child of Object.keys(root)) {
    if (typeof root[child] === 'object') {
      completeRouterNames(root[child], `${base}|${child}`)
      continue
    }
    root[child] = `${base}|${child}`
  }
}
