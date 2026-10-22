import { HTTP_METHODS } from '@/utils/consts.ts'

const getWorldBaseArticleUrls = (base: string) => {
  return {
    CREATE: {
      path: `/${base}/{id}/create/article/`,
      method: HTTP_METHODS.POST,
    },
    EDIT: {
      path: `/${base}/{id}/update/article/`,
      method: HTTP_METHODS.PATCH,
    },
    DELETE: {
      path: `/${base}/{id}/delete/article/`,
      method: HTTP_METHODS.DELETE,
    },
  }
}

const getWorldBaseFileUrls = (base: string) => {
  return {
    CREATE: {
      path: `/${base}/{id}/add/file/`,
      method: HTTP_METHODS.POST,
    },
    DELETE: {
      path: `/${base}/{id}/delete/file/{file_id}/`,
      method: HTTP_METHODS.DELETE,
    },
  }
}

const getWorldChildrenUrls = (base: string) => {
  return {
    LIST: {
      path: `/user/${base}/`,
      method: HTTP_METHODS.GET,
    },
    DETAIL: {
      path: `/user/${base}/{id}/`,
      method: HTTP_METHODS.GET,
    },
    CREATE: {
      path: `/author/${base}/`,
      method: HTTP_METHODS.POST,
    },
    EDIT: {
      path: `/author/${base}/{id}/`,
      method: HTTP_METHODS.PATCH,
    },
    DELETE: {
      path: `/author/${base}/{id}/`,
      method: HTTP_METHODS.DELETE,
    },
    FILES: getWorldBaseFileUrls(`author/${base}`),
    ARTICLE: getWorldBaseArticleUrls(`author/${base}`),
  }
}

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
    FILES: getWorldBaseFileUrls(`author/world`),
    ARTICLE: getWorldBaseArticleUrls(`author/world`),
    FACTIONS: getWorldChildrenUrls('faction'),
    ITEMS: getWorldChildrenUrls('item'),
    LOCATIONS: getWorldChildrenUrls('location'),
    AUTHOR: {
      EDIT: {
        path: '/author/world/{id}/',
        method: HTTP_METHODS.PATCH,
      },
      LEAVE: {
        path: '/author/world/{id}/leave/',
        method: HTTP_METHODS.POST,
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
