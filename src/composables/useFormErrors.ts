import type { RequestErrorObject } from '@/types/requests.ts'
import { ref } from 'vue'

export const useFormErrors = () => {
  const errors = ref<RequestErrorObject>({})

  const getError = (key: string): string | string[] | null => {
    let value = errors.value[key]
    if (!value) return null
    return value
  }

  const getErrors = (): RequestErrorObject => {
    return errors.value
  }

  const setError = (key: string, value: string): void => {
    errors.value[key] = value
  }

  const setErrors = (value: RequestErrorObject): void => {
    errors.value = value
  }

  const clearError = (key: string): void => {
    const { [key]: _, ...rest } = errors.value
    errors.value = rest as RequestErrorObject
  }

  const clearErrors = (): void => {
    errors.value = {}
  }

  const hasError = (key: string): boolean => {
    return !!getError(key)
  }

  const hasErrors = (): boolean => {
    return Object.keys(errors.value).length > 0
  }

  return {
    getError,
    getErrors,
    setError,
    setErrors,
    clearError,
    clearErrors,
    hasError,
    hasErrors,
  }
}
