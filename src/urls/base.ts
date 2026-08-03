import type { UrlGroup } from '@/urls/types'

const baseUrls: UrlGroup = {
  LOGIN: {
    path: '/base/login/',
    method: 'POST',
    isAuthNotRequired: true,
  },
  REGISTER: {
    path: '/base/register/',
    method: 'POST',
    isAuthNotRequired: true,
  },
  TOKEN: {
    REFRESH: {
      path: '/base/refresh/',
      method: 'POST',
    },
  },
}

export default baseUrls
