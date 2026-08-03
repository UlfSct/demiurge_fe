import type { UrlEntry, UrlGroup } from '@/urls/types.ts'

export function getEndpoint(obj: UrlGroup | undefined, path: string[]): UrlEntry {
  if (!obj) {
    throw new Error(`Не удалось получить данные URL`)
  }

  let current: UrlEntry | UrlGroup = obj
  for (const key of path) {
    current = (current as any)[key]
    if (!current) {
      throw new Error(`Некорректный путь объекта URL`)
    }
  }

  if (!current.path || !current.method) {
    throw new Error(`Не удалось получить данные URL`)
  }

  return current as UrlEntry
}
