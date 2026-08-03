import { completeRouterNames } from '@/router/utils.ts'

export type RouterObject = {
  [key: string]: RouterObject | string | undefined
}

const ROUTER_NAMES: RouterObject = {
  MAIN: undefined,
  LOGIN: undefined,
  REGISTER: undefined,
  PROFILE: undefined,
}

completeRouterNames(ROUTER_NAMES, 'USER')

export default ROUTER_NAMES
