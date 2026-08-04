import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { sendRequest } from '@/utils/requests.ts'
import { getEndpoint } from '@/utils/urls.ts'
import { urls } from '@/urls'
import type { ISODateString } from '@/types/brands.ts'
import type { RequestErrorObject } from '@/utils/types.ts'

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

type CurrentStoreErrors = {
  login: RequestErrorObject
  register: RequestErrorObject
  refresh: RequestErrorObject
}

export const useUserStore = defineStore('user', () => {
  const ACCESS_TOKEN_LS_KEY = 'token'
  const REFRESH_TOKEN_LS_KEY = 'refresh_token'

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
  const profile = ref<ProfileDetailRequestResponseData | null>(null)
  const getToken = computed(() => token.value)

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
    // TODO: перенаправление на главную
  }

  const login = async (data: LoginRequestPayloadData) => {
    let response = await sendRequest<LoginRequestResponseData>(
      getEndpoint(urls.BASE, ['LOGIN']),
      data,
    )

    if (!response.isSuccess) throw response.data

    setNewRefreshToken(response.data.refresh)
    setNewToken(response.data.access)
    // TODO: перенаправление на профиль
  }

  const register = async (data: RegisterRequestPayloadData) => {
    let response = await sendRequest<RegisterRequestResponseData>(
      getEndpoint(urls.BASE, ['REGISTER']),
      data,
    )

    if (!response.isSuccess) throw response.data

    await login({
      username: data.username,
      password: data.password,
    })
  }

  const refreshAccessToken = async () => {
    let response = await sendRequest<RefreshTokenRequestResponseData>(
      getEndpoint(urls.BASE, ['TOKEN', 'REFRESH']),
      {
        refresh: String(refreshToken.value),
      },
    )

    if (response.isSuccess) {
      token.value = response.data.access
      isAuthenticated.value = true
      return
    }

    if (response.statusCode === 401) {
      // TODO: если на главной - остаться, иначе - на логин
      return
    }

    throw new Error('Неизвестная ошибка обновления токена')
  }

  const loadProfile = async () => {
    let response = await sendRequest<ProfileDetailRequestResponseData>(
      getEndpoint(urls.USER, ['PROFILE', 'DETAIL']),
    )

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

  const setupRefreshTokenInterval = () => {}

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
    register,
    login,
    logout,
  }
})
