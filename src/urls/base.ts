const baseUrls = {
  LOGIN: {
    path: '/base/login/',
    method: 'POST' as const,
    isAuthNotRequired: true,
  },
  REGISTER: {
    path: '/base/register/',
    method: 'POST' as const,
    isAuthNotRequired: true,
  },
  LOGOUT: {
    path: '/base/logout/',
    method: 'POST' as const,
  },
  TOKEN: {
    REFRESH: {
      path: '/base/token/refresh/',
      method: 'POST' as const,
      isAuthNotRequired: true,
    },
  },
}

export default baseUrls
