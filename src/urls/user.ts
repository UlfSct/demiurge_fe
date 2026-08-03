import type { UrlGroup } from '@/urls/types'

const userUrls: UrlGroup = {
  PROFILE: {
    DETAIL: {
      path: '/user/user/',
      method: 'GET',
    },
    EDIT: {
      path: '/user/user/',
      method: 'PATCH',
    },
  },
  PASSWORD: {
    CHANGE: {
      path: '/user/user/change/password/',
      method: 'POST',
    },
  },
}

export default userUrls
