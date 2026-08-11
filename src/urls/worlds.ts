import { HTTP_METHODS } from '@/utils/consts.ts'

const worldsUrls = {
  LIST: {
    path: '/user/world/',
    method: HTTP_METHODS.GET,
  },
  CREATE: {
    path: '/user/world/',
    method: HTTP_METHODS.POST,
  },
  DETAIL: {
    AUTHOR: {
      UPDATE: {
        path: '/author/world/{id}/',
        method: HTTP_METHODS.PATCH,
      },
    },
    DEMIURGE: {
      UPDATE: {
        path: '/demiurge/world/{id}/',
        method: HTTP_METHODS.PATCH,
      },
      DELETE: {
        path: '/demiurge/world/{id}/',
        method: HTTP_METHODS.DELETE,
      },
    },
    GET: {
      path: '/user/world/{id}/',
      method: HTTP_METHODS.GET,
    },
  },
}

export default worldsUrls
