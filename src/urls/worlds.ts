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
      EDIT: {
        path: '/author/world/{id}/',
        method: HTTP_METHODS.PATCH,
      },
    },
    DEMIURGE: {
      EDIT: {
        path: '/demiurge/world/{id}/',
        method: HTTP_METHODS.PATCH,
      },
      DELETE: {
        path: '/demiurge/world/{id}/',
        method: HTTP_METHODS.DELETE,
        isEmptyResponse: true,
      },
    },
    GET: {
      path: '/user/world/{id}/',
      method: HTTP_METHODS.GET,
    },
  },
}

export default worldsUrls
