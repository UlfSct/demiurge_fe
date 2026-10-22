export interface ICookieOptions {
  expires?: Date | number | string
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  maxAge?: number
  httpOnly?: boolean
  partitioned?: boolean
}
