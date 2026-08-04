type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

export type UrlEntry = {
  path: string
  method: RequestMethod
  isFormData?: boolean
  isEmptyResponse?: boolean
  isAuthNotRequired?: boolean
}

export type UrlObject = {
  [key: string]: UrlObject | UrlEntry
}
