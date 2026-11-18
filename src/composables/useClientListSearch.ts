import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { ITEMS_PER_PAGE_SELECTOR_ITEMS } from '@/utils/consts.ts'

interface IPaginatedStore {
  getItemsPerPage: number
  setPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
}

// API пока не умеет искать по названию, поэтому на время поиска грузим весь список одной страницей.
const SEARCH_ITEMS_PER_PAGE = 500

/**
 * Клиентский поиск по уже загруженному списку: при вводе запроса список догружается целиком,
 * строки фильтруются по `getSearchText`, пагинация на странице скрывается вызывающей стороной.
 */
export const useClientListSearch = <T>(
  store: IPaginatedStore,
  items: Ref<T[]>,
  getSearchText: (item: T) => string,
) => {
  const search = ref<string>('')
  const savedItemsPerPage = ref<number | null>(null)

  const isSearching = computed(() => search.value.trim().length > 0)

  const filteredItems = computed(() => {
    const query = search.value.trim().toLowerCase()
    if (!query) return items.value

    return items.value.filter((item) => {
      return getSearchText(item).toLowerCase().includes(query)
    })
  })

  watch(isSearching, (value) => {
    if (value) {
      savedItemsPerPage.value = store.getItemsPerPage
      store.setPage(1)
      store.setItemsPerPage(SEARCH_ITEMS_PER_PAGE)
      return
    }

    const itemsPerPage = savedItemsPerPage.value ?? Number(ITEMS_PER_PAGE_SELECTOR_ITEMS[0])
    savedItemsPerPage.value = null
    store.setPage(1)
    store.setItemsPerPage(itemsPerPage)
  })

  // Стор живёт дольше страницы: возвращаем размер страницы, чтобы он не «протекал» на следующий заход.
  onBeforeUnmount(() => {
    if (savedItemsPerPage.value === null) return
    store.setItemsPerPage(savedItemsPerPage.value)
    savedItemsPerPage.value = null
  })

  return {
    search,
    isSearching,
    filteredItems,
  }
}
