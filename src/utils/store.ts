import { defineStore } from 'pinia'
import { usePaginatedListData } from '@/composables/usePaginatedListData.ts'
import type { UrlEntry } from '@/types/urls.ts'
import { computed, readonly, ref, type Ref } from 'vue'
import type { RequestParams, RequestQuery } from '@/types/requests.ts'
import { executeWithMinDuration, sendRequest } from '@/utils/requests.ts'

type BasePaginatedStore<T> = {
  getItems: Ref<T[]>
  getCount: Ref<number>
  getItemsPerPage: Ref<number>
  getLoading: Ref<boolean>
  getPage: Ref<number>
  getError: Ref<string | null>
  setPage: (page: number) => void
  setItemsPerPage: (count: number) => void
}

type BaseActionStore<TData extends object> = {
  getLoading: Ref<boolean>
  execute: (data: TData, params?: RequestParams, query?: RequestQuery) => Promise<void>
}

type BaseDetailStore<TData extends object> = {
  getLoading: Ref<boolean>
  getItem: Ref<TData | null>
  execute: (data: {}, params?: RequestParams, query?: RequestQuery) => Promise<void>
}

type StoreOptions = {
  storeId: string
  url: UrlEntry
}

export function createPaginatedListStore<T extends object>(options: StoreOptions) {
  const { storeId, url } = options

  return defineStore(storeId, () => {
    const {
      getItems,
      getCount,
      getLoading,
      getError,
      getItemsPerPage,
      getPage,
      setPage,
      setItemsPerPage,
    } = usePaginatedListData<T>(url)

    const baseStore: BasePaginatedStore<T> = {
      getItems,
      getItemsPerPage,
      getPage,
      getCount,
      getLoading,
      getError,
      setPage,
      setItemsPerPage,
    }

    return {
      ...baseStore,
    }
  })
}

export function createBaseDetailStore<T extends object>(options: StoreOptions) {
  const { storeId, url } = options

  return defineStore(storeId, () => {
    const loading = ref<boolean>(false)
    const item = ref<T | null>(null)
    const getLoading = readonly(loading)
    const getItem = computed(() => item.value)

    const execute = async (
      data: {} = {},
      params: RequestParams = {},
      query: RequestQuery = {},
    ): Promise<void> => {
      if (loading.value) return

      loading.value = true
      try {
        await executeWithMinDuration(async () => {
          let response = await sendRequest<T>(url, data, params, query)
          if (!response.isSuccess) throw response.data
          item.value = response.data
        })
      } catch (error) {
        loading.value = false
        throw error
      }
      loading.value = false
    }

    const baseStore: BaseDetailStore<T> = {
      getLoading,
      getItem,
      execute,
    }

    return {
      ...baseStore,
    }
  })
}

export function createBaseActionStore<TData extends object>(options: StoreOptions) {
  const { storeId, url } = options

  return defineStore(storeId, () => {
    const loading = ref<boolean>(false)
    const getLoading = readonly(loading)

    const execute = async (
      data: TData = {} as TData,
      params: RequestParams = {},
      query: RequestQuery = {},
    ): Promise<void> => {
      if (loading.value) return

      loading.value = true
      try {
        await executeWithMinDuration(async () => {
          let response = await sendRequest<unknown>(url, data, params, query)
          if (!response.isSuccess) {
            throw response.data
          }
        })
      } catch (error) {
        loading.value = false
        throw error
      }
      loading.value = false
    }

    const baseStore: BaseActionStore<TData> = {
      getLoading,
      execute,
    }

    return {
      ...baseStore,
    }
  })
}
