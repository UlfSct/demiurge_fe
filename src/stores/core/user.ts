import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { sendRequest } from '@/utils/requests.ts'
import { urls } from '@/urls'
import type { ISODateString } from '@/types/brands.ts'

export type LoginRequestPayloadData = {
  username: string
  password: string
}

export type LoginRequestResponseData = {
  access: string
  refresh: string
}

export type RegisterRequestPayloadData = {
  last_name: string
  first_name: string
  username: string
  email: string
  password: string
}

export type RegisterRequestResponseData = {
  last_name: string
  first_name: string
  username: string
  email: string
}

export type RefreshTokenRequestPayloadData = {
  refresh: string
}

export type RefreshTokenRequestResponseData = {
  access: string
}

export type ProfileDetailRequestResponseData = {
  id: number
  last_name: string
  first_name: string
  username: string
  email: string
  date_joined: ISODateString
}

export const useUserStore = defineStore('user', () => {
  const ACCESS_TOKEN_LS_KEY = 'token'
  const REFRESH_TOKEN_LS_KEY = 'refresh_token'
  const REFRESH_INTERVAL_TIMEOUT_MS = 10 * 60 * 1000

  const isInitialized = ref<boolean>(false)

  const getLocalStorageToken = () => localStorage.getItem(ACCESS_TOKEN_LS_KEY)
  const setLocalStorageToken = (value: string) => localStorage.setItem(ACCESS_TOKEN_LS_KEY, value)
  const removeLocalStorageToken = () => localStorage.removeItem(ACCESS_TOKEN_LS_KEY)
  const getLocalStorageRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_LS_KEY)
  const setLocalStorageRefreshToken = (value: string) =>
    localStorage.setItem(REFRESH_TOKEN_LS_KEY, value)
  const removeLocalStorageRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_LS_KEY)

  const isAuthenticated = ref<boolean>(false)
  const token = ref<string | null>(getLocalStorageToken() || null)
  const refreshToken = ref<string | null>(getLocalStorageRefreshToken() || null)
  const refreshTokenIntervalId = ref<number | null>(null)
  const profile = ref<ProfileDetailRequestResponseData | null>(null)
  const getToken = readonly(token)
  const getProfile = readonly(profile)
  const getIsInitialized = readonly(isInitialized)
  const getIsAuthenticated = readonly(isAuthenticated)

  const setNewToken = (value: string) => {
    setLocalStorageToken(value)
    token.value = value
  }

  const setNewRefreshToken = (value: string) => {
    setLocalStorageRefreshToken(value)
    refreshToken.value = value
  }

  const clearTokenData = () => {
    removeLocalStorageRefreshToken()
    removeLocalStorageToken()
    token.value = null
    refreshToken.value = null
  }

  const logout = () => {
    clearTokenData()
    isAuthenticated.value = false
    // TODO: запрос на бэк для сброса refresh
    clearRefreshTokenInterval()
  }

  const login = async (data: LoginRequestPayloadData) => {
    let response = await sendRequest<LoginRequestResponseData>(urls.BASE.LOGIN, data)

    if (!response.isSuccess) throw response.data

    setNewRefreshToken(response.data.refresh)
    setNewToken(response.data.access)
    setupRefreshTokenInterval()
    await loadProfile()
  }

  const register = async (data: RegisterRequestPayloadData) => {
    let response = await sendRequest<RegisterRequestResponseData>(urls.BASE.REGISTER, data)

    if (!response.isSuccess) throw response.data

    await login({
      username: data.username,
      password: data.password,
    })
  }

  const refreshAccessToken = async () => {
    let data: RefreshTokenRequestPayloadData = { refresh: String(refreshToken.value) }
    let response = await sendRequest<RefreshTokenRequestResponseData>(urls.BASE.TOKEN.REFRESH, data)

    if (response.isSuccess) {
      token.value = response.data.access
      isAuthenticated.value = true
      return
    }

    if (response.statusCode === 401) return

    throw new Error('Неизвестная ошибка обновления токена')
  }

  const loadProfile = async () => {
    let response = await sendRequest<ProfileDetailRequestResponseData>(urls.USER.PROFILE.DETAIL)

    if (response.isSuccess) {
      profile.value = response.data
      isAuthenticated.value = true
      return
    }

    if (response.statusCode === 401) {
      await refreshAccessToken()
      return
    }

    throw new Error('Неизвестная ошибка инициализации')
  }

  const clearRefreshTokenInterval = () => {
    if (!refreshTokenIntervalId.value) return
    clearInterval(refreshTokenIntervalId.value)
  }

  const setupRefreshTokenInterval = () => {
    refreshTokenIntervalId.value = setInterval(refreshAccessToken, REFRESH_INTERVAL_TIMEOUT_MS)
  }

  const initStore = async () => {
    await loadProfile()
    if (isAuthenticated.value) {
      setupRefreshTokenInterval()
    }
  }

  if (!isInitialized.value) {
    initStore().then(() => (isInitialized.value = true))
  }

  return {
    getToken,
    getProfile,
    getIsAuthenticated,
    getIsInitialized,
    register,
    login,
    logout,
  }
})
