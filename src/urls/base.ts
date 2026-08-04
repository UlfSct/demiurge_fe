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
  TOKEN: {
    REFRESH: {
      path: '/base/token/refresh/',
      method: 'POST' as const,
      isAuthNotRequired: true,
    },
  },
}

export default baseUrls
