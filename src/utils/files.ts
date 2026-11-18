const FILE_ICONS: Record<string, string> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  bmp: 'image',
  svg: 'image',
  avif: 'image',
  pdf: 'picture_as_pdf',
  doc: 'description',
  docx: 'description',
  odt: 'description',
  rtf: 'description',
  txt: 'article',
  md: 'article',
  log: 'article',
  xls: 'table_chart',
  xlsx: 'table_chart',
  csv: 'table_chart',
  ods: 'table_chart',
  ppt: 'slideshow',
  pptx: 'slideshow',
  odp: 'slideshow',
  zip: 'folder_zip',
  rar: 'folder_zip',
  '7z': 'folder_zip',
  tar: 'folder_zip',
  gz: 'folder_zip',
  json: 'code',
  xml: 'code',
  yml: 'code',
  yaml: 'code',
  html: 'code',
  css: 'code',
  js: 'code',
  ts: 'code',
  mp3: 'audiotrack',
  wav: 'audiotrack',
  ogg: 'audiotrack',
  flac: 'audiotrack',
  m4a: 'audiotrack',
  mp4: 'movie',
  webm: 'movie',
  mov: 'movie',
  avi: 'movie',
  mkv: 'movie',
}

export const getFileExtension = (fileName: string): string => {
  const cleanName = fileName.split(/[?#]/)[0] ?? ''
  const dotIndex = cleanName.lastIndexOf('.')
  if (dotIndex < 0 || dotIndex === cleanName.length - 1) return ''
  return cleanName.slice(dotIndex + 1).toLowerCase()
}

export const getFileIconName = (fileName: string): string => {
  return FILE_ICONS[getFileExtension(fileName)] ?? 'insert_drive_file'
}

export const getSafeFileName = (fileName: string, fallback: string): string => {
  const baseName = fileName.split(/[\\/]/).pop()?.trim() ?? ''
  return baseName || fallback
}

/** Скачивает файл как Blob, чтобы браузер взял имя и расширение из `download`, а не из URL с токеном. */
export const downloadFile = async (url: string, fileName: string): Promise<void> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Не удалось скачать файл: ${response.status}`)
  }

  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
