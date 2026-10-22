import type { ISODateString } from '@/types/brands.ts'

function pad(num: number): string {
  return num.toString().padStart(2, '0')
}

export function displayDate(date: ISODateString): string {
  const d = new Date(date)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export function displayDateWithTime(date: ISODateString): string {
  const d = new Date(date)
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
