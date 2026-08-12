import { computed, type ComputedRef, type Ref, ref, shallowRef, watch } from 'vue'
import type { UrlEntry } from '@/types/urls.ts'
import type {
  PaginatedResponse,
  RequestParams,
  RequestParamValue,
  RequestQuery,
  RequestQueryValue,
} from '@/types/requests.ts'
import { executeWithMinDuration, sendRequest } from '@/utils/requests.ts'

export interface PaginatedListData<T> {
  page: Ref<number>
  itemsPerPage: Ref<number>
  getItems: ComputedRef<T[]>
  getCount: ComputedRef<number>
  getError: ComputedRef<string>
  getLoading: ComputedRef<boolean>
  setPage: (value: number) => void
  setItemsPerPage: (value: number) => void
  setRequestParam: (key: string, value: RequestParamValue) => void
  setRequestParams: (value: RequestParams) => void
  deleteRequestParam: (key: string) => void
  setAdditionalQueryParams: (value: RequestQuery) => void
  setAdditionalQueryParam: (key: string, value: RequestQueryValue) => void
  deleteAdditionalQueryParam: (key: string) => void
  clearRequestParams: () => void
  clearAdditionalQueryParams: () => void
}

export const usePaginatedListData = <T>(
  url: UrlEntry,
  defaultParams: RequestParams = {},
  defaultQuery: RequestQuery = {},
  pageQueryKey: string = 'page',
  itemsPerPageQueryKey: string = 'size',
): PaginatedListData<T> => {
  const items = shallowRef<T[]>([])
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(25)
  const count = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const requestParams = ref<RequestParams>({ ...defaultParams })
  const additionalQuery = ref<RequestQuery>({ ...defaultQuery })

  let needPageReset = false

  const getRequestQuery = (
    page: number,
    itemsPerPage: number,
    additionalQuery: RequestQuery,
  ): RequestQuery => {
    return {
      [pageQueryKey]: page,
      [itemsPerPageQueryKey]: itemsPerPage,
      ...additionalQuery,
    }
  }

  const loadData = async (params: RequestParams, query: RequestQuery) => {
    if (loading.value) return

    loading.value = true
    await executeWithMinDuration(async () => {
      let response = await sendRequest<PaginatedResponse<T>>(url, {}, params, query)

      if (!response.isSuccess) {
        error.value = 'Непредвиденная ошибка загрузки списка'
        loading.value = false
        return
      }

      error.value = ''
      items.value = response.data.data
      count.value = response.data.count
      loading.value = false
    })
  }

  watch(
    [requestParams, additionalQuery, page, itemsPerPage],
    async ([newParams, newQuery, newPage, newPerPage]) => {
      if (needPageReset && newPage !== 1) {
        page.value = 1
        needPageReset = false
        return
      }

      needPageReset = false
      await loadData(newParams, getRequestQuery(newPage, newPerPage, newQuery))
    },
    { immediate: true, deep: true },
  )

  const getItems: ComputedRef<T[]> = computed(() => items.value)
  const getCount = computed(() => count.value)
  const getError = computed(() => error.value)
  const getLoading = computed(() => loading.value)

  const setPage = (value: number) => {
    if (value <= 0) value = 1
    page.value = value
  }

  const setItemsPerPage = (value: number) => {
    if (value <= 0) value = 1
    itemsPerPage.value = value
  }

  const withPageReset = (fn: () => void): void => {
    fn()
    needPageReset = true
  }

  const setRequestParams = (value: RequestParams) => {
    withPageReset(() => (requestParams.value = { ...value }))
  }

  const setAdditionalQueryParams = (value: RequestQuery) => {
    withPageReset(() => (additionalQuery.value = { ...value }))
  }

  const setRequestParam = (key: string, value: RequestParamValue) => {
    withPageReset(() => (requestParams.value[key] = value))
  }

  const deleteRequestParam = (key: string) => {
    withPageReset(() => delete requestParams.value[key])
  }

  const setAdditionalQueryParam = (key: string, value: RequestQueryValue) => {
    withPageReset(() => (additionalQuery.value[key] = value))
  }

  const deleteAdditionalQueryParam = (key: string) => {
    withPageReset(() => delete additionalQuery.value[key])
  }

  const clearRequestParams = () => {
    withPageReset(() => (requestParams.value = {}))
  }

  const clearAdditionalQueryParams = () => {
    withPageReset(() => (additionalQuery.value = {}))
  }

  return {
    page,
    itemsPerPage,
    getItems,
    getCount,
    getError,
    getLoading,
    setPage,
    setItemsPerPage,
    setRequestParam,
    setRequestParams,
    deleteRequestParam,
    setAdditionalQueryParams,
    setAdditionalQueryParam,
    deleteAdditionalQueryParam,
    clearRequestParams,
    clearAdditionalQueryParams,
  }
}
