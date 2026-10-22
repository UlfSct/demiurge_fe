import type { ICookieOptions } from '@/types/cookie.ts'

export const setCookie = (name: string, value: string, options: ICookieOptions = {}): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date()
      date.setTime(date.getTime() + options.expires * 1000)
      cookieString += `; expires=${date.toUTCString()}`
    } else if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    } else {
      cookieString += `; expires=${options.expires}`
    }
  }

  if (options.maxAge) cookieString += `; max-age=${options.maxAge}`
  if (options.path) cookieString += `; path=${options.path ? options.path : '/'}`
  if (options.domain) cookieString += `; domain=${options.domain}`
  if (options.secure) cookieString += `; secure`
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`
  if (options.partitioned) cookieString += `; partitioned`

  document.cookie = cookieString
}

export const getCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'),
  )
  return matches ? decodeURIComponent(matches[1] ?? '') : null
}

export const deleteCookie = (
  name: string,
  options: Pick<ICookieOptions, 'path' | 'domain' | 'secure'> = {},
): void => {
  setCookie(name, '', {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  })
}

export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null
}
