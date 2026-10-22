import { HTTP_METHODS } from '@/utils/consts.ts'

const selectorsUrls = {
  USERS: {
    path: '/selectors/user/',
    method: HTTP_METHODS.GET,
  },
  LOCATIONS: {
    path: '/selectors/location/type/',
    method: HTTP_METHODS.GET,
  },
  ITEMS: {
    path: '/selectors/item/type/',
    method: HTTP_METHODS.GET,
  },
  ROLES: {
    path: '/selectors/workspace/role/',
    method: HTTP_METHODS.GET,
  },
}

export default selectorsUrls
