import { HTTP_METHODS } from '@/utils/consts.ts'

const workspacesUrls = {
  LIST: {
    path: '/user/workspace/',
    method: HTTP_METHODS.GET,
  },
  CREATE: {
    path: '/user/workspace/',
    method: HTTP_METHODS.POST,
    isFormData: true,
  },
  DETAIL: {
    path: '/user/workspace/{id}/',
    method: HTTP_METHODS.GET,
  },
  EDIT: {
    path: '/workspace/admin/workspace/{id}/',
    method: HTTP_METHODS.PATCH,
    isFormData: true,
  },
  JOIN: {
    path: '/user/workspace/join/',
    method: HTTP_METHODS.POST,
  },
  LEAVE: {
    path: '/user/workspace/{id}/leave/',
    method: HTTP_METHODS.POST,
    isEmptyResponse: true,
  },
  MEMBERS: {
    LIST: {
      path: '/user/workspace/member/',
      method: HTTP_METHODS.GET,
    },
    EDIT: {
      path: '/workspace/admin/workspace/member/{id}/',
      method: HTTP_METHODS.PATCH,
    },
    DELETE: {
      path: '/workspace/admin/workspace/member/{id}/',
      method: HTTP_METHODS.DELETE,
      isEmptyResponse: true,
    },
  },
}

export default workspacesUrls
