import { readonly, ref, watchEffect } from 'vue'
import type { UrlEntry } from '@/types/urls.ts'
import type {
  PaginatedResponse,
  RequestParams,
  RequestParamValue,
  RequestQuery,
  RequestQueryValue,
} from '@/types/requests.ts'
import { sendRequest } from '@/utils/requests.ts'

export const usePaginatedListData = <T>(
  url: UrlEntry,
  defaultParams: RequestParams = {},
  defaultQuery: RequestQuery = {},
  pageQueryKey: string = 'page',
  itemsPerPageQueryKey: string = 'size',
) => {
  const items = ref<T[]>([])
  const page = ref<number>(1)
  const itemsPerPage = ref<number>(25)
  const count = ref<number>(0)
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  const requestParams = ref<RequestParams>({ ...defaultParams })
  const additionalQuery = ref<RequestQuery>({ ...defaultQuery })

  watchEffect(
    async () =>
      await loadData(page.value, itemsPerPage.value, requestParams.value, additionalQuery.value),
  )

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

  const loadData = async (
    page: number,
    itemsPerPage: number,
    requestParams: RequestParams,
    additionalQuery: RequestQuery,
  ) => {
    if (loading.value) return
    loading.value = true
    let response = await sendRequest<PaginatedResponse<T>>(
      url,
      {},
      requestParams,
      getRequestQuery(page, itemsPerPage, additionalQuery),
    )
    if (!response.isSuccess) {
      error.value = 'Непредвиденная ошибка загрузки списка'
      loading.value = false
      return
    }

    items.value = response.data.data
    count.value = response.data.count
    loading.value = false
  }

  const getCount = readonly(count)
  const getError = readonly(count)
  const getLoading = readonly(loading)

  const setPage = (value: number) => {
    if (value <= 0) value = 1
    page.value = value
  }

  const setItemsPerPage = (value: number) => {
    if (value <= 0) value = 1
    itemsPerPage.value = value
  }

  const setRequestParams = (value: RequestParams) => {
    requestParams.value = value
  }

  const setAdditionalQueryParams = (value: RequestQuery) => {
    additionalQuery.value = value
  }

  const setRequestParam = (key: string, value: RequestParamValue) => {
    requestParams.value[key] = value
  }

  const deleteRequestParam = (key: string) => {
    delete requestParams.value[key]
  }

  const setAdditionalQueryParam = (key: string, value: RequestQueryValue) => {
    additionalQuery.value[key] = value
  }

  const deleteAdditionalQueryParam = (key: string) => {
    delete additionalQuery.value[key]
  }

  const clearRequestParams = () => {
    requestParams.value = {}
  }

  const clearAdditionalQueryParams = () => {
    additionalQuery.value = {}
  }

  return {
    page,
    itemsPerPage,
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
