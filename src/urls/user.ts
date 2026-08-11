import { HTTP_METHODS } from '@/utils/consts.ts'

const userUrls = {
  PROFILE: {
    DETAIL: {
      path: '/user/user/',
      method: HTTP_METHODS.GET,
    },
    UPDATE: {
      path: '/user/user/',
      method: HTTP_METHODS.PATCH,
      isFormData: true,
    },
  },
  PASSWORD: {
    CHANGE: {
      path: '/user/user/change/password/',
      method: HTTP_METHODS.POST,
    },
  },
}

export default userUrls
