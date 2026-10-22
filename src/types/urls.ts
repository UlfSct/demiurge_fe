import type { RequestMethod } from '@/types/requests.ts'

export type UrlEntry = {
  path: string
  method: RequestMethod
  isFormData?: boolean
  isEmptyResponse?: boolean
  isAuthNotRequired?: boolean
}
