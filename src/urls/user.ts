const userUrls = {
  PROFILE: {
    DETAIL: {
      path: '/user/user/',
      method: 'GET' as const,
    },
    UPDATE: {
      path: '/user/user/',
      method: 'PATCH' as const,
      isFormData: true,
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
