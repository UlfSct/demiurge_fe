import { defineStore } from 'pinia'
import { usePaginatedListData } from '@/composables/usePaginatedListData.ts'
import type { UrlEntry } from '@/types/urls.ts'
import type { Ref } from 'vue'

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

type PaginatedListStoreOptions = {
  storeId: string
  listUrl: UrlEntry
}

export function createPaginatedListStore<T>(options: PaginatedListStoreOptions) {
  const { storeId, listUrl } = options

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
    } = usePaginatedListData<T>(listUrl)

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
