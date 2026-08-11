import { HTTP_METHODS } from '@/utils/consts.ts'

const baseUrls = {
  LOGIN: {
    path: '/base/login/',
    method: HTTP_METHODS.POST,
    isAuthNotRequired: true,
  },
  REGISTER: {
    path: '/base/register/',
    method: HTTP_METHODS.POST,
    isAuthNotRequired: true,
  },
  LOGOUT: {
    path: '/base/logout/',
    method: HTTP_METHODS.POST,
  },
  TOKEN: {
    REFRESH: {
      path: '/base/token/refresh/',
      method: HTTP_METHODS.POST,
      isAuthNotRequired: true,
    },
  },
}

export default baseUrls
