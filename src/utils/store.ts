import { defineStore } from 'pinia'
import { usePaginatedListData } from '@/composables/usePaginatedListData.ts'
import type { UrlEntry } from '@/types/urls.ts'
import { readonly, ref, type Ref } from 'vue'
import type { PaginatedResponse, RequestParams, RequestQuery } from '@/types/requests.ts'
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

type BaseActionStore<TData extends object, TReturn extends object> = {
  getLoading: Ref<boolean>
  execute: (data: TData, params: RequestParams, query: RequestQuery) => Promise<void>
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

export function createBaseActionStore<TData extends object, TReturn extends object>(
  options: StoreOptions,
) {
  const { storeId, url } = options

  return defineStore(storeId, () => {
    const loading = ref<boolean>(false)
    const getLoading = readonly(loading)

    const execute = async (
      data: TData,
      params: RequestParams,
      query: RequestQuery,
    ): Promise<void> => {
      if (loading.value) return

      loading.value = true
      await executeWithMinDuration(async () => {
        let response = await sendRequest<PaginatedResponse<TReturn>>(url, data, params, query)
        if (!response.isSuccess) throw response.data
        loading.value = false
      })
    }

    const baseStore: BaseActionStore<TData, TReturn> = {
      getLoading,
      execute,
    }

    return {
      ...baseStore,
    }
  })
}
