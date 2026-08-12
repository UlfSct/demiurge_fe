import { urls } from '@/urls'
import type { NumberSelectorItem } from '@/types/utils.ts'
import { createPaginatedListStore } from '@/utils/store.ts'

export type WorldsListItem = {
  id: number
  demiurge: string
  authors: NumberSelectorItem[]
  is_demiurge: boolean
  is_author: boolean
  name: string
  caption: string
  is_public: boolean
  article: number | null
}

export const useWorldsListStore = createPaginatedListStore<WorldsListItem>({
  storeId: 'worldsList',
  listUrl: urls.WORLDS.LIST,
})
