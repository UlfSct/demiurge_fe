const userUrls = {
  PROFILE: {
    DETAIL: {
      path: '/user/user/',
      method: 'GET' as const,
    },
    EDIT: {
      path: '/user/user/',
      method: 'PATCH' as const,
    },
  },
  PASSWORD: {
    CHANGE: {
      path: '/user/user/change/password/',
      method: 'POST' as const,
    },
  },
}

export default userUrls
