export const API_URL = String(import.meta.env.VITE_API_URL)
export const ALLOWED_FILE_MIME_TYPES = [
  'image/jpeg',
  'image/pjpeg',
  'image/gif',
  'image/jpeg',
  'image/png',
]
export const ALLOWED_FILE_TYPES = ALLOWED_FILE_MIME_TYPES.map(
  (item) => `.${String(item.split('/')[1])}`,
)
export const EMPTY_FILE_VALUE = '__clear__'
