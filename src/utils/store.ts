import { defineStore } from 'pinia'
import { usePaginatedListData } from '@/composables/usePaginatedListData.ts'
import type { UrlEntry } from '@/types/urls.ts'
import type { Ref } from 'vue'

export type BasePaginatedStore<T> = {
  getItems: Ref<T[]>
  getCount: Ref<number>
  getLoading: Ref<boolean>
  getError: Ref<string | null>
  setPage: (page: number) => void
  setItemsPerPage: (count: number) => void
}

type PaginatedListStoreOptions<T, E extends Record<string, any> = {}> = {
  storeId: string
  listUrl: UrlEntry
  extendSetup?: (baseStore: BasePaginatedStore<T>) => E
}

export function createPaginatedListStore<T, E extends Record<string, any> = {}>(
  options: PaginatedListStoreOptions<T, E>,
) {
  const { storeId, listUrl, extendSetup } = options

  return defineStore(storeId, () => {
    const { getItems, getCount, getLoading, getError, setPage, setItemsPerPage } =
      usePaginatedListData<T>(listUrl)

    const baseStore: BasePaginatedStore<T> = {
      getItems,
      getCount,
      getLoading,
      getError,
      setPage,
      setItemsPerPage,
    }

    const extendedStore = extendSetup ? extendSetup(baseStore) : ({} as E)

    return {
      ...baseStore,
      ...extendedStore,
    }
  })
}
