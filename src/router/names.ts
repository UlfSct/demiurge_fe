import { completeRouterNames } from '@/router/utils.ts'

export type RouterObject = {
  [key: string]: RouterObject | string | undefined
}

const routerNames = {
  MAIN: undefined,
  LOGIN: undefined,
  REGISTRATION: undefined,
  PROFILE: undefined,
  WORLDS: {
    LIST: undefined,
    DETAIL: {
      INDEX: undefined,
      AUTHORS: undefined,
      FILES: undefined,
      IMAGES: undefined,
      FACTIONS: undefined,
      LOCATIONS: undefined,
      ITEMS: undefined,
    },
  },
  WORKSPACES: {
    LIST: undefined,
    DETAIL: undefined,
  },
  CHARACTERS: {
    LIST: undefined,
  },
  PARTIES: {
    LIST: undefined,
  },
}

completeRouterNames(routerNames, 'USER')

export default routerNames
