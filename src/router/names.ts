import { completeRouterNames } from '@/router/utils.ts'

export type RouterObject = {
  [key: string]: RouterObject | string | undefined
}

const routerNames = {
  MAIN: undefined,
  LOGIN: undefined,
  REGISTRATION: undefined,
  PROFILE: undefined,
}

completeRouterNames(routerNames, 'USER')

export default routerNames
