import { defineStore } from 'pinia'
import { onMounted, readonly, ref } from 'vue'
import { sendRequest, executeWithMinDuration } from '@/utils/requests.ts'
import { urls } from '@/urls'
import type { ISODateString } from '@/types/brands.ts'
import type { EmptyObject, FileObject } from '@/types/utils.ts'

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

export type LogoutRequestPayloadData = {
  refresh: string
}

export type RefreshTokenRequestPayloadData = {
  refresh: string
}

export type RefreshTokenRequestResponseData = {
  access: string
}

export type ProfileDetailRequestResponseData = {
  id: number
  last_name: string | null
  first_name: string | null
  username: string
  email: string
  date_joined: ISODateString
  avatar: FileObject | null
}

export type UpdateProfileRequestResponseData = {
  last_name: string | null
  first_name: string | null
  username: string
  email: string
  avatar: FileObject | null
}

export type ChangePasswordRequestPayloadData = {
  new_password: string
  old_password: string
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
  const isLoadingLogin = ref<boolean>(false)
  const isLoadingRegister = ref<boolean>(false)
  const isLoadingEditProfile = ref<boolean>(false)
  const isLoadingEditProfileAvatar = ref<boolean>(false)
  const isLoadingChangePassword = ref<boolean>(false)
  const profile = ref<ProfileDetailRequestResponseData | null>(null)
  const getToken = readonly(token)
  const getProfile = readonly(profile)
  const getIsInitialized = readonly(isInitialized)
  const getIsAuthenticated = readonly(isAuthenticated)
  const getIsLoadingLogin = readonly(isLoadingLogin)
  const getIsLoadingRegister = readonly(isLoadingRegister)
  const getIsLoadingEditProfile = readonly(isLoadingEditProfile)
  const getIsLoadingEditProfileAvatar = readonly(isLoadingEditProfileAvatar)
  const getIsLoadingChangePassword = readonly(isLoadingChangePassword)

  const setIsLoadingLoginValue = (value: boolean): void => {
    isLoadingLogin.value = value
  }

  const setIsLoadingRegisterValue = (value: boolean): void => {
    isLoadingRegister.value = value
  }

  const setIsLoadingEditProfile = (value: boolean): void => {
    isLoadingEditProfile.value = value
  }

  const setIsLoadingEditProfileAvatar = (value: boolean): void => {
    isLoadingEditProfileAvatar.value = value
  }

  const setIsLoadingChangePassword = (value: boolean): void => {
    isLoadingChangePassword.value = value
  }

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

  const updatedProfileValue = (data: ProfileDetailRequestResponseData | null) => {
    profile.value = data
  }

  const changePassword = async (data: ChangePasswordRequestPayloadData) => {
    await executeWithMinDuration(async () => {
      let response = await sendRequest<EmptyObject>(urls.USER.PASSWORD.CHANGE, data)
      if (!response.isSuccess) throw response.data
    })
  }

  const updateProfile = async (data: FormData) => {
    await executeWithMinDuration(async () => {
      let response = await sendRequest<UpdateProfileRequestResponseData>(
        urls.USER.PROFILE.UPDATE,
        data,
      )
      if (!response.isSuccess) throw response.data
      if (!profile.value) {
        await loadProfile()
        return
      }
      updatedProfileValue({
        id: profile.value.id,
        last_name: response.data.last_name,
        first_name: response.data.first_name,
        username: response.data.username,
        email: response.data.email,
        date_joined: profile.value.date_joined,
        avatar: response.data.avatar,
      })
    })
  }

  const logout = async () => {
    clearRefreshTokenInterval()
    let data: LogoutRequestPayloadData = {
      refresh: String(refreshToken.value),
    }
    isAuthenticated.value = false
    await sendRequest(urls.BASE.LOGOUT, data)
    clearTokenData()
  }

  const login = async (data: LoginRequestPayloadData, noMinDuration: boolean = false) => {
    await executeWithMinDuration(
      async () => {
        let response = await sendRequest<LoginRequestResponseData>(urls.BASE.LOGIN, data)

        if (!response.isSuccess) throw response.data

        setNewRefreshToken(response.data.refresh)
        setNewToken(response.data.access)
        setupRefreshTokenInterval()
        await loadProfile()
      },
      noMinDuration ? 0 : 500,
    )
  }

  const register = async (data: RegisterRequestPayloadData) => {
    await executeWithMinDuration(async () => {
      let response = await sendRequest<RegisterRequestResponseData>(urls.BASE.REGISTER, data)

      if (!response.isSuccess) throw response.data

      await login(
        {
          username: data.username,
          password: data.password,
        },
        true,
      )
    })
  }

  const refreshAccessToken = async () => {
    let data: RefreshTokenRequestPayloadData = { refresh: String(refreshToken.value) }
    let response = await sendRequest<RefreshTokenRequestResponseData>(urls.BASE.TOKEN.REFRESH, data)

    if (response.isSuccess) {
      setNewToken(response.data.access)
      isAuthenticated.value = true
      if (!profile.value) await loadProfile()
      return
    }

    if (response.statusCode === 401) {
      clearRefreshTokenInterval()
      clearTokenData()
      isAuthenticated.value = false
      return
    }

    throw new Error('Неизвестная ошибка обновления токена')
  }

  const loadProfile = async () => {
    if (!token.value) {
      await refreshAccessToken()
      if (!profile.value) isAuthenticated.value = false
      return
    }

    let response = await sendRequest<ProfileDetailRequestResponseData>(urls.USER.PROFILE.DETAIL)

    if (response.isSuccess) {
      updatedProfileValue(response.data)
      isAuthenticated.value = true
      return
    }

    if (response.statusCode === 401) {
      await refreshAccessToken()
      if (!profile.value) isAuthenticated.value = false
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
    await executeWithMinDuration(async () => {
      await loadProfile()
      if (isAuthenticated.value) {
        setupRefreshTokenInterval()
      }
    })
  }

  onMounted(() => {
    if (!isInitialized.value) {
      initStore().then(() => (isInitialized.value = true))
    }
  })

  return {
    getToken,
    getProfile,
    getIsAuthenticated,
    getIsInitialized,
    getIsLoadingLogin,
    getIsLoadingRegister,
    getIsLoadingEditProfile,
    getIsLoadingEditProfileAvatar,
    getIsLoadingChangePassword,
    setIsLoadingLoginValue,
    setIsLoadingRegisterValue,
    setIsLoadingEditProfile,
    setIsLoadingEditProfileAvatar,
    setIsLoadingChangePassword,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
  }
})
