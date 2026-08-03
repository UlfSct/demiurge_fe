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

  const isInitialized = ref<boolean>(false)

  const getLocalStorageToken = () => localStorage.getItem(ACCESS_TOKEN_LS_KEY)
  const setLocalStorageToken = (value: string) => localStorage.setItem(ACCESS_TOKEN_LS_KEY, value)
  const removeLocalStorageToken = () => localStorage.removeItem(ACCESS_TOKEN_LS_KEY)

  const isAuthenticated = ref<boolean>(false)
  const token = ref<string | null>(getLocalStorageToken() || null)
  const getToken = computed(() => token.value)

  const setNewToken = (value: string) => {
    setLocalStorageToken(value)
    token.value = value
  }

  const clearTokenData = () => {
    removeLocalStorageToken()
    token.value = null
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
  }

  const register = async (data: RegisterRequestPayloadData) => {
    let response = await sendRequest<RegisterRequestResponseData>(
      getEndpoint(urls.BASE, ['REGISTER']),
      data,
    )

    console.log(response)

    if (!response.isSuccess) throw response.data
    await login({
      username: data.username,
      password: data.password,
    })
  }

  const loadProfile = async () => {}

  const initStore = async () => {
    await sendRequest(getEndpoint(urls.USER, ['PROFILE', 'DETAIL']))
  }

  if (!isInitialized.value) {
    initStore().then(() => {
      isInitialized.value = true
    })
  }

  return {
    getToken,
    register,
    login,
    logout,
  }
})
