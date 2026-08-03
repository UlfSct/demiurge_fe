type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'

export type UrlEntry = {
  path: string
  method: RequestMethod
  isFormData?: boolean
  isEmptyResponse?: boolean
  isAuthNotRequired?: boolean
}

export type UrlGroup = {
  [key: string]: UrlGroup | UrlEntry
}

export type UrlObject = {
  [key: string]: UrlGroup
}
