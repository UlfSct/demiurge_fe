export type RequestParamValue = string | number | boolean
export type RequestQueryValue = string | number | boolean | string[]
export type RequestParams = Record<string, RequestParamValue>
export type RequestQuery = Record<string, RequestQueryValue>

export interface RequestErrorEntry {
  [key: string]: string
}

export type RequestErrorObject = {
  [key: string]: RequestErrorEntry | string
}

interface ISuccessResponse<T> {
  isSuccess: true
  statusCode: number
  data: T
  errors: null
}

interface ISuccessEmptyResponse {
  isSuccess: true
  statusCode: number
}

interface IErrorResponse {
  isSuccess: false
  statusCode: number
  data: RequestErrorObject
}

export type RequestResponse<T> = ISuccessResponse<T> | ISuccessEmptyResponse | IErrorResponse

export interface CookieOptions {
  expires?: Date | number | string
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  maxAge?: number
  httpOnly?: boolean
  partitioned?: boolean
}
